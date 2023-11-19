//**************************************************************************************************************************
//     Creation time: Saturday, 10 June 2023 1:20 PM
//     Creator: 
//**************************************************************************************************************************
var moment = require('moment');
const mainSchema 	= require(__path_schemas + 'sys_companies');
const LogModel = require(__path_models + 'sys_logs'); 
const systemConfig = require(__path_configs + 'system');
const collection = 'sys_companies';//use this parameter to check permissions: save, select, delete.... 

module.exports = {
	saveInsert: async (item, userLogin) => {
		let data = {
			name: item.name,
			address: item.address,
			email1: item.email1,
			phone_number1: item.phone_number1,
			note: item.note,
			representative_name: item.representative_name,
			link_facebook: item.link_facebook,
			bank_account_number1: item.bank_account_number1,
			bank_name1: item.bank_name1,
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
			name: item.name,
			address: item.address,
			email1: item.email1,
			phone_number1: item.phone_number1,
			note: item.note,
			representative_name: item.representative_name,
			link_facebook: item.link_facebook,
			bank_account_number1: item.bank_account_number1,
			bank_name1: item.bank_name1,
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
			if((options.name != "") && (options.name != undefined)){
				objWhere.name = new RegExp(options.name, 'i');
			}
			if((options.address != "") && (options.address != undefined)){
				objWhere.address = new RegExp(options.address, 'i');
			}
			if((options.email1 != "") && (options.email1 != undefined)){
				objWhere.email1 = new RegExp(options.email1, 'i');
			}
			if((options.phone_number1 != "") && (options.phone_number1 != undefined)){
				objWhere.phone_number1 = new RegExp(options.phone_number1, 'i');
			}
			if((options.note != "") && (options.note != undefined)){
				objWhere.note = new RegExp(options.note, 'i');
			}
			if((options.representative_name != "") && (options.representative_name != undefined)){
				objWhere.representative_name = new RegExp(options.representative_name, 'i');
			}
			if((options.link_facebook != "") && (options.link_facebook != undefined)){
				objWhere.link_facebook = new RegExp(options.link_facebook, 'i');
			}
			if((options.bank_account_number1 != "") && (options.bank_account_number1 != undefined)){
				objWhere.bank_account_number1 = new RegExp(options.bank_account_number1, 'i');
			}
			if((options.bank_name1 != "") && (options.bank_name1 != undefined)){
				objWhere.bank_name1 = new RegExp(options.bank_name1, 'i');
			}
			if((options.status != "") && (options.status != "-") && (options.status != "novalue")&& (options.status != undefined)){
				objWhere.status = new RegExp(options.status, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.datetime_created"] =  'desc'; 
		}
		let fields = ' _id name address provincial district email1 email2 phone_number1 phone_number2 number_worker note renewal_date expiration_date representative_name link_facebook registration_amount registered_storage registered_sms registration_amount_sms bank_account_number1 bank_name1 bank_account_number2 bank_name2 status create modified';
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
			if((options.name != "") && (options.name != undefined)){
				objWhere.name = new RegExp(options.name, 'i');
			}
			if((options.address != "") && (options.address != undefined)){
				objWhere.address = new RegExp(options.address, 'i');
			}
			if((options.email1 != "") && (options.email1 != undefined)){
				objWhere.email1 = new RegExp(options.email1, 'i');
			}
			if((options.phone_number1 != "") && (options.phone_number1 != undefined)){
				objWhere.phone_number1 = new RegExp(options.phone_number1, 'i');
			}
			if((options.note != "") && (options.note != undefined)){
				objWhere.note = new RegExp(options.note, 'i');
			}
			if((options.representative_name != "") && (options.representative_name != undefined)){
				objWhere.representative_name = new RegExp(options.representative_name, 'i');
			}
			if((options.link_facebook != "") && (options.link_facebook != undefined)){
				objWhere.link_facebook = new RegExp(options.link_facebook, 'i');
			}
			if((options.bank_account_number1 != "") && (options.bank_account_number1 != undefined)){
				objWhere.bank_account_number1 = new RegExp(options.bank_account_number1, 'i');
			}
			if((options.bank_name1 != "") && (options.bank_name1 != undefined)){
				objWhere.bank_name1 = new RegExp(options.bank_name1, 'i');
			}
			if((options.status != "") && (options.status != undefined)){
				objWhere.status = new RegExp(options.status, 'i');
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
		//let fields = ' _id name address provincial district email1 email2 phone_number1 phone_number2 number_worker note renewal_date expiration_date representative_name link_facebook registration_amount registered_storage registered_sms registration_amount_sms bank_account_number1 bank_name1 bank_account_number2 bank_name2 status create modified';
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
			.select(' _id name address provincial district email1 email2 phone_number1 phone_number2 number_worker note renewal_date expiration_date representative_name link_facebook registration_amount registered_storage registered_sms registration_amount_sms bank_account_number1 bank_name1 bank_account_number2 bank_name2 status create modified')
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
			if((options.name != "") && (options.name != undefined)){
				objWhere.name = new RegExp(options.name, 'i');
			}
			if((options.address != "") && (options.address != undefined)){
				objWhere.address = new RegExp(options.address, 'i');
			}
			if((options.email1 != "") && (options.email1 != undefined)){
				objWhere.email1 = new RegExp(options.email1, 'i');
			}
			if((options.phone_number1 != "") && (options.phone_number1 != undefined)){
				objWhere.phone_number1 = new RegExp(options.phone_number1, 'i');
			}
			if((options.note != "") && (options.note != undefined)){
				objWhere.note = new RegExp(options.note, 'i');
			}
			if((options.representative_name != "") && (options.representative_name != undefined)){
				objWhere.representative_name = new RegExp(options.representative_name, 'i');
			}
			if((options.link_facebook != "") && (options.link_facebook != undefined)){
				objWhere.link_facebook = new RegExp(options.link_facebook, 'i');
			}
			if((options.bank_account_number1 != "") && (options.bank_account_number1 != undefined)){
				objWhere.bank_account_number1 = new RegExp(options.bank_account_number1, 'i');
			}
			if((options.bank_name1 != "") && (options.bank_name1 != undefined)){
				objWhere.bank_name1 = new RegExp(options.bank_name1, 'i');
			}
			if((options.status != "") && (options.status != "-") && (options.status != "novalue")&& (options.status != undefined)){
				objWhere.status = new RegExp(options.status, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.datetime_created"] =  'desc'; 
		}
		let fields = ' _id name address provincial district email1 email2 phone_number1 phone_number2 number_worker note renewal_date expiration_date representative_name link_facebook registration_amount registered_storage registered_sms registration_amount_sms bank_account_number1 bank_name1 bank_account_number2 bank_name2 status create modified';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.sort(sort);
	},
}
