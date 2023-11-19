//**************************************************************************************************************************
//     Creation time: Friday, 30 September 2022 11:55 AM
//     Creator: 
//**************************************************************************************************************************
var moment = require('moment');
const mainSchema 	= require(__path_schemas + 'sys_customsettings');
const FileHelpers	= require(__path_helpers + 'file');
const LogModel = require(__path_models + 'sys_logs'); 
const systemConfig = require(__path_configs + 'system');
const publicFunction	= require(__path_helpers + 'publicFunction');
const collection = 'sys_customsettings';//use this parameter to check permissions: save, select, delete.... 
const uploadFolder = 'public/uploads/'+collection+'/';

module.exports = {
	saveInsert: async (item, userLogin) => {
		let data = {
			keySettings: item.keySettings,
			image_setting: item.image_setting,
			is_use_ckeditor: item.is_use_ckeditor,
			value_setting: publicFunction.decodeSpecialCharacters(item.value_setting),
			default_value: publicFunction.decodeSpecialCharacters(item.default_value),
			location: item.location,
			start_time: item.start_time,
			end_time: item.end_time,
			description: item.description,
			status: item.status,
			ordering: item.ordering,
			is_system: item.is_system,
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
			keySettings: item.keySettings,
			image_setting: item.image_setting,
			is_use_ckeditor: item.is_use_ckeditor,
			value_setting: publicFunction.decodeSpecialCharacters(item.value_setting),
			default_value: publicFunction.decodeSpecialCharacters(item.default_value),
			location: item.location,
			start_time: item.start_time,
			end_time: item.end_time,
			description: item.description,
			status: item.status,
			ordering: item.ordering,
			is_system: item.is_system,
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
			if((options.keySettings != "") && (options.keySettings != undefined)){
				objWhere.keySettings = new RegExp(options.keySettings, 'i');
			}
			if((options.image_setting != "") && (options.image_setting != undefined)){
				objWhere.image_setting = new RegExp(options.image_setting, 'i');
			}
			if((options.value_setting != "") && (options.value_setting != undefined)){
				objWhere.value_setting = new RegExp(options.value_setting, 'i');
			}
			if((options.default_value != "") && (options.default_value != undefined)){
				objWhere.default_value = new RegExp(options.default_value, 'i');
			}
			if((options.location != "") && (options.location != undefined)){
				objWhere.location = new RegExp(options.location, 'i');
			}
			if((options.description != "") && (options.description != undefined)){
				objWhere.description = new RegExp(options.description, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.datetime_created"] =  'desc'; 
		}
		let fields = ' _id keySettings image_setting is_use_ckeditor value_setting default_value location start_time end_time description status ordering is_system create modified';
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
			if((options.keySettings != "") && (options.keySettings != undefined)){
				objWhere.keySettings = new RegExp(options.keySettings, 'i');
			}
			if((options.image_setting != "") && (options.image_setting != undefined)){
				objWhere.image_setting = new RegExp(options.image_setting, 'i');
			}
			if((options.value_setting != "") && (options.value_setting != undefined)){
				objWhere.value_setting = new RegExp(options.value_setting, 'i');
			}
			if((options.default_value != "") && (options.default_value != undefined)){
				objWhere.default_value = new RegExp(options.default_value, 'i');
			}
			if((options.location != "") && (options.location != undefined)){
				objWhere.location = new RegExp(options.location, 'i');
			}
			if((options.description != "") && (options.description != undefined)){
				objWhere.description = new RegExp(options.description, 'i');
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
		//let fields = ' _id keySettings image_setting is_use_ckeditor value_setting default_value location start_time end_time description status ordering is_system create modified';
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
			.select(' _id keySettings image_setting is_use_ckeditor value_setting default_value location start_time end_time description status ordering is_system create modified')
	},

	deleteById: async (id, userLogin= null) => {
		let item_Old = await mainSchema.findById(id);
		await LogModel.saveLog("Delete", collection, item_Old._id, item_Old, userLogin);
		let rerultDeleteFile = await FileHelpers.remove(uploadFolder, item_Old.image_setting);
		if (rerultDeleteFile) {
			let resultDelete = await mainSchema.deleteOne({_id: id});
			if(resultDelete.deletedCount > 0) return true; 
			else return false;
		}
		else {
			return false;
		}
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
			if((options.keySettings != "") && (options.keySettings != undefined)){
				objWhere.keySettings = new RegExp(options.keySettings, 'i');
			}
			if((options.image_setting != "") && (options.image_setting != undefined)){
				objWhere.image_setting = new RegExp(options.image_setting, 'i');
			}
			if((options.value_setting != "") && (options.value_setting != undefined)){
				objWhere.value_setting = new RegExp(options.value_setting, 'i');
			}
			if((options.default_value != "") && (options.default_value != undefined)){
				objWhere.default_value = new RegExp(options.default_value, 'i');
			}
			if((options.location != "") && (options.location != undefined)){
				objWhere.location = new RegExp(options.location, 'i');
			}
			if((options.description != "") && (options.description != undefined)){
				objWhere.description = new RegExp(options.description, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.datetime_created"] =  'desc'; 
		}
		let fields = ' _id keySettings image_setting is_use_ckeditor value_setting default_value location start_time end_time description status ordering is_system create modified';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.sort(sort);
	},
	listItemsFrontend: async () => {
		//return [];
		let fields = ' _id keySettings image_setting is_use_ckeditor value_setting default_value location start_time end_time description status ordering is_system create modified';
		return await mainSchema
			.find()
			.select(fields);
			
	}

}
