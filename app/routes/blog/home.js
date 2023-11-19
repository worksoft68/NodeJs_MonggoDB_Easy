var express = require('express');
var router = express.Router();

const ArticlesModel 	= require(__path_models + 'articles');
//const CategoriesModel = require(__path_models + 'categories');
const folderView	 = __path_views_blog + 'pages/home/';// vào thư mục view
const layoutBlog    = __path_views_blog + 'frontend'; // file layout

/* GET home page. */
router.get('/', async (req, res, next) => {
	
	let itemsSpecial 	= [];
	let itemsNews 	 	= [];
	//let itemsCategories	= [];
	//let itemsRandoms	= [];
	// Special
	await ArticlesModel.listItemsFrontendSpecial().then( (items) => { itemsSpecial = items; });

	// Latest News
	await ArticlesModel.listItemsFrontendItemsNews().then( (items) => { itemsNews = items; });

	//await CategoriesModel.listItemsFrontend(null, {task:'items-in-menu'}).then( (items) =>{itemsCategories = items;});
	
	//await ArticlesModel.listItemsFrontend(null, {task: 'items-random'} ).then( (items) => { itemsRandoms = items; });


	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: true,
		itemsSpecial,
		itemsNews,
		
		
	});
});

module.exports = router;
