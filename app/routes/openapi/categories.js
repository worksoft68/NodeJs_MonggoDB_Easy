var express = require('express');
var router = express.Router();
const collection = "categories";
const MainControllers = require(__path_controllers + collection);
 var asyncHandler = require(__path_middleware + 'async');


router.post('/', asyncHandler(MainControllers.getAll));

router.get('/:id', asyncHandler(MainControllers.getById));

router.post('/search', asyncHandler(MainControllers.search));

router.post('/add', asyncHandler(MainControllers.search));

//router.get('/abc', asyncHandler(MainControllers.getByIdabc));
	
// Change status
// router.get('/abc', (req, res, next) => {

	
	
// });


//router.get('/(:id)', asyncHandler(MainControllers.getByIdabc));

module.exports = router;
