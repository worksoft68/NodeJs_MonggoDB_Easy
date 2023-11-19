//**************************************************************************************************************************
//     Creation time: Monday, 19 September 2022 2:12 PM
//     Creator: 
//**************************************************************************************************************************

//**************************************************************************************************************************
//   This file cannot be used directly. You copy and paste this source to where you need it if needed 
//**************************************************************************************************************************

var express             = require('express');
var router              = express.Router();
var asyncHandler        = require(__path_middleware + 'async');

//**************************************************************************************************************************

const sys_departmentsControllers = require(__path_controllers + 'sys_departments');

router.post('/save', protect, authorize(collection,"save"), asyncHandler(MainControllers.save));

router.put('/update', protect, authorize(collection,"save"), asyncHandler(MainControllers.update));

router.get('/getById/:id', protect, authorize(collection,"getData"), asyncHandler(MainControllers.getById));

router.delete('/deleteById', protect, authorize(collection,"delete"), asyncHandler(MainControllers.deleteById));

module.exports = router;
