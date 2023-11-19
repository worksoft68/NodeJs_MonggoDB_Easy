const clean = require('xss-clean/lib/xss').clean;
const collection = "sys_departments";//use this parameter to check permissions: save, select, delete.... 
const name_Cookie_Language = 'language_' + collection.toLowerCase();
const MainModel = require(__path_models + collection);
const {validate}  	= require(__path_validates + collection);
const {validateRequest}  	= require(__path_validates + 'validates');
const sys_companiesModel = require(__path_models + 'sys_companies');
const ParamsHelpers = require(__path_helpers + 'params');
const publicFunction = require(__path_helpers + 'publicFunction');
const pageTitleIndex = 'Department Management';
const folderView = __path_views_backend + collection + '/';

module.exports = {
	//indexString function is similar to the indexJson above, but the return data is string, not json
	indexString: async function(req, res, next) {
		let params 			= await ParamsHelpers.createParam(req);
		let languageString 	= JSON.stringify(await publicFunction.getLanguageRequest(req, name_Cookie_Language));
		const catalogue = [];
		sys_companies = await sys_companiesModel.listItemForDropdown();
		catalogue.push(sys_companies);
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
				catalogue : catalogueString,
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
				await MainModel.countItem(params, req.user).then((data) => {
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
				await MainModel.countItem(params, req.user, item).then((data) => {
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

getDepartmentByCompany: async function(req, res, next) {
	req.body = JSON.parse(JSON.stringify(req.body));
	let item = Object.assign(req.body);
	item = clean(item);
	await MainModel.listItemForDropdownByCompany(item).then((data) => {
		return res.status(200).json({
			success : true,
			data
		});
	});
},

	searchGet: async function(req, res, next){
		let params 			= await ParamsHelpers.createParam(req);
		let languageString 	= JSON.stringify(await publicFunction.getLanguageRequest(req, name_Cookie_Language));
		const catalogue = [];
		sys_companies = await sys_companiesModel.listItemForDropdown();
		catalogue.push(sys_companies);
		let catalogueString = JSON.stringify(catalogue);
		let item = {
			company_id : await ParamsHelpers.getParam(req.query, 'company_id', ''),
			department_name : await ParamsHelpers.getParam(req.query, 'department_name', ''),
			abbreviation : await ParamsHelpers.getParam(req.query, 'abbreviation', ''),
		};
		item = clean(item);
		MainModel.listItems(params, req.user, item).then(async(items) => {
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
		let item = {
			company_id : await ParamsHelpers.getParam(req.query, 'company_id', ''),
			department_name : await ParamsHelpers.getParam(req.query, 'department_name', ''),
			abbreviation : await ParamsHelpers.getParam(req.query, 'abbreviation', ''),
		};
		item = clean(item);
		MainModel.listItems(params, req.user, item).then(async(items) => {
			if((!items) || (items.length < 1)){
				params.pagination.totalItems = 0;
				items = "Empty data";
			}
			else {
				await MainModel.countItem(params, req.user).then( (data) => {
					params.pagination.totalItems = data;
				});
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

	save: async function(req, res, next) {
		let error = await validateRequest.validateReq(req,res, name_Cookie_Language,validate.options);
		if(error){
			return res.status(400).json({status:400, success : true, error : error});
		}
		else{
			req.body = JSON.parse(JSON.stringify(req.body));
			let item = Object.assign(req.body);
			item = clean(item);
			await MainModel.saveInsert(item, req.user).then((data) => {
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
			await MainModel.saveUpdate(item, req.user).then((data) => {
				return res.status(data.status).json({status: data.status, success : data.success, data})
			});
		}
	},
// end update =================================================================================================

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
				await MainModel.countItem(params, req.user).then( (data) => {
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

