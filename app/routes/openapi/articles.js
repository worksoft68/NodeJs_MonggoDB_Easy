var express = require('express');
var router = express.Router();
const collection = "articles";
const MainControllers = require(__path_controllersAPI + collection);
var asyncHandler = require(__path_middleware + 'async');


router.get('(/)?', asyncHandler(MainControllers.getAll));

router.get('/:id', asyncHandler(MainControllers.getById));

module.exports = router;
