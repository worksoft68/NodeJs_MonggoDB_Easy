var express = require('express');
var router = express.Router();
var asyncHandler = require(__path_middleware + 'async');
var {protect, authorize}       = require(__path_middleware + 'authAPI')

//var {protect , authorize}   = require(__path_middleware + 'auth')

router.get('/me',protect,authorize("categories","getData"), asyncHandler(async (req,res, next) => {
    return res.status(200).send({ status: true, success: true, data: req.user });
}));



module.exports = router;
