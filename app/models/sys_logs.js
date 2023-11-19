//**************************************************************************************************************************
//     Creation time: Friday, 03 November 2023 5:03 PM
//     Creator: 
//**************************************************************************************************************************
var moment = require('moment');
const mainSchema 	= require(__path_schemas + 'sys_logs');
const systemConfig = require(__path_configs + 'system');
const collection = 'sys_logs';//use this parameter to check permissions: save, select, delete.... 

module.exports = {

	saveLog: async(Action, ImpactZone, IdTable, ContentLog, userLogin) => {      
		let FullName = userLogin.firstname + ' ' + userLogin.lastname;
        let IP = "";
        let strContentLog = JSON.stringify(ContentLog);
        let data = {
            action_user: Action,
            impact_zone: ImpactZone,
            id_collection: IdTable.toString(),
            content_log: strContentLog,           
            ip: IP,
            id_user: userLogin._id.toString(),
            fullname: FullName,
            datetime_log: Date.now(),
        };	
        let result =  await new mainSchema(data).save();    
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
			if((options.id_collection != "") && (options.id_collection != undefined)){
				objWhere.id_collection = new RegExp(options.id_collection, 'i');
			}
			if((options.content_log != "") && (options.content_log != undefined)){
				objWhere.content_log = new RegExp(options.content_log, 'i');
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
			sort["datetime_log"] =  'desc'; 
		}
		let fields = ' id action_user impact_zone id_collection content_log ip mac_address hostname id_user fullname datetime_log';
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
			if((options.id_collection != "") && (options.id_collection != undefined)){
				objWhere.id_collection = new RegExp(options.id_collection, 'i');
			}
			if((options.content_log != "") && (options.content_log != undefined)){
				objWhere.content_log = new RegExp(options.content_log, 'i');
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
		//let fields = ' id action_user impact_zone id_collection content_log ip mac_address hostname id_user fullname datetime_log';
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
			.select(' id action_user impact_zone id_collection content_log ip mac_address hostname id_user fullname datetime_log')
	},

	deleteById: async (id, userLogin= null) => {
		let item_Old = await mainSchema.findById(id);
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
			if((options.id_collection != "") && (options.id_collection != undefined)){
				objWhere.id_collection = new RegExp(options.id_collection, 'i');
			}
			if((options.content_log != "") && (options.content_log != undefined)){
				objWhere.content_log = new RegExp(options.content_log, 'i');
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
			sort["datetime_log"] =  'desc'; 
		}
		let fields = ' id action_user impact_zone id_collection content_log ip mac_address hostname id_user fullname datetime_log';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.sort(sort);
	},
}
