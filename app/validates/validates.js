//**************************************************************************************************************************
//     Creation time: Thursday, 04 May 2023 4:08 PM
//     Creator: 
//**************************************************************************************************************************

const util          = require('util');
const {validationResult} = require('express-validator');

const validateReq = async (req, res, name_cookie_language, options) => {
	const checkValidate = validationResult(req);
	let errors = checkValidate.errors;	
	if (errors.length == 0) {
		return false;
	}
	else {
		let languageInterface = req.cookies[name_cookie_language];
		if((typeof languageInterface == 'undefined')) {
			languageInterface = req[name_cookie_language];
		} 
		language = languageInterface.text;
		let message = {};
		errors.map((val,ind) => {
			let text = language[val.msg];
			message[val.path] = util.format(text, options.Name.min, options.Name.max);
		})
		return message;
		//return res.status(400).json({status:400, success : true, error : message});
	}
}

let validateRequest = {
	validateReq: validateReq,	
};

module.exports = {validateRequest};




