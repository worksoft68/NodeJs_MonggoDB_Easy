//**************************************************************************************************************************
//     Creation time: Thursday, 22 September 2022 10:19 AM
//     Creator: 
//**************************************************************************************************************************
var md5 = require('md5');
var crypto = require('crypto');
var randomstring = require("randomstring");
var jwt = require('jsonwebtoken');
var moment = require('moment');
const { ObjectId } = require('mongodb');
const mainSchema 	= require(__path_schemas + 'sys_users');
const LogModel = require(__path_models + 'sys_logs'); 
const systemConfig = require(__path_configs + 'system');
const collection = 'sys_users'; //use this parameter to check permissions: save, select, delete.... 

module.exports = {	
	getSignedJwtToken:async (user) => {
			let JwtToken = jwt.sign({ id: user.id }, systemConfig.JWT_SECRET, {
			expiresIn: systemConfig.JWT_EXP});
			return JwtToken;
	},
	getUserByUserNameEncrypted:async (username_encrypted) => {
		let result =  await mainSchema
			.find({"username_encrypted" : username_encrypted})
			.select();			
		if(result.length > 0)
			return result[0];
		else
			return {};
	},

	getUserByEmail:async (email) => {
		let result =  await mainSchema
			.find({"email" : email})
			.select();			
		if(result.length > 0)
			return result[0];
		else
			return {};
	},
	// getByIdCheckLogin:async (id) => {
	// 	let result =  await mainSchema
	// 		.find({_id : id })
	// 		.select();			
	// 	if(result.length > 0)
	// 		return result[0];
	// 	else
	// 		return {};
	// },


	saveInsert: async (item, userLogin) => {
		let checkExisting = await module.exports.checkExistingAccount(item);
		if(checkExisting != false){
			checkExisting["checkExistingAccount"] = true;		
			return {
				success	: false,
				status	: 406,
				action	: 'insert',
				data	: checkExisting,
				message	: 'AccountAlreadyExists'
			};
		}
		let data = {
			employee_code: item.employee_code,
			id_company: item.id_company,
			sys_companies: {
				id: item.id_company,
				name: item["sys_companies[name]"],
				//name: item.name,
			},
			id_department: item.id_department,
			sys_departments: {
				id: item.id_department,
				department_name: item["sys_departments[department_name]"],
				//department_name: item.department_name,
			},
			id_position: item.id_position,
			sys_positions: {
				id: item.id_position,
				position_name: item["sys_positions[position_name]"],
				//position_name: item.position_name,
			},
			lastname: item.lastname,
			firstname: item.firstname,
			username: item.username,			
			birthday: item.birthday,
			sex: item.sex,
			email: item.email,
			phonenumber: item.phonenumber,
			status: item.status,
			time_changed_password:Date.now(),
		};
		data["create"] = {
			user_id_created: userLogin.id, 
			user_name_created: userLogin.firstname + ' '+ userLogin.lastname, 
			datetime_created: Date.now() 
		};
		data["password"] =  md5(item.password_encrypted);// Encrypt one more time
		data["username_encrypted"] =  md5(item.username_encrypted);// Encrypt one more time

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
		let checkExisting = await module.exports.checkExistingAccount_update(item);
		if(checkExisting != false){
			checkExisting["checkExistingAccount"] = true;		
			return {
				success	: false,
				status	: 406,
				action	: 'insert',
				data	: checkExisting,
				message	: 'AccountAlreadyExists'
			};
		}

		let data = {
			employee_code: item.employee_code,
			id_company: item.id_company,
			sys_companies: {
				id: item.id_company,
				name: item["sys_companies[name]"],
				//name: item.name,
			},
			id_department: item.id_department,
			sys_departments: {
				id: item.id_department,
				department_name: item["sys_departments[department_name]"],
				//department_name: item.department_name,
			},
			id_position: item.id_position,
			sys_positions: {
				id: item.id_position,
				position_name: item["sys_positions[position_name]"],
				//position_name: item.position_name,
			},
			lastname: item.lastname,
			firstname: item.firstname,
			username: item.username,
			password: item.password,
			birthday: item.birthday,
			sex: item.sex,
			email: item.email,
			phonenumber: item.phonenumber,
			status: item.status,
		};
		data["modified"] = {
			user_id_modified: userLogin.id, 
			user_name_modified: userLogin.firstname + ' '+ userLogin.lastname, 
			datetime_modified: Date.now() 
		};
		data["username_encrypted"] 	=  md5(item.username_encrypted);// Encrypt one more time
		if(item.password_encrypted != 'da39a3ee5e6b4b0d3255bfef95601890afd80709'){ 
			data["password"] =  md5(item.password_encrypted);// Encrypt one more time
			data["time_changed_password"] = Date.now();
		}

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


	saveUpdateProfile: async (item, userLogin) => {
		//console.log(item);
		item.username_encrypted = md5(item.username_encrypted);
		let item_Old = await mainSchema.findById(item.idHidden);
		item["id_company"]		= item_Old.id_company;
		item["_idHidden"]		= item.idHidden;
	
		let checkExisting = await module.exports.checkExistingAccount_update(item);
		if(checkExisting != false){
			checkExisting["checkExistingAccount"] = true;		
			return {
				success	: false,
				status	: 406,
				action	: 'insert',
				data	: checkExisting,
				message	: 'AccountAlreadyExists'
			};
		}
		// data["username_encrypted"] 	=  md5(item.username_encrypted);// Encrypt one more time
		// item.username_encrypted = md5(item.username_encrypted);	
		let data = {
			employee_code: item.employee_code,		
			id_department: item.id_department,
			sys_departments: {
				id: item.id_department,
				department_name: item.department_name,
				//department_name: item.department_name,
			},			
			firstname: item.firstname,
			lastname: item.lastname,
			username: item.username,						
			username_encrypted: item.username_encrypted,						
			sex: item.sex,
			email: item.email,
			phonenumber: item.phonenumber,			
			birthday: item.birthday,			
			address: item.address,			
			avatar: item.avatar,			
		};
		data["modified"] = {
			user_id_modified: userLogin.id, 
			user_name_modified: userLogin.firstname + ' '+ userLogin.lastname, 
			datetime_modified: Date.now() 
		};
		//data["username_encrypted"] 	=  md5(item.username_encrypted);// Encrypt one more time
		
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

	changePassword: async (passwordOld, passwordNew, userLogin) => {		
		let item_Old = await mainSchema.findById(userLogin._id);
		if(item_Old.password == passwordOld){
			let data = {
				password: passwordNew,
				time_changed_password: moment(Date.now()).format(systemConfig.format_time_sql_system)
			};
			let result = await mainSchema.updateOne({_id: userLogin._id}, data);
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

	
	checkExistingAccount: async (user) => {		
		// let sql = ` SELECT A.id, A.employee_code, A.company_id, B.name as company_name, A.department_id, C.name as department_name , A.position_id, D.name as position_name , A.lastname, A.firstname, A.username, A.birthday, A.sex, A.email, A.phonenumber, A.address, A.district, A.provincial, A.nation, A.is_management, A.status, A.last_time_login, A.avatar, A.receive_email, A.receive_sms, A.full_path_temporary_save, A.temporary_file_name, A.path_temporary_save, A.manager_code, A.link_change_password, A.token_change_password, A.notification_time_changed_password, A.time_changed_password, A.browser_headers, A.is_status_login, A.user_id_created, A.user_name_created, A.datetime_created, A.user_id_modified, A.user_name_modified, A.datetime_modified
		// FROM sys_users A
		// inner join sys_companies B on A.company_id = B.id inner join sys_departments C on A.department_id = C.id inner join sys_positions D on A.position_id = D.id 
		// where ((A.company_id like :company_id) 
		// and (A.employee_code like :employee_code)) or (A.email like :email) or (A.username like :username) `;
		let result =  await mainSchema
			.find({"id_company":user.id_company, $or: [{"employee_code":user.employee_code}, {"username":user.username}, {"email":user.email}]})
			.select();			
		if(result.length > 0)
			return result[0];
		else
			return false;
			
	},

	checkExistingAccount_update: async (user) => {
		//.find({"id_company":user.id_company, "employee_code":user.employee_code, "_id":{$ne:user._idHidden} , $or: [{"username":user.username}, {"email":user.email}]})
		//.find({"id_company":user.id_company, "employee_code":user.employee_code, "_id":{$ne:user._idHidden}})
		let result =  await mainSchema
			.find({"id_company":user.id_company, "_id":{$ne:user._idHidden} , $or: [{"employee_code":user.employee_code}, {"username":user.username}, {"email":user.email}]})
			.select();			
		if(result.length > 0)
			return result[0];
		else
			return false;
	},


	listItems: async (params, userLogin, options=null) => {
		let objWhere    = {};
		let sort		= {};
		if(options != null){
			if((options.employee_code != "") && (options.employee_code != undefined)){
				objWhere.employee_code = new RegExp(options.employee_code, 'i');
			}
			if((options.id_company != "") && (options.id_company != undefined)){
				objWhere.id_company = new RegExp(options.id_company, 'i');
			}
			if((options.id_department != "") && (options.id_department != undefined)){
				objWhere.id_department = new RegExp(options.id_department, 'i');
			}
			if((options.id_position != "") && (options.id_position != undefined)){
				objWhere.id_position = new RegExp(options.id_position, 'i');
			}
			if((options.lastname != "") && (options.lastname != undefined)){
				objWhere.lastname = new RegExp(options.lastname, 'i');
			}
			if((options.firstname != "") && (options.firstname != undefined)){
				objWhere.firstname = new RegExp(options.firstname, 'i');
			}
			if((options.username != "") && (options.username != undefined)){
				objWhere.username = new RegExp(options.username, 'i');
			}
			if((options.password != "") && (options.password != undefined)){
				objWhere.password = new RegExp(options.password, 'i');
			}
			if((options.sex != "") && (options.sex != undefined)){
				objWhere.sex = new RegExp(options.sex, 'i');
			}
			if((options.email != "") && (options.email != undefined)){
				objWhere.email = new RegExp(options.email, 'i');
			}
			if((options.phonenumber != "") && (options.phonenumber != undefined)){
				objWhere.phonenumber = new RegExp(options.phonenumber, 'i');
			}
			if((options.status != "") && (options.status != undefined)){
				objWhere.status = new RegExp(options.status, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.datetime_created"] =  'desc'; 
		}
		let fields = ' _id employee_code id_company sys_companies id_department sys_departments id_position sys_positions lastname firstname username birthday sex email phonenumber address district provincial nation is_management status last_time_login avatar receive_email receive_sms full_path_temporary_save temporary_file_name path_temporary_save manager_code link_change_password token_change_password notification_time_changed_password time_changed_password browser_headers is_status_login create modified';
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
			if((options.employee_code != "") && (options.employee_code != undefined)){
				objWhere.employee_code = new RegExp(options.employee_code, 'i');
			}
			if((options.id_company != "") && (options.id_company != undefined)){
				objWhere.id_company = new RegExp(options.id_company, 'i');
			}
			if((options.id_department != "") && (options.id_department != undefined)){
				objWhere.id_department = new RegExp(options.id_department, 'i');
			}
			if((options.id_position != "") && (options.id_position != undefined)){
				objWhere.id_position = new RegExp(options.id_position, 'i');
			}
			if((options.lastname != "") && (options.lastname != undefined)){
				objWhere.lastname = new RegExp(options.lastname, 'i');
			}
			if((options.firstname != "") && (options.firstname != undefined)){
				objWhere.firstname = new RegExp(options.firstname, 'i');
			}
			if((options.username != "") && (options.username != undefined)){
				objWhere.username = new RegExp(options.username, 'i');
			}
			if((options.password != "") && (options.password != undefined)){
				objWhere.password = new RegExp(options.password, 'i');
			}
			if((options.sex != "") && (options.sex != undefined)){
				objWhere.sex = new RegExp(options.sex, 'i');
			}
			if((options.email != "") && (options.email != undefined)){
				objWhere.email = new RegExp(options.email, 'i');
			}
			if((options.phonenumber != "") && (options.phonenumber != undefined)){
				objWhere.phonenumber = new RegExp(options.phonenumber, 'i');
			}
			if((options.status != "") && (options.status != undefined)){
				objWhere.status = new RegExp(options.status, 'i');
			}
		}
		return mainSchema.countDocuments(objWhere);
	},

	getByIdCheckLogin: async (id) => {
		let user =  await mainSchema.findById(id);	
		if((user.avatar=='')||(user.avatar==null)||(user.avatar==undefined)){
			user['avatar'] = 'User_no_avatar.png'; 
		}
		return user;

	},
//,username,  birthday, sex, email
	getById: async (id, userLogin = null) => {
		if(userLogin==null)
			return await mainSchema.findById(id);
		else{
			let objWhere    = {
				_id : id,
			}
		//let fields = ' _id employee_code id_company sys_companies id_department sys_departments id_position sys_positions lastname firstname username  birthday sex email phonenumber address district provincial nation is_management status last_time_login avatar receive_email receive_sms full_path_temporary_save temporary_file_name path_temporary_save manager_code link_change_password token_change_password notification_time_changed_password time_changed_password browser_headers is_status_login create modified';
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
		let result =  await mainSchema
		.aggregate([{
			'$project' 	: {  
			  'fullName': {'$concat' : [ '$firstname', ' ' ,'$lastname' ]},
			},			
		}]);		
		return result;
	},	

	listItemForDropdownByDepartment: async (item) => {
		//let rersult;
		if((item.id_department!='-')&&(item.id_department!='')){
			let objWhere    = {
				id_department : item.id_department,
			}
			let id_department = new ObjectId(item.id_department)  
			
			return await mainSchema
			.aggregate([
				{
					'$project' 	: {  
						'fullName': {'$concat' : [ '$firstname', ' ' ,'$lastname' ]},	
					'id_department': '$id_department',		 
					}		 		
				},
				{
					$match: { 'id_department': id_department } 
				}]);			
		}
		else{
			let id_company = new ObjectId(item.id_company);
			return  await mainSchema
			.aggregate([{
				'$project' 	: {  
					'fullName': {'$concat' : [ '$firstname', ' ' ,'$lastname' ]},
				  	'id_company': '$id_company',
				}		 		
			},
			{
				$match: { 'id_company': id_company } 
			}]);			
		}		
		//return rersult;
	},

	listItemForDropdownByDepartment1: async (item) => {
		let id_department = ObjectId(item.id_department);
		let result =  await mainSchema
		.aggregate([{
			'$project' 	: {  
			  'fullName': {'$concat' : [ '$firstname', ' ' ,'$lastname' ]},
			  'id_department': '$id_department',
			}		 		
		  },
			{
			  $match: { 'id_department': id_department } 
			  }]);
		return result;
		
		// let result =  await mainSchema
		// .aggregate([{
		// 	'$project' 	: {  
		// 	  'fullName': {'$concat' : [ '$firstname', ' ' ,'$lastname' ]},
		// 	  'id_department': '$id_department',
		// 	  'username': '$username',
		// 	}
		 		
		//   },
		// 	{
		// 	  $match: { 'id_department':item.id_department} 
		// 	  }]);
			  
		// return result;

		// let result =  await mainSchema
		// .aggregate([{
		// 	'$project' 	: {  
		// 	  'fullName': {'$concat' : [ '$firstname', ' ' ,'$lastname' ]},
		// 	}			
		//   },
		//   {
		// 	  $match: { 'id_department': item.id_department }
		//   }]);		
		// return result;
	},
	listItemForDropdown2: async () => {
		let result =  await mainSchema
		.aggregate([{
			'$project' 	: {  
			  'fullName': {'$concat' : [ '$firstname', ' ' ,'$lastname' ]},
			  'username': '$username',
			  'email' 	: '$email'			
			},			
		  }]);
		return result;
// ********************** ĐOạn code để dành ********************************************
		// 	let result =  await mainSchema
		// .aggregate([{
		// 	'$project' : {  
		// 	  'fullName' : {'$concat' : [ '$firstname', ' ' ,'$lastname' ]},
		// 	  'username' : {'$concat' : [ '$username']},
		// 	  'email' : '$email'			
		// 	},			
		//   }] );

			// return result;
// ********************** ĐOạn code để dành ********************************************
		// return await mainSchema.find({})
		// 	.select(' _id employee_code  lastname firstname ')
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
			if((options.employee_code != "") && (options.employee_code != undefined)){
				objWhere.employee_code = new RegExp(options.employee_code, 'i');
			}
			if((options.id_company != "") && (options.id_company != undefined)){
				objWhere.id_company = new RegExp(options.id_company, 'i');
			}
			if((options.id_department != "") && (options.id_department != undefined)){
				objWhere.id_department = new RegExp(options.id_department, 'i');
			}
			if((options.id_position != "") && (options.id_position != undefined)){
				objWhere.id_position = new RegExp(options.id_position, 'i');
			}
			if((options.lastname != "") && (options.lastname != undefined)){
				objWhere.lastname = new RegExp(options.lastname, 'i');
			}
			if((options.firstname != "") && (options.firstname != undefined)){
				objWhere.firstname = new RegExp(options.firstname, 'i');
			}
			if((options.username != "") && (options.username != undefined)){
				objWhere.username = new RegExp(options.username, 'i');
			}
			if((options.password != "") && (options.password != undefined)){
				objWhere.password = new RegExp(options.password, 'i');
			}
			if((options.sex != "") && (options.sex != undefined)){
				objWhere.sex = new RegExp(options.sex, 'i');
			}
			if((options.email != "") && (options.email != undefined)){
				objWhere.email = new RegExp(options.email, 'i');
			}
			if((options.phonenumber != "") && (options.phonenumber != undefined)){
				objWhere.phonenumber = new RegExp(options.phonenumber, 'i');
			}
			if((options.status != "") && (options.status != undefined)){
				objWhere.status = new RegExp(options.status, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.datetime_created"] =  'desc'; 
		}
		let fields = ' _id employee_code id_company sys_companies id_department sys_departments id_position sys_positions lastname firstname username birthday sex email phonenumber address district provincial nation is_management status last_time_login avatar receive_email receive_sms full_path_temporary_save temporary_file_name path_temporary_save manager_code link_change_password token_change_password notification_time_changed_password time_changed_password browser_headers is_status_login create modified';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.sort(sort);
	},
}
