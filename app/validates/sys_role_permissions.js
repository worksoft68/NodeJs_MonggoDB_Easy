//**************************************************************************************************************************
//     Creation time: Friday, 02 June 2023 2:11 PM
//     Creator: 
//**************************************************************************************************************************
const {check} = require('express-validator');

const options = {
	role_id: { min: 1, max: 4294967295 },
	functions: { min: 1, max: 50 },
}

let validateSave = () => {	
	return [
		check('role_id', 'Message_Invalid_role_id').isInt({min: options.role_id.min, max: options.role_id.max}),
		check('functions', 'Message_Invalid_functions').isLength({ min: options.functions.min, max: options.functions.max }),
	];
}

let validate = {
	validateSave,
	options,
};
module.exports = {validate};
