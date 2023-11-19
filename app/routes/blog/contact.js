var express = require('express');
var router = express.Router();
const clean = require('xss-clean/lib/xss').clean;
const publicFunction = require(__path_helpers + 'publicFunction');
let collection = 'contact';
const MainModel = require(__path_models + collection);
const folderView	 = __path_views_blog + 'pages/contact/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET contact page. */
router.get('/', async (req, res, next) => {
//let itemsCategories	= [];
//await CategoriesModel.listItemsFrontend(null, {task:'items-in-menu'}).then( (items) =>{itemsCategories = items;});
	
	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		
	});
});

router.post('/SendContact', async (req, res, next) => {
	let item = Object.assign(req.body);
	console.log(item);	
	item["fullname"] = publicFunction.decodeSpecialCharacters(item.fullname);
	item["email"] = publicFunction.decodeSpecialCharacters(item.email);
	item["phone"] = publicFunction.decodeSpecialCharacters(item.phone);
	item["content_message"] = publicFunction.decodeSpecialCharacters(item.content_message);
	item = clean(item);	

	let error = await validate(item);
	var keysError    = Object.keys(error); 
    let countError   = keysError.length;
	console.log(error);
	if(countError > 0){
		return res.status(400).json({status:400, success : true, error : error});
	}
	else{		
		await MainModel.saveInsert(item).then((data) => {
			res.status(data.status).send({status:data.status, success : data.success, data})	
		});
	}
	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		
	});	
});

async function validate(item){
	let message = {};
	if((item.fullname.length < 10)||(item.fullname.length > 50)) {
		message['fullname'] ='Fullname must be between 10 and 100 characters';
		
	}
	if((item.email.length < 13) || (item.email.length > 50)) {
		message['email'] ='Email must be between 13 and 50 characters';		
	}

	if((item.phone.length < 8) || (item.phone.length > 25)) {
		message['phone'] ='Phone must be between 8 and 25 characters';
		
	}

	if((item.content_message.length < 30) || (item.content_message.length > 2000)) {
		message['content_message'] ='ContentMessage must be between 30 and 2000 characters';
	}
	return message;

}


module.exports = router;
