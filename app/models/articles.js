//**************************************************************************************************************************
//     Creation time: Saturday, 01 October 2022 6:07 PM
//     Creator: 
//**************************************************************************************************************************
var moment = require('moment');
const mainSchema 	= require(__path_schemas + 'articles');
const FileHelpers	= require(__path_helpers + 'file');
const publicFunction	= require(__path_helpers + 'publicFunction');
const LogModel = require(__path_models + 'sys_logs'); 
const systemConfig = require(__path_configs + 'system');
const collection = 'articles';//use this parameter to check permissions: save, select, delete.... 
const uploadFolder = 'public/uploads/'+collection+'/';

module.exports = {
	saveInsert: async (item, userLogin) => {
		let data = {
			categorie_id: item.categorie_id,
			categories: {
				id: item.categorie_id,
				name: item.name,								
			},
			title: item.title,
			slug: item.slug,
			thumb: item.thumb,
			summary: item.summary,
			content_articles: publicFunction.decodeSpecialCharacters(item.content_articles),
			ordering: item.ordering,
			is_special: item.is_special,
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
			categorie_id: item.categorie_id,
			categories: {
				id: item.categorie_id,				
				name: item.name,
			},
			title: item.title,
			slug: item.slug,
			thumb: item.thumb,
			summary: item.summary,
			content_articles: publicFunction.decodeSpecialCharacters(item.content_articles),
			ordering: item.ordering,
			is_special: item.is_special,
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
			if((options.categorie_id != "") && (options.categorie_id != undefined)){
				objWhere.categorie_id = new RegExp(options.categorie_id, 'i');
			}
			if((options.title != "") && (options.title != undefined)){
				objWhere.title = new RegExp(options.title, 'i');
			}
			if((options.slug != "") && (options.slug != undefined)){
				objWhere.slug = new RegExp(options.slug, 'i');
			}
			if((options.thumb != "") && (options.thumb != undefined)){
				objWhere.thumb = new RegExp(options.thumb, 'i');
			}
			if((options.summary != "") && (options.summary != undefined)){
				objWhere.summary = new RegExp(options.summary, 'i');
			}
			if((options.content_articles != "") && (options.content_articles != undefined)){
				objWhere.content_articles = new RegExp(options.content_articles, 'i');
			}
			if((options.status != "") && (options.status != "novalue") && (options.status != undefined)){
				objWhere.status = new RegExp(options.status, 'i');
			}
			if((options.sortColumn !="" ) && (options.sortColumn != undefined))
				sort[options.sortColumn] =  options.sortType; 
		}
		else{
			sort["create.datetime_created"] =  'desc'; 
		}
		let fields = ' _id categorie_id categories company_id title slug thumb summary content_articles ordering is_special status approved create modified count_view count_like count_dislike';
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
			if((options.categorie_id != "") && (options.categorie_id != undefined)){
				objWhere.categorie_id = new RegExp(options.categorie_id, 'i');
			}
			if((options.title != "") && (options.title != undefined)){
				objWhere.title = new RegExp(options.title, 'i');
			}
			if((options.slug != "") && (options.slug != undefined)){
				objWhere.slug = new RegExp(options.slug, 'i');
			}
			if((options.thumb != "") && (options.thumb != undefined)){
				objWhere.thumb = new RegExp(options.thumb, 'i');
			}
			if((options.summary != "") && (options.summary != undefined)){
				objWhere.summary = new RegExp(options.summary, 'i');
			}
			if((options.content_articles != "") && (options.content_articles != undefined)){
				objWhere.content_articles = new RegExp(options.content_articles, 'i');
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
		//let fields = ' _id categorie_id categories company_id title slug thumb summary content_articles ordering is_special status approved create modified count_view count_like count_dislike';
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
			.select(' _id categorie_id categories company_id title slug thumb summary content_articles ordering is_special status approved create modified count_view count_like count_dislike')
	},

	deleteById: async (id, userLogin= null) => {
		let item_Old = await mainSchema.findById(id);
		await LogModel.saveLog("Delete", collection, item_Old._id, item_Old, userLogin);
		let rerultDeleteFile = await FileHelpers.remove(uploadFolder, item_Old.thumb);
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
			if((options.categorie_id != "") && (options.categorie_id != undefined)){
				objWhere.categorie_id = new RegExp(options.categorie_id, 'i');
			}
			if((options.title != "") && (options.title != undefined)){
				objWhere.title = new RegExp(options.title, 'i');
			}
			if((options.slug != "") && (options.slug != undefined)){
				objWhere.slug = new RegExp(options.slug, 'i');
			}
			if((options.thumb != "") && (options.thumb != undefined)){
				objWhere.thumb = new RegExp(options.thumb, 'i');
			}
			if((options.summary != "") && (options.summary != undefined)){
				objWhere.summary = new RegExp(options.summary, 'i');
			}
			if((options.content_articles != "") && (options.content_articles != undefined)){
				objWhere.content_articles = new RegExp(options.content_articles, 'i');
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
		let fields = ' _id categorie_id categories company_id title slug thumb summary content_articles ordering is_special status approved create modified count_view count_like count_dislike';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.sort(sort);
	},
	
	listItemsFrontendSpecial: async () => {
		let objWhere    = {
			status: 'Active',
			is_special: true
		};		
		
		let fields = ' _id categorie_id categories company_id title slug thumb summary content_articles ordering is_special create modified count_view count_like count_dislike';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.limit(3);
	},
	getItemsByIdFrontend: async (id) => {
		let objWhere    = {
			status: 'Active',
			_id:id
		};		
		
		let fields = ' _id categorie_id categories company_id title slug thumb summary content_articles ordering is_special create modified count_view count_like count_dislike';
		let result =  await mainSchema
			.find(objWhere)
			.select(fields);	
		//console.log(result);
		return 	result;	
	},
	listItemsFrontendItemsNews: async () => {
		let objWhere    = {status: 'Active'};
		let fields = ' _id categorie_id categories company_id title slug thumb summary content_articles ordering is_special create modified count_view count_like count_dislike';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.limit(3);	
	},
	listItemsFrontendItemsInCategory: async (categorie_id) => {
		let objWhere    = {
			status: 'Active',
			categorie_id: categorie_id			
		};		
		let fields = ' _id categorie_id categories company_id title slug thumb summary ordering is_special create modified count_view count_like count_dislike';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.limit(10);
	},
	
	listItemsFrontendItemsOthers: async (id, categorie_id) => {
		let objWhere    = {
			status: 'Active',
			categorie_id: categorie_id,
			'_id': {$ne: id},
		};		
		let fields = ' _id categorie_id categories company_id title slug thumb summary  ordering is_special create modified count_view count_like count_dislike';
		let result= await mainSchema
			.find(objWhere)
			.select(fields)
			.limit(3);
		//console.log(result);
		return result;
	},
	listItemsFrontendItemRandom: async () => {
		let objWhere    = {status: 'Active'};
		let fields = ' _id categorie_id categories company_id title slug thumb summary content_articles ordering is_special create modified count_view count_like count_dislike';
		return await mainSchema
			.find(objWhere)
			.select(fields)
			.limit(3);			
	},
	searchItemsFrontend: (keyword) => {
        let andQueryTitle    = [];
        let andQuerySummary = [];
        let andQueryContent = [];
        let andQueryStatus  = {status:'Active'};
        let limit           = 20;
        let sort            = {'created.datetime_created': 'desc'}; 
		let fields = ' _id categorie_id categories company_id title slug thumb summary content_articles ordering is_special create modified count_view count_like count_dislike';
        let arrKeyword = keyword.split('-');
        for(let index=0; index < arrKeyword.length; index++)
        {
            if(arrKeyword[index] != "")
            {
                andQueryTitle.push({title: new RegExp(arrKeyword[index], 'i')});
                andQuerySummary.push({summary: new RegExp(arrKeyword[index], 'i')});
                andQueryContent.push({content: new RegExp(arrKeyword[index], 'i')});               
            }
        }
        let query = {$and:[andQueryStatus,{$and:[{$or: andQueryTitle},{$or: andQuerySummary},{$or: andQueryContent}]}]};
        return mainSchema
            .find(query)
            .select(fields)
            .limit(limit)
            .sort(sort);       
    },
	
	
}
