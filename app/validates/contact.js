//**************************************************************************************************************************
//     Creation time: Saturday, 04 November 2023 3:34 PM
//     Creator: 
//**************************************************************************************************************************
const {check} = require('express-validator');

const options = {
	content_message: { min: 1, max: 2000 },
}

let validateSave = () => {	
	return [
		check('content_message', 'Message_Invalid_content_message').isLength({ min: options.content_message.min, max: options.content_message.max }),
	];
}

let validate = {
	validateSave,
	options,
};
module.exports = {validate};
