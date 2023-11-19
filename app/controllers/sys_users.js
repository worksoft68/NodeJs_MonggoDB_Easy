const clean = require('xss-clean/lib/xss').clean;
const collection = "sys_users";//use this parameter to check permissions: save, select, delete.... 
const name_Cookie_Language = 'language_' + collection.toLowerCase();
const MainModel = require(__path_models + collection);
const {validate}  	= require(__path_validates + collection);
const {validateRequest}  	= require(__path_validates + 'validates');
const sys_companiesModel = require(__path_models + 'sys_companies');
const sys_departmentsModel = require(__path_models + 'sys_departments');
const sys_positionsModel = require(__path_models + 'sys_positions');
const ParamsHelpers = require(__path_helpers + 'params');
const publicFunction = require(__path_helpers + 'publicFunction');
const sendEmail 	= require(__path_helpers + 'sendEmail');
const FileHelpers = require(__path_helpers + 'file');
const NotifyHelpers = require(__path_helpers + 'notify');
const pageTitleIndex = 'User Management';
const folderView = __path_views_backend + collection + '/';
const folderViewProfile = __path_views_backend + 'profile/';
const uploadFile = FileHelpers.upload('avatar', collection);// Avatar: control file name in HTML.  
//let fullYear =  new Date().getFullYear();
//const uploadFolder = 'public/uploads/' + collection + '/'+ fullYear+ '/';//sys_User is folder in folder public
const uploadFolder = 'public/uploads/' + collection + '/';//sys_User is folder in folder public

module.exports = {
	//indexString function is similar to the indexJson above, but the return data is string, not json
	indexString: async function(req, res, next) {
		let params 			= await ParamsHelpers.createParam(req);
		let languageString 	= JSON.stringify(await publicFunction.getLanguageRequest(req, name_Cookie_Language));
		const catalogue = [];
		sys_companies = await sys_companiesModel.listItemForDropdown();
		catalogue.push(sys_companies);
		// sys_departments = await sys_departmentsModel.listItemForDropdown();
		// catalogue.push(sys_departments);
		sys_positions = await sys_positionsModel.listItemForDropdown();
		catalogue.push(sys_positions);
		let catalogueString = JSON.stringify(catalogue);
		MainModel.listItems(params, req.user).then(async(items) => {
			if((!items) || (items.length < 1) || (items.status == 'error'))
				params.pagination.totalItems = 0;
			else {
				await MainModel.countItem(params, req.user).then( (data) => {
					params.pagination.totalItems = data;
				});
			}
			let itemString = JSON.stringify(items);
			let paramsString = JSON.stringify(params);
			res.render(`${folderView}list`, {
				pageTitle: pageTitleIndex,
				itemString,
				item:{},
				params : paramsString,
				language: languageString,
				catalogue : catalogueString
			});
		});
	},

// end indexString =================================================================================================
	//indexJson function is similar to the indexString above, but the return data is json, not string
	indexJson: async function(req, res, next) {
		let params 		= await ParamsHelpers.createParam(req);
		let language 	= await publicFunction.getLanguageRequest(req, name_Cookie_Language);
		const catalogue = [];
		sys_companies = await sys_companiesModel.listItemForDropdown();
		catalogue.push(sys_companies);
		// sys_departments = await sys_departmentsModel.listItemForDropdown();
		// catalogue.push(sys_departments);
		sys_positions = await sys_positionsModel.listItemForDropdown();
		catalogue.push(sys_positions);
		MainModel.listItems(params, req.user).then(async(data) => {
			if((!data) || (data.length < 1)){
				params.pagination.totalItems = 0;
				return res.status(200).json({
					success : true,
					pageTitle: pageTitleIndex,
					data: "Empty data",
					params,
					language,
					catalogue,
				});
			}
			else{
				await MainModel.countItem(params, req.user).then( (data) => {
					params.pagination["totalItems"] = data;
				});
				return res.status(200).json({
					success : true,
					pageTitle: pageTitleIndex,
					data,
					params,
					language,
					catalogue
				});
			}
		});
	},

// end indexJson =================================================================================================
profile: async function (req, res, next) {
	let userLogin = publicFunction.getUserLogin(req, res);
	delete userLogin['password'];
	delete userLogin['username_encrypted'];
	let pageTitleProfile = 'Profile: '+userLogin.firstname+' '+userLogin.lastname;	
	let languageString 	= JSON.stringify(await publicFunction.getLanguageRequest(req, name_Cookie_Language));
	const catalogue = [];
	sys_departments = await sys_departmentsModel.listItemForDropdown();
	catalogue.push(sys_departments);		
	let catalogueString = JSON.stringify(catalogue);
	console.log(sys_departments);
	res.render(`${folderViewProfile}index`, {
		pageTitle: pageTitleProfile,
		item: userLogin,
		language: languageString,
		catalogue: catalogueString,
		resultUpdate: '',
	});
},
// Post params get data, This function is similar to the Search function
	getAll: async function(req, res, next) {
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		item = clean(item);
		let params = await ParamsHelpers.createPagination(item);
		await MainModel.listItems(params, req.user, item).then(async(data) => {
			if((!data) || (data.length < 1)) {
				params.pagination["totalItems"] = 0;
				return res.status(200).json({
					success : true,
					data: "Empty data",
					params,
				});
			}
			else {
				await MainModel.countItem(params, req.user, item).then( (data) => {
					params.pagination["totalItems"] = data;
				});
				return res.status(200).json({
					success : true,
					data,
					params,
				});
			}
		});
	},
// // end getAll ================================================================================================= =================================================================================================

	searchGet: async function(req, res, next){
		let params 			= await ParamsHelpers.createParam(req);
		let languageString 	= JSON.stringify(await publicFunction.getLanguageRequest(req, name_Cookie_Language));
		const catalogue = [];
		sys_companies = await sys_companiesModel.listItemForDropdown();
		catalogue.push(sys_companies);
		sys_departments = await sys_departmentsModel.listItemForDropdown();
		catalogue.push(sys_departments);
		sys_positions = await sys_positionsModel.listItemForDropdown();
		catalogue.push(sys_positions);
		let catalogueString = JSON.stringify(catalogue);
		let item = {
			employee_code : await ParamsHelpers.getParam(req.query, 'employee_code', ''),
			id_company : await ParamsHelpers.getParam(req.query, 'id_company', ''),
			id_department : await ParamsHelpers.getParam(req.query, 'id_department', ''),
			id_position : await ParamsHelpers.getParam(req.query, 'id_position', ''),
			lastname : await ParamsHelpers.getParam(req.query, 'lastname', ''),
			firstname : await ParamsHelpers.getParam(req.query, 'firstname', ''),
			username : await ParamsHelpers.getParam(req.query, 'username', ''),
			password : await ParamsHelpers.getParam(req.query, 'password', ''),
			sex : await ParamsHelpers.getParam(req.query, 'sex', ''),
			email : await ParamsHelpers.getParam(req.query, 'email', ''),
			phonenumber : await ParamsHelpers.getParam(req.query, 'phonenumber', ''),
			status : await ParamsHelpers.getParam(req.query, 'status', ''),
		};
		item = clean(item);
		MainModel.listItems(params, req.user, item).then(async	(items) => {
			if(items.length>0){
				await MainModel.countItem(params, req.user, item).then( (data) => {
					params.pagination["totalItems"] = data;
				});
			}
			else params.pagination.totalItems = 0;
			let itemString = JSON.stringify(items);
			let paramsString = JSON.stringify(params);
			res.render(`${folderView}list`, {
				pageTitle: pageTitleIndex,
				itemString,
				item,
				params : paramsString,
				language: languageString,
				catalogue : catalogueString,
			});
		});
	},

// end searchGet =================================================================================================

	searchGetJson: async function(req, res, next){
		let params 		= await ParamsHelpers.createParam(req);
		let language 	= await publicFunction.getLanguageRequest(req, name_Cookie_Language);
		const catalogue = [];
		sys_companies = await sys_companiesModel.listItemForDropdown();
		catalogue.push(sys_companies);
		sys_departments = await sys_departmentsModel.listItemForDropdown();
		catalogue.push(sys_departments);
		sys_positions = await sys_positionsModel.listItemForDropdown();
		catalogue.push(sys_positions);
		let item = {
			employee_code : await ParamsHelpers.getParam(req.query, 'employee_code', ''),
			id_company : await ParamsHelpers.getParam(req.query, 'id_company', ''),
			id_department : await ParamsHelpers.getParam(req.query, 'id_department', ''),
			id_position : await ParamsHelpers.getParam(req.query, 'id_position', ''),
			lastname : await ParamsHelpers.getParam(req.query, 'lastname', ''),
			firstname : await ParamsHelpers.getParam(req.query, 'firstname', ''),
			username : await ParamsHelpers.getParam(req.query, 'username', ''),
			password : await ParamsHelpers.getParam(req.query, 'password', ''),
			sex : await ParamsHelpers.getParam(req.query, 'sex', ''),
			email : await ParamsHelpers.getParam(req.query, 'email', ''),
			phonenumber : await ParamsHelpers.getParam(req.query, 'phonenumber', ''),
			status : await ParamsHelpers.getParam(req.query, 'status', ''),
		};
		item = clean(item);
		MainModel.listItems(params, req.user, item).then(async(items) => {
			if((!items) || (items.length < 1)){
				params.pagination.totalItems = 0;
				items = "Empty data";
			}
			else {
				await MainModel.countItem(params, req.user, item).then( (data) => {
					params.pagination.totalItems = data;
				});
				//params.pagination.totalItems = items[0].TotalRecord;
			}
			res.render(`${folderView}list`, {
				pageTitle: pageTitleIndex,
				items,
				params,
				language,
				catalogue,
			});
		});
	},
// end searchGet =================================================================================================

	getDepartmentByCompany: async function(req, res, next) {
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		item = clean(item);
		await sys_departmentsModel.listItemForDropdownByCompany(item).then((data) => {
			return res.status(200).json({
				success : true,
				data
			});
		});
	},

	getUserByDepartment: async function(req, res, next) {
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		item = clean(item);
		await MainModel.listItemForDropdownByDepartment(item).then((data) => {
			return res.status(200).json({
				success : true,
				data
			});
		});
	},

	save: async function(req, res, next) {
		let error = await validateRequest.validateReq(req,res, name_Cookie_Language,validate.options);
		if(error){
			return res.status(400).json({status:400, success : true, error : error});
		}
		else{
			req.body = JSON.parse(JSON.stringify(req.body));
			let item = Object.assign(req.body);			
			item = clean(item);
			if(item.password_encrypted != item.confirmPassword_encrypted){
				item["message"]="Password_Confirm_Not_Match";	
				let data=item;				
				return res.status(406).json({status: 406, success : false, data});
			}
			await MainModel.saveInsert(item, req.user).then(async (data) => {
				if((data.success==true)&((item.emailAccountsToUser=="1")||(item.emailAccountsToUser=="true")||(item.emailAccountsToUser==true))){
					// send email
					let email = item.email;					
					let subject = "Your account has been created successfull";
					// if(item.id != ""){
					// 	subject = "Your account has been successfully updaty";
					// }
					// else{
					// 	subject = "Your account has been created successfull";
					// }
					let body = "Dear "+item.firstname + " " + item.lastname;
					body += "<br/>"+ subject;				
					body += "<br />Account: "+ item.username;	
					body += "<br/>Password: "+ item.password;
					body += "<br/>Website address: "+  req.protocol + "://" + req.get('host')+"/";;				
					
					let result = await sendEmail.sendEmail({
						email 	: email,
						subject	: subject,
						message	: body
					});
				}
				res.status(data.status).send({status:data.status, success : data.success, data})	
			});
		}
	},
// end save =================================================================================================

	update: async function(req, res, next){
		let error = await validateRequest.validateReq(req,res, name_Cookie_Language,validate.options);
		if(error){
			return res.status(400).json({status:400, success : true, error : error});
		}
		else{
			req.body = JSON.parse(JSON.stringify(req.body));
			let item = Object.assign(req.body);
			item = clean(item);
			if(item.password_encrypted != item.confirmPassword_encrypted){
				item["message"]="Password_Confirm_Not_Match";	
				let data=item;				
				return res.status(406).json({status: 406, success : false, data});
			}
			await MainModel.saveUpdate(item, req.user).then(async(data) => {
				if((data.success==true)&((item.emailAccountsToUser=="1")||(item.emailAccountsToUser=="true")||(item.emailAccountsToUser==true))){
					// send email
					let email = item.email;
					let subject = "Your account has been update successfully";
					let body = "Dear "+item.firstname + " " + item.lastname;
					body += "<br/>"+ subject;				
					body += "<br />Account: "+ item.username;

					if(item.password_encrypted != 'da39a3ee5e6b4b0d3255bfef95601890afd80709'){
						body += "<br/>Password: "+ item.password;
					}
					
					body += "<br/>Website address: "+  req.protocol + "://" + req.get('host')+"/";;				
					
					let result = await sendEmail.sendEmail({
						email 	: email,
						subject	: subject,
						message	: body
					});

				}
				return res.status(data.status).json({status: data.status, success : data.success, data})
			});
		}
	},
// end update =================================================================================================

updateProfile: async function (req, res, next) {
	let userLogin = publicFunction.getUserLogin(req, res);	
	let token = userLogin.tokenLogin;	
	let pageTitleProfile = 'Profile: '+userLogin.firstname+' '+userLogin.lastname;
	let language 	= await publicFunction.getLanguageRequest(req, name_Cookie_Language);
	let languageString = JSON.stringify(language);
	const catalogue = [];
	let sys_departments = await sys_departmentsModel.listItemForDropdown();
	catalogue.push(sys_departments);		
	let catalogueString = JSON.stringify(catalogue);

	// let result = await SysPermissionModel.save(userLogin, collection);
	// if (result.success == false) {
	// 	return res.status(result.status).send({ status: result.status, success: result.success, data: result });
	// }
	uploadFile(req, res, async (errUpload) => {
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		item = clean(item);
		let taskCurrent = "edit";
		let errors = await validate.updateProfile(item, language);
		if (errors != false) {
			if (req.file != undefined)
				FileHelpers.remove(uploadFolder, req.file.filename); // delete the picture when the form is not valid

				userLogin['password'] = '';
				userLogin['username_encrypted'] = '';
				//NotifyHelpers.show(req, res, 'back', { task: taskCurrent });
				let result = {
					success	: false,
					status	: 406,
					action	: 'update',
					data	: false,
					message	: 'errorUpdateProfile'
				};
				let resultUpdate = JSON.stringify(result);
				res.render(`${folderViewProfile}index`, {
					pageTitle: pageTitleProfile,
					item: userLogin,
					language: languageString,
					catalogue: catalogueString,
					resultUpdate: resultUpdate,
				});	
		}
		else {
			if (req.file == undefined) { // do not post files
				item.avatar = item.avatar_old;
			} else {
				item.avatar = req.file.filename;
				if (taskCurrent == "edit")
					FileHelpers.remove(uploadFolder, item.avatar_old);
			}
			item["id"] = userLogin.id;
			await MainModel.saveUpdateProfile(item, userLogin).then(async(result) => {
				let user = await MainModel.getByIdCheckLogin(userLogin.id);
				user['tokenLogin'] = token; 
				user['password'] = '';
				user['username_encrypted'] = '';										
				res.cookie('info', user, { signed: true }); // cookie  user
				
				let resultUpdate = JSON.stringify(result);
				//console.log(catalogueString);
				res.render(`${folderViewProfile}index`, {
					pageTitle: pageTitleProfile,
					item: user,
					language: languageString,
					catalogue: catalogueString,
					resultUpdate: resultUpdate,
				});				
			});
		}
	});
	
},
// end updateProfile =================================================================================================


	getById: async function(req, res, next){
		let id = ParamsHelpers.getParam(req.params, 'id', ''); 
		await MainModel.getById(id, req.user ).then((data) => {
			if(data){
				res.status(200).json({
					"success" : true,
					data
				});
			}
			else{
				res.status(200).json({
					"success"	: true,
					data: "Empty data"
				});
			}
		});
	},
// end getById =================================================================================================
	search: async function(req, res, next) {
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		item = clean(item);
		let params = await ParamsHelpers.createPagination(item);
		await MainModel.listItems(params, req.user, item).then(async(data) => {
			if((!data) || (data.length < 1)) {
				params.pagination["totalItems"] = 0;
				res.status(200).json({
					success : true,	
					data: "Empty data",
					params,
				});
			}
			else {
				await MainModel.countItem(params, req.user, item).then( (data) => {
					params.pagination["totalItems"] = data;
				});
				res.status(200).json({
					success : true,	
					data,
					params,
				});
			}
		});
	},
// end search =================================================================================================

deleteById: async function(req, res, next) {
	try{
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		item = clean(item);
		await MainModel.deleteById(item._id, req.user).then((result) => {
			res.status(200).json({
				'success': result
			});
		});
	}
	catch(err){
		console.log(err);
		res.status(200).json({
			'success': false
		});
	}
	},
// end deleteById =================================================================================================

	deleteList: async function(req, res, next) {
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		item = clean(item);
		let listId = item["arrayId[]"];
		let isArray =  Array.isArray(listId);
		if(isArray == false){
			let listIdNew = [listId];
			item["arrayId[]"] = listIdNew;
		}
		await MainModel.deleteList(item, req.user).then((data) => {
			res.status(200).json({
				data
			});
		});
	},
// end deleteList =================================================================================================

	exportData: async function(req, res, next) {
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		item = clean(item);
		await MainModel.exportData(item, req.user).then((data) => {
			return res.status(200).json({
				success : true,
				data
			});
		});
	},
// end exportData =================================================================================================
};


