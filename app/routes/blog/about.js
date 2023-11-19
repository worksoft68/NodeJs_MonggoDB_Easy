var express = require('express');
var router = express.Router();
//const CategoriesModel = require(__path_models + 'categories');



const folderView	 = __path_views_blog + 'pages/about/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET about page. */
router.get('/', async (req, res, next) => {
	//let itemsCategories	= [];
//await CategoriesModel.listItemsFrontend(null, {task:'items-in-menu'}).then( (items) =>{itemsCategories = items;});


	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		
	});
});

module.exports = router;
