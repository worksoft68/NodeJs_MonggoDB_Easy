
//const CustomSettingsModel 	= require(__path_models + 'customSettings');
const systemConfig  		= require(__path_configs + 'system');
let getParam = (params, property, defaultValue ) => {
	
    if(params.hasOwnProperty(property) && params[property] !== undefined){
		return params[property];
	}
	return defaultValue;
}
let createParam = async (req) => {

// 	try{
// 		let cookiesRead = req.cookies;
// 	}
// 	catch(err){
//	}
	let params 		 	 = {};
	let totalItemsPerPage = systemConfig.totalItemsPerPage;	
	//let numberItemPerPage = 30;
	try{
		let cookiesRead = req.cookies;
		totalItemsPerPage = cookiesRead.numberItemPerPage;
		totalItemsPerPage = parseInt(totalItemsPerPage);   
		if(isNaN(totalItemsPerPage) == true)
			totalItemsPerPage = systemConfig.totalItemsPerPage;    
		if(totalItemsPerPage < 1){      
			totalItemsPerPage = systemConfig.totalItemsPerPage;     
		} 
	}
	catch(err){
		totalItemsPerPage = systemConfig.totalItemsPerPage;
	}
	//totalItemsPerPage = numberItemPerPage;

	let pageRanges = systemConfig.pageRanges;	
	// await CustomSettingsModel.getItemByKey('Total_Items_Per_Page', 'Page_Ranges').then((item) =>{	
	// 	try{	        
	// 		let value1 = item[0].value;
	// 		if(value1 % 1 === 0){
	// 			totalItemsPerPage =  parseInt(value1);
	// 		}

	// 		let value2 = item[1].value;
	// 		if(value2 % 1 === 0){
	// 			pageRanges =  parseInt(value2);
	// 		}			
	// 	}
	// 	catch(error){}
	// });
	params.keyword		 = module.exports.getParam(req.query, 'keyword', '');
	params.currentStatus =  module.exports.getParam(req.params, 'status', 'all'); 
	params.sortField  	 =  module.exports.getParam(req.session, 'sort_field', 'name');
	params.sortType 	 =  module.exports.getParam(req.session, 'sort_type', 'asc');
	params.groupID 		 =  module.exports.getParam(req.session, 'group_id', '');
	params.pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: totalItemsPerPage,
		currentPage		 : parseInt(getParam(req.query, 'page', 1)),
		pageRanges		 : pageRanges
	};

	return params;
}

let createPagination = async (item) => {
	let currentPage = 1;
	let totalItemsPerPage 	= systemConfig.totalItemsPerPage;	
	let pageRanges 			= systemConfig.pageRanges;	
	try{
		currentPage = parseInt(item.Page);
	}
	catch(err){}
	try{		
		totalItemsPerPage = parseInt(item.numberItemPerPage);
	}
	catch(err){}
	let params 		 	 	= {};	
	params.pagination 	 	= {
		totalItems		 	: 1,
		totalItemsPerPage	: totalItemsPerPage,
		currentPage		 	: currentPage,
		pageRanges		 	: pageRanges
	};
	return params;
}

module.exports = {
    getParam,
	createParam,
	createPagination
}