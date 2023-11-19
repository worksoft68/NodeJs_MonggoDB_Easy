var express = require('express');
var router = express.Router();
const systemConfig  = require(__path_configs + 'system');
const folderView	 = __path_views_backend + 'home/';
const linkIndex		 = '/' + systemConfig.prefixAdmin + '/dashboards/';
/* GET home page. */
router.get('/', function(req, res, next) {
  // res.send('test 123');
  res.render(`${folderView}index`, { pageTitle   : 'HomePage ' });
});

module.exports = router;
