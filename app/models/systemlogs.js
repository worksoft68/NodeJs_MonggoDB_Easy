//**************************************************************************************************************************
//     Creation time: Friday, 03 November 2023 3:40 PM
//     Creator: 
//**************************************************************************************************************************
var moment = require('moment');
const mainSchema 	= require(__path_schemas + 'systemlogs');
const LogModel = require(__path_models + 'sys_logs'); 
const systemConfig = require(__path_configs + 'system');
const collection = 'systemlogs';//use this parameter to check permissions: save, select, delete.... 

module.exports = {

	saveLog: async (action_user, impact_zone, id_table, content_log, userLogin) => {
		id_table = String(id_table);
		let strContentLog = JSON.stringify(content_log);
		let strContentLogMin = "";
		if (strContentLog.length > 1800) {
			strContentLogMin = strContentLog.substring(0, 1800);
		}
		else strContentLogMin = strContentLog;

		//console.log(strContentLogMin);
		if (impact_zone.length > 55) {
			impact_zone = impact_zone.substring(0, 55);
		}

		if (id_table.length > 24) {
			id_table = id_table.substring(0, 24);
		}

		let fullname = userLogin.firstname + ' ' + userLogin.lastname;
		if (fullname.length > 37) {
			fullname = fullname.substring(0, 37);
		}
		
		let data = {
			action_user: action_user,
			impact_zone: impact_zone,
			id_table: id_table,
			content_log: strContentLogMin,
			contentlog_max: strContentLog,		
			id_user: userLogin.id,
			fullname: fullname,
			datetime_log: moment(Date.now()).format(systemConfig.format_time_sql_system),
		};
		console.log(data);
		let result =  await new mainSchema(data).save();
	},
	saveInsert: async (item, userLogin) => {
		let data = {
			action_user: item.action_user,
			impact_zone: item.impact_zone,
			id_table: item.id_table,
			content_log: item.content_log,
			contentlog_max: item.contentlog_max,
			ip: item.ip,
			mac_address: item.mac_address,
			hostname: item.hostname,
			id_user: item.id_user,
			fullname: item.fullname,
			datetime_log: item.datetime_log,
		};
		data["create"] = {
			User_Id_Created: userLogin.id, 
			User_Name_Created: userLogin.firstname + ' '+ userLogin.lastname, 
			DateTime_Created: Date.now() 
		};
		let result =  await new mainSchema(data).save();
		let status = 406;
		let success = false;
		if (result) {
			data = result;
			status = 201;
			success = true;
		 }
		await LogModel.saveLog("Insert", collection, data.id, data, userLogin);
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
			action_user: item.action_user,
			impact_zone: item.impact_zone,
			id_table: item.id_table,
			content_log: item.content_log,
			contentlog_max: item.contentlog_max,
			ip: item.ip,
			mac_address: item.mac_address,
			hostname: item.hostname,
			id_user: item.id_user,
			fullname: item.fullname,
			datetime_log: item.datetime_log,
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
			if((options.action_user != "") && (options.action_user != undefined)){
				objWhere.action_user = new RegExp(options.action_user, 'i');
			}
			if((options.impact_zone != "") && (options.impact_zone != undefined)){
				objWhere.impact_zone = new RegExp(options.impact_zone, 'i');
			}
			if((options.id_table != "") && (options.id_table != undefined)){
				objWhere.id_table = new RegExp(options.id_table, 'i');
			}
			if((options.content_log != "") && (options.content_log != undefined)){
				objWhere.content_log = new RegExp(options.content_log, 'i');
			}
			if((options.contentlog_max != "") && (options.contentlog_max != undefined)){
				objWhere.contentlog_max = new RegExp(options.contentlog_max, 'i');
			}
			if((options.ip != "") && (options.ip != undefined)){
				objWhere.ip = new RegExp(options.ip, 'i');
			}
			if((options.mac_address != "") && (options.mac_address != undefined)){
				objWhere.mac_address = new RegExp(options.mac_address, 'i');
			}
			if((options.hostname != "") && (options.hostname != undefined)){
				objWhere.hostname = new RegExp(options.hostname, 'i');
			}
			if((options.fullname != "") && (options.fullname != undefined)){
				objWhere.fullname = new RegExp(options.fullname, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.DateTime_Created"] =  'desc'; 
		}
		let fields = ' id action_user impact_zone id_table content_log contentlog_max ip mac_address hostname id_user fullname datetime_log';
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
			if((options.action_user != "") && (options.action_user != undefined)){
				objWhere.action_user = new RegExp(options.action_user, 'i');
			}
			if((options.impact_zone != "") && (options.impact_zone != undefined)){
				objWhere.impact_zone = new RegExp(options.impact_zone, 'i');
			}
			if((options.id_table != "") && (options.id_table != undefined)){
				objWhere.id_table = new RegExp(options.id_table, 'i');
			}
			if((options.content_log != "") && (options.content_log != undefined)){
				objWhere.content_log = new RegExp(options.content_log, 'i');
			}
			if((options.contentlog_max != "") && (options.contentlog_max != undefined)){
				objWhere.contentlog_max = new RegExp(options.contentlog_max, 'i');
			}
			if((options.ip != "") && (options.ip != undefined)){
				objWhere.ip = new RegExp(options.ip, 'i');
			}
			if((options.mac_address != "") && (options.mac_address != undefined)){
				objWhere.mac_address = new RegExp(options.mac_address, 'i');
			}
			if((options.hostname != "") && (options.hostname != undefined)){
				objWhere.hostname = new RegExp(options.hostname, 'i');
			}
			if((options.fullname != "") && (options.fullname != undefined)){
				objWhere.fullname = new RegExp(options.fullname, 'i');
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
		//let fields = ' id action_user impact_zone id_table content_log contentlog_max ip mac_address hostname id_user fullname datetime_log';
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
			.select(' id action_user impact_zone id_table content_log contentlog_max ip mac_address hostname id_user fullname datetime_log')
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
			if((options.action_user != "") && (options.action_user != undefined)){
				objWhere.action_user = new RegExp(options.action_user, 'i');
			}
			if((options.impact_zone != "") && (options.impact_zone != undefined)){
				objWhere.impact_zone = new RegExp(options.impact_zone, 'i');
			}
			if((options.id_table != "") && (options.id_table != undefined)){
				objWhere.id_table = new RegExp(options.id_table, 'i');
			}
			if((options.content_log != "") && (options.content_log != undefined)){
				objWhere.content_log = new RegExp(options.content_log, 'i');
			}
			if((options.contentlog_max != "") && (options.contentlog_max != undefined)){
				objWhere.contentlog_max = new RegExp(options.contentlog_max, 'i');
			}
			if((options.ip != "") && (options.ip != undefined)){
				objWhere.ip = new RegExp(options.ip, 'i');
			}
			if((options.mac_address != "") && (options.mac_address != undefined)){
				objWhere.mac_address = new RegExp(options.mac_address, 'i');
			}
			if((options.hostname != "") && (options.hostname != undefined)){
				objWhere.hostname = new RegExp(options.hostname, 'i');
			}
			if((options.fullname != "") && (options.fullname != undefined)){
				objWhere.fullname = new RegExp(options.fullname, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.DateTime_Created"] =  'desc'; 
		}
		let fields = ' id action_user impact_zone id_table content_log contentlog_max ip mac_address hostname id_user fullname datetime_log';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.sort(sort);
	},
}
