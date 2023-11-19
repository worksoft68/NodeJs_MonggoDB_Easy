var express = require('express');
var router = express.Router();

//const folderView	 = __path_views_backend + 'profile/';

const MainControllers = require(__path_controllers + "sys_users");
var asyncHandler       = require(__path_middleware + 'async');
router.get('(/)?', asyncHandler(MainControllers.profile));
router.post('/updateProfile', asyncHandler(MainControllers.updateProfile));
router.get('/updateProfile', asyncHandler(MainControllers.profile));
/* GET home page. */
// router.get('/', function(req, res, next) { 
//   let userLogin		= publicFunction.getUserLogin(req);	
//   res.render(`${folderView}index`, { pageTitle   : 'My profile' });
// });


module.exports = router;