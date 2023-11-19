//**************************************************************************************************************************
//     Creation time: Wednesday, 21 September 2022 4:40 PM
//     Creator: 
//**************************************************************************************************************************
var moment = require('moment');
const mainSchema 	= require(__path_schemas + 'sys_permissions');
const LogModel = require(__path_models + 'sys_logs'); 
const systemConfig = require(__path_configs + 'system');
const collection = 'sys_permissions';//use this parameter to check permissions: save, select, delete.... 
const folderView = __path_views_backend + 'login/';
const layoutBlog = __path_views_blog + 'frontend';
module.exports = {
	saveInsert: async (item, userLogin) => {
		let data = {
			user_id: item.user_id,
			sys_users: {
				id: item.user_id,
				fullName: item["sys_users[fullName]"],				
			},
			functions: item.functions,
			sys_function_for_permissions: {
				id: item.functions,
				description: item["sys_function_for_permissions[description]"],				
			},
			fullauthority: item.fullauthority,
			addnew: item.addnew,
			updates: item.updates,
			readonly: item.readonly,
			full_of_yourself: item.full_of_yourself,
			permission1: item.permission1,
			permission2: item.permission2,
			permission3: item.permission3,
			permission4: item.permission4,
			permission5: item.permission5,
			permission6: item.permission6,
			permission7: item.permission7,
			permission8: item.permission8,
			permission9: item.permission9,
			permission10: item.permission10,
		};
		data["create"] = {
			user_id_created: userLogin.id, 
			user_name_created: userLogin.firstname + ' '+ userLogin.lastname, 
			datetime_created: Date.now() 
		};
		let result;
		try{
			result =  await new mainSchema(data).save();
		}
		catch(err){console.log(err);}
		
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
			user_id: item.user_id,
			sys_users: {
				id: item.user_id,
				fullName: item["sys_users[fullName]"],				
			},
			functions: item.functions,
			sys_function_for_permissions: {
				id: item.functions,
				description: item["sys_function_for_permissions[description]"],				
			},
			fullauthority: item.fullauthority,
			addnew: item.addnew,
			updates: item.updates,
			readonly: item.readonly,
			full_of_yourself: item.full_of_yourself,
			permission1: item.permission1,
			permission2: item.permission2,
			permission3: item.permission3,
			permission4: item.permission4,
			permission5: item.permission5,
			permission6: item.permission6,
			permission7: item.permission7,
			permission8: item.permission8,
			permission9: item.permission9,
			permission10: item.permission10,
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
			if((options.user_id != "") && (options.user_id != undefined)){
				objWhere.user_id = new RegExp(options.user_id, 'i');
			}
			if((options.functions != "") && (options.functions != undefined)){
				objWhere.functions = new RegExp(options.functions, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
			//sort["fullauthority"] =  options.sortType; 
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.datetime_created"] =  'desc'; 
		}
		//console.log(sort);
		let fields = ' _id user_id sys_users functions sys_function_for_permissions fullauthority addnew updates readonly full_of_yourself permission1 permission2 permission3 permission4 permission5 permission6 permission7 permission8 permission9 permission10 create modified';
		// let result;
		// try{
			return  await mainSchema
			.find(objWhere)
			.select(fields)
			.sort(sort)
			.skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
			.limit(params.pagination.totalItemsPerPage);

			//console.log(re);
		// }
		// catch(err){console.log(err);}
		
		// 	return result;
	},

	countItem: (params, userLogin, options=null) => {
        let objWhere    = {};      
		if(options != null){
			if((options.user_id != "") && (options.user_id != undefined)){
				objWhere.user_id = new RegExp(options.user_id, 'i');
			}
			if((options.functions != "") && (options.functions != undefined)){
				objWhere.functions = new RegExp(options.functions, 'i');
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
		//let fields = ' _id user_id sys_users functions sys_function_for_permissions fullauthority addnew updates readonly full_of_yourself permission1 permission2 permission3 permission4 permission5 permission6 permission7 permission8 permission9 permission10 create modified';
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
			.select(' _id user_id sys_users functions sys_function_for_permissions fullauthority addnew updates readonly full_of_yourself permission1 permission2 permission3 permission4 permission5 permission6 permission7 permission8 permission9 permission10 create modified')
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
			if((options.user_id != "") && (options.user_id != undefined)){
				objWhere.user_id = new RegExp(options.user_id, 'i');
			}
			if((options.functions != "") && (options.functions != undefined)){
				objWhere.functions = new RegExp(options.functions, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.datetime_created"] =  'desc'; 
		}
		let fields = ' _id user_id sys_users functions sys_function_for_permissions fullauthority addnew updates readonly full_of_yourself permission1 permission2 permission3 permission4 permission5 permission6 permission7 permission8 permission9 permission10 create modified';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.sort(sort);
	},

	getPermissionByFunction:async (idUser, functionName) => {
		let result =  await mainSchema
						.find({"user_id" : idUser, "functions":functionName})
						.select();	
		if(result.length > 0)
			return result[0];
		else
			return { status: "false" };
	},

	checkPermissionAccess:async (idUser, functionName, res) => {
		//let permissionAccess = await module.exports.checkPermissionAccessInPermission(idUser, functionName);
		let permissionAccess = await module.exports.getPermissionByFunction(idUser, functionName);
		if ((permissionAccess.fullauthority != true) && (permissionAccess.full_of_yourself != true) && (permissionAccess.readonly != true)) {
			res.render(`${folderView}no-permission`, { pageTitle: 'No Permission ', top_post: false });
		}		
	},


	//Check permission is allowed to save?
	//There are 2 ways to assign permissions. In the Sys_Permission table and the Sys_Role_Permission table
	save:async (userLogin, functionBranch) => {
		let savePermission = await module.exports.getPermissionByFunction(userLogin._id, functionBranch);
		if ((savePermission.fullauthority == true) || (savePermission.addnew == true) || (savePermission.full_of_yourself == true)) {
			return true;
		}
		else{
			return {
				success: false,
				status: 405,
				action: 'save',
				data: '',
				message: 'You don`t have permission to save'
			};
		}
	},


	//Check permission is allowed to get data?
	//There are 2 ways to assign permissions. In the Sys_Permission table and the Sys_Role_Permission table
	getData:async (userLogin, functionBranch) => {
		let savePermission = await module.exports.getPermissionByFunction(userLogin._id, functionBranch);
		if ((savePermission.fullauthority == true) || (savePermission.addnew == true) || (savePermission.full_of_yourself == true)|| (savePermission.readonly == true)) {
			return true;
		}
		else{
			return {
				success: false,
				status: 405,
				action: 'save',
				data: '',
				message: 'You don`t have permission get data'
			};
		}
	},


	//Check permission is allowed to get delete?
	//There are 2 ways to assign permissions. In the Sys_Permission table and the Sys_Role_Permission table
	deleteItem:async (userLogin, functionBranch) => {
		let deletePermission = await module.exports.getPermissionByFunction(userLogin._id, functionBranch);
		if ((deletePermission.fullauthority == true) || (deletePermission.full_of_yourself == true)) {
			return true;
		}
		else{
			return {
				success: false,
				status: 405,
				action: 'save',
				data: '',
				message: 'You don`t have permission delete'
			};
		}
	},	
	
}
