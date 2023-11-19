var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const ArticlesModel 	= require(__path_models + 'articles');
const CategoriesModel = require(__path_models + 'categories');
const folderView	 = __path_views_blog + 'pages/categories/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/:id', async (req, res, next) => {
	let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');
	let arridCategory = idCategory.split('-');
	idCategory = arridCategory[arridCategory.length-1];
	let itemsInCategory	= [];
	let keyword 		= '';
	let view_type		= '';
	//let itemsCategories	= [];
	// Article In Category
	await ArticlesModel.listItemsFrontendItemsInCategory(idCategory)
						.then( (items) => { 
							itemsInCategory = items; 
						});

	//await CategoriesModel.listItemsFrontend(null, {task:'items-in-menu'}).then( (items) =>{itemsCategories = items;});
	await CategoriesModel.getByIdFrontend(idCategory, null ).then( (item) => { view_type = item.viewtype; });
	
	
	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		itemsInCategory,		
		view_type,
		keyword
	});
});
// tìm  tất cả bài viết  
//http://localhost:6969/categories/search/all?Search-box=abc
router.get('(/search/:search)?', async (req, res, next) => {
	let itemsInCategory = [];
	let keyword		 = ParamsHelpers.getParam(req.query, 'keyword', '');
	let view_type		= 'view-list';
	
	await ArticlesModel.searchItemsFrontend(keyword).then((item) => {
		itemsInCategory = item; 
		});

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		itemsInCategory,		
		view_type,
		keyword
	});
});

module.exports = router;
