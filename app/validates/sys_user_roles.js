//**************************************************************************************************************************
//     Creation time: Friday, 02 June 2023 3:18 PM
//     Creator: 
//**************************************************************************************************************************
const {check} = require('express-validator');

const options = {
	role_id: { min: 0, max: 4294967295 },
	user_id: { min: 0, max: 4294967295 },
}

let validateSave = () => {	
	return [
		check('role_id', 'Message_Invalid_role_id').isInt({min: options.role_id.min, max: options.role_id.max}),
		check('user_id', 'Message_Invalid_user_id').isInt({min: options.user_id.min, max: options.user_id.max}),
	];
}

let validate = {
	validateSave,
	options,
};
module.exports = {validate};
