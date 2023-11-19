var express = require('express');
var router = express.Router();
const systemConfig = require(__path_configs + 'system');
const folderView = __path_views_backend + 'home/';
const linkIndex = '/' + systemConfig.prefixLink + '/dashboards/';
const publicFunction = require(__path_helpers + 'publicFunction');
/* GET home page. */
router.get('/', function (req, res, next) { 
  res.render(`${folderView}index`, {
    pageTitle: 'Home Page Admin',
    userLogin:req.user
  });
});

module.exports = router;
