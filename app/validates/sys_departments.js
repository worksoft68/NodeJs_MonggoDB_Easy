//**************************************************************************************************************************
//     Creation time: Monday, 12 June 2023 3:48 PM
//     Creator: 
//**************************************************************************************************************************
const {check} = require('express-validator');

const options = {
	company_id: { min: 1, max: 50 },
	department_name: { min: 1, max: 50 },
}

let validateSave = () => {	
	return [
		check('company_id', 'Message_Invalid_company_id').isLength({ min: options.company_id.min, max: options.company_id.max }),
		check('department_name', 'Message_Invalid_department_name').isLength({ min: options.department_name.min, max: options.department_name.max }),
	];
}

let validate = {
	validateSave,
	options,
};
module.exports = {validate};
