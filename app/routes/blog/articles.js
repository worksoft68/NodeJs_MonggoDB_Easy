var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const ArticlesModel 	= require(__path_models + 'articles');
//const CategoriesModel = require(__path_models + 'categories');

const folderView	 = __path_views_blog + 'pages/articles/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/:id', async (req, res, next) => {
	let idArticle 		= ParamsHelpers.getParam(req.params, 'id', '');
	let arridArticle 	= idArticle.split('-');
	let categorie_id = 0;
	idArticle = arridArticle[arridArticle.length-1];
	
	let itemArticle		= {};
	let itemsOthers		= [];
	//let itemsCategories	= [];
	// Article Info
	await ArticlesModel.getItemsByIdFrontend(idArticle, null ).then( (item) => {
		 itemArticle = item; 
		 categorie_id = item[0].categorie_id;
		});

	// Article In Category
	await ArticlesModel.listItemsFrontendItemsOthers(idArticle, categorie_id).then( (items) => { itemsOthers = items; });
	//await CategoriesModel.listItemsFrontend(null, {task:'items-in-menu'}).then( (items) =>{itemsCategories = items;});

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		itemsOthers,
		itemArticle,
		
	});
});

module.exports = router;
