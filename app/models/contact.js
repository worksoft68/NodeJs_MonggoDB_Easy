//**************************************************************************************************************************
//     Creation time: Saturday, 04 November 2023 3:34 PM
//     Creator: 
//**************************************************************************************************************************
var moment = require('moment');
const sendEmail 			= require(__path_helpers + 'sendEmail');
const mainSchema 	= require(__path_schemas + 'contact');
const LogModel = require(__path_models + 'sys_logs'); 
const systemConfig = require(__path_configs + 'system');
const collection = 'contact';//use this parameter to check permissions: save, select, delete.... 

module.exports = {
	saveInsert: async (item, userLogin) => {
		let data = {
			fullname: item.fullname,
			email: item.email,
			phone: item.phone,
			content_message: item.content_message,
			done_processing: item.done_processing,
		};
		let result =  await new mainSchema(data).save();
		sendEmailContact(data);
		let status = 406;
		let success = false;
		if (result) {
			data = result;
			status = 201;
			success = true;
		 }
		
		return {
			success: success,
			status: status,
			action: 'insert',
			data: data,
			message: result
		};
	},
	sendEmailContact: async (data) => {
		var date 				= new Date();
		let email = systemConfig.Email;
			let idEmail 		= " Id " + date.getDay().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString()+ date.getSeconds().toString()+ date.getMilliseconds().toString();
			let subject 		= " Contact letter " + data.fullname;
			
			let Body 			= " + Fullname: " + data.fullname;		
			Body += "<br /> + Email: " + data.email;
			Body += "<br /> + Phone: " + data.phone;
			Body += "<br /> + Content Message: " + data.content_message;
			Body += "<br /><br />" +idEmail;
			
			let ThamSoGuiEmail = {
				email 	: email,
				subject	: subject,
				message	: Body
			}
			let resultEmail = await sendEmail.sendEmailMicrosoft(ThamSoGuiEmail);
	
		return true;
	},

	saveUpdate: async (item, userLogin) => {
		let data = {
			fullname: item.fullname,
			email: item.email,
			phone: item.phone,
			content_message: item.content_message,
			done_processing: item.done_processing,
		};
		data["modified"] = {
			User_Id_Modified: userLogin.id, 
			User_Name_Modified: userLogin.firstname + ' '+ userLogin.lastname, 
			DateTime_Modified: Date.now() 
		};
		let item_Old = await mainSchema.findById(item.idHidden);
		if(item_Old){
			let result = await mainSchema.updateOne({_id: item.idHidden}, data);
			let status = 200;
			let success = true;
			if (result.modifiedCount <1){
				status = 406;
				success = false;
			}
			data["id"] = item.idHidden;
			await LogModel.saveLog("Update", collection, data.id, data, userLogin);
			return {
				success	: success,
				status	: status,
				action	: 'update',
				data	: data,
				message	: result
			};
		}
		else{
			return {
				success	: false,
				status	: 410,
				action	: 'update',
				data	: data,
				message	: 'Not found data'
			};
		}
	},

	listItems: async (params, userLogin, options=null) => {
		let objWhere    = {};
		let sort		= {};
		if(options != null){
			if((options.fullname != "") && (options.fullname != undefined)){
				objWhere.fullname = new RegExp(options.fullname, 'i');
			}
			if((options.email != "") && (options.email != undefined)){
				objWhere.email = new RegExp(options.email, 'i');
			}
			if((options.phone != "") && (options.phone != undefined)){
				objWhere.phone = new RegExp(options.phone, 'i');
			}
			if((options.content_message != "") && (options.content_message != undefined)){
				objWhere.content_message = new RegExp(options.content_message, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.DateTime_Created"] =  'desc'; 
		}
		let fields = ' id fullname email phone content_message done_processing';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.sort(sort)
			.skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
			.limit(params.pagination.totalItemsPerPage);
	},
	

	countItem: async (params, userLogin, options=null) => {
		let objWhere    = {};
		if(options != null){
			if((options.fullname != "") && (options.fullname != undefined)){
				objWhere.fullname = new RegExp(options.fullname, 'i');
			}
			if((options.email != "") && (options.email != undefined)){
				objWhere.email = new RegExp(options.email, 'i');
			}
			if((options.phone != "") && (options.phone != undefined)){
				objWhere.phone = new RegExp(options.phone, 'i');
			}
			if((options.content_message != "") && (options.content_message != undefined)){
				objWhere.content_message = new RegExp(options.content_message, 'i');
			}
		}
		return mainSchema.countDocuments(objWhere);
	},

	getById: async (id, userLogin = null) => {
		if(userLogin==null)
			return await mainSchema.findById(id);
		else{
			let objWhere    = {
				_id : id,
			}
		//let fields = ' id fullname email phone content_message done_processing';
		let result = await mainSchema
						.find(objWhere)
						.select();
			if(result){
				return result[0];
			}
			else return false;
		}
	},

	listItemForDropdown: async () => {
		return await mainSchema.find({})
			.select(' id fullname email phone content_message done_processing')
	},

	deleteById: async (id, userLogin= null) => {
		let item_Old = await mainSchema.findById(id);
		await LogModel.saveLog("Delete", collection, item_Old.id, item_Old, userLogin);
		let resultDelete = await mainSchema.deleteOne({_id: id});
		if(resultDelete.deletedCount > 0) return true; 
		else return false;
	},

	deleteList: async (arrayId, userLogin = null) => {
		let listId = arrayId["arrayId[]"];
		let lengthListId = listId.length;
		let deleteSuccess = [];
		let deleteError = [];
		let resultOne = false;
		for(let i = 0; i < lengthListId; i++) {
			resultOne = await module.exports.deleteById(listId[i], userLogin);
			if(resultOne == true) {
				deleteSuccess.push(listId[i]);
			}
			else {
				deleteError.push(listId[i]);
			}
		}
		return {
			success: true,
			deleteSuccess,
			deleteError,
			message: 'true'
		};
	},

	exportData: async (options, userLogin = null) => {
		let objWhere    = {};
		let sort		= {};
		if(options != null){
			if((options.fullname != "") && (options.fullname != undefined)){
				objWhere.fullname = new RegExp(options.fullname, 'i');
			}
			if((options.email != "") && (options.email != undefined)){
				objWhere.email = new RegExp(options.email, 'i');
			}
			if((options.phone != "") && (options.phone != undefined)){
				objWhere.phone = new RegExp(options.phone, 'i');
			}
			if((options.content_message != "") && (options.content_message != undefined)){
				objWhere.content_message = new RegExp(options.content_message, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.DateTime_Created"] =  'desc'; 
		}
		let fields = ' id fullname email phone content_message done_processing';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.sort(sort);
	},
}

async function sendEmailContact(data){
	var date 				= new Date();
	let email = systemConfig.Email;
		let idEmail 		= " Id " + date.getDay().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString()+ date.getSeconds().toString()+ date.getMilliseconds().toString();
		let subject 		= " Contact letter " + data.fullname;
		
		let Body 			= " + Fullname: " + data.fullname;		
		Body += "<br /> + Email: " + data.email;
		Body += "<br /> + Phone: " + data.phone;
		Body += "<br /> + Content Message: " + data.content_message;
		Body += "<br /><br />" +idEmail;
		
		let ThamSoGuiEmail = {
			email 	: email,
			subject	: subject,
			message	: Body
		}
		let resultEmail = await sendEmail.sendEmailMicrosoft(ThamSoGuiEmail);

	return true;
}



