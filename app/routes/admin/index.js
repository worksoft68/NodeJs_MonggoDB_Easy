var express = require('express');
var router = express.Router();



// add middleAuthentication vào giữa router để kiểm tra đăng nhập

const middleGetUserInfo = require(__path_middleware + 'get-user-info');
const {language}  = require(__path_middleware + 'get-language');
router.use('/auth', require('./auth'));
router.use('/', middleGetUserInfo, require('./home'));

// your router is here
router.use('/sys_companies', language('sys_companies'), require('./sys_companies'));
router.use('/sys_departments', language('sys_departments'), require('./sys_departments'));
router.use('/sys_positions', language('sys_positions'), require('./sys_positions'));
router.use('/sys_roles', language('sys_roles'), require('./sys_roles'));
router.use('/sys_function_for_permissions', language('sys_function_for_permissions'), require('./sys_function_for_permissions'));
router.use('/sys_permissions', language('sys_permissions'), require('./sys_permissions'));
router.use('/sys_users', language('sys_users'), require('./sys_users'));
router.use('/sys_customsettings', language('sys_customsettings'), require('./sys_customsettings'));
router.use('/categories', language('categories'), require('./categories'));
router.use('/articles', language('articles'), require('./articles'));
router.use('/profile', language('sys_users'), require('./profile'));
router.use('/contact', language('contact'), require('./contact'));
router.use('/sys_logs', language('sys_logs'), require('./sys_logs'));



module.exports = router;




