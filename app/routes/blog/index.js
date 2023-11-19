var express = require('express');
var router = express.Router();

//const middleGetUserInfo         = {};//require(__path_middleware + 'get-user-info');
const middleGetCategoryForMenu  = require(__path_middleware + 'get-category-for-menu');
const middleArticleRandom       = require(__path_middleware + 'get-article-random');
const middleCustomSettings       = require(__path_middleware + 'get-customSettings');

router.use('/auth', require('./auth'));
router.use('/',  middleGetCategoryForMenu, middleArticleRandom, middleCustomSettings, require('./home'));
 //router.use('/', require('./home'));
 router.use('/categories', require('./categories'));
 router.use('/about', require('./about'));
 router.use('/contact', require('./contact'));
 router.use('/articles', require('./articles'));

module.exports = router;
