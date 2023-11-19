//**************************************************************************************************************************
//     Creation time: Monday, 12 June 2023 4:21 PM
//     Creator: 
//**************************************************************************************************************************
var moment = require('moment');
const mainSchema 	= require(__path_schemas + 'sys_function_for_permissions');
const LogModel = require(__path_models + 'sys_logs'); 
const systemConfig = require(__path_configs + 'system');
const collection = 'sys_function_for_permissions';//use this parameter to check permissions: save, select, delete.... 

module.exports = {
	saveInsert: async (item, userLogin) => {
		let data = {
			function_name: item.function_name,
			description: item.description,
			note: item.note,
			status: item.status,
		};
		data["create"] = {
			user_id_created: userLogin.id, 
			user_name_created: userLogin.firstname + ' '+ userLogin.lastname, 
			datetime_created: Date.now() 
		};
		let result =  await new mainSchema(data).save();
		let status = 406;
		let success = false;
		if (result) {
			data = result;
			status = 201;
			success = true;
		 }
		await LogModel.saveLog("Insert", collection, data._id, data, userLogin);
		return {
			success: success,
			status: status,
			action: 'insert',
			data: data,
			message: result
		};
	},

	saveUpdate: async (item, userLogin) => {
		let data = {
			function_name: item.function_name,
			description: item.description,
			note: item.note,
			status: item.status,
		};
		data["modified"] = {
			user_id_modified: userLogin.id, 
			user_name_modified: userLogin.firstname + ' '+ userLogin.lastname, 
			datetime_modified: Date.now() 
		};
		let item_Old = await mainSchema.findById(item._idHidden);
		if(item_Old){
			let result = await mainSchema.updateOne({_id: item._idHidden}, data);
			let status = 200;
			let success = true;
			if (result.modifiedCount <1){
				status = 406;
				success = false;
			}
			data["_id"] = item._idHidden;
			await LogModel.saveLog("Update", collection, data._id, data, userLogin);
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
			if((options.function_name != "") && (options.function_name != undefined)){
				objWhere.function_name = new RegExp(options.function_name, 'i');
			}
			if((options.description != "") && (options.description != undefined)){
				objWhere.description = new RegExp(options.description, 'i');
			}
			if((options.note != "") && (options.note != undefined)){
				objWhere.note = new RegExp(options.note, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.datetime_created"] =  'desc'; 
		}
		let fields = ' _id function_name description note modulesystem status create modified';
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
			if((options.function_name != "") && (options.function_name != undefined)){
				objWhere.function_name = new RegExp(options.function_name, 'i');
			}
			if((options.description != "") && (options.description != undefined)){
				objWhere.description = new RegExp(options.description, 'i');
			}
			if((options.note != "") && (options.note != undefined)){
				objWhere.note = new RegExp(options.note, 'i');
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
		//let fields = ' _id function_name description note modulesystem status create modified';
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
			.select(' _id function_name description note modulesystem status create modified')
	},

	deleteById: async (id, userLogin= null) => {
		let item_Old = await mainSchema.findById(id);
		await LogModel.saveLog("Delete", collection, item_Old._id, item_Old, userLogin);
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
			if((options.function_name != "") && (options.function_name != undefined)){
				objWhere.function_name = new RegExp(options.function_name, 'i');
			}
			if((options.description != "") && (options.description != undefined)){
				objWhere.description = new RegExp(options.description, 'i');
			}
			if((options.note != "") && (options.note != undefined)){
				objWhere.note = new RegExp(options.note, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.datetime_created"] =  'desc'; 
		}
		let fields = ' _id function_name description note modulesystem status create modified';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.sort(sort);
	},
}
