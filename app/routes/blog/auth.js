var express = require('express');
var router 	= express.Router();

var passport = require('passport');

const StringHelpers = require(__path_helpers + 'string');
const systemConfig  = require(__path_configs + 'system');


const middleGetUserInfo         = require(__path_middleware + 'get-user-info');
const middleGetCategoryForMenu  = require(__path_middleware + 'get-category-for-menu');
const middleArticleRandom       = require(__path_middleware + 'get-article-random');
const middleCustomSettings       = require(__path_middleware + 'get-customSettings');

const ValidateLogin	= require(__path_validates + 'login');
const folderView	= __path_views_blog + 'pages/auth/';
const layoutLogin   = __path_views_blog + 'login';
const layoutBlog   	= __path_views_blog + 'frontend';
const linkIndex		= StringHelpers.formatLink('/' + systemConfig.prefixBlog + '/'); 
const linkLogin		= StringHelpers.formatLink('/' + systemConfig.prefixBlog + '/auth/login/'); 
const linkLoginSuccess		= StringHelpers.formatLink('/' + systemConfig.prefixBlog + '/auth/loginSuccess/'); 


/* GET logout page. */
router.get('/logout', function(req, res, next) {
	req.logout(); // thư viện tự logout
	res.redirect(linkLogin);
});






/* GET dashboard page. */
router.get('/no-permission', middleGetUserInfo, middleGetCategoryForMenu, middleArticleRandom, middleCustomSettings, function(req, res, next) {
	res.render(`${folderView}no-permission`, { layout: layoutBlog,  top_post: false});
});
  




module.exports = router;
