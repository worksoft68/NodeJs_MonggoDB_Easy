//**************************************************************************************************************************
//     Creation time: Saturday, 10 June 2023 1:20 PM
//     Creator: 
//**************************************************************************************************************************
const {check} = require('express-validator');

const options = {
	name: { min: 1, max: 200 },
	address: { min: 1, max: 100 },
}

let validateSave = () => {	
	return [
		check('name', 'Message_Invalid_name').isLength({ min: options.name.min, max: options.name.max }),
		check('address', 'Message_Invalid_address').isLength({ min: options.address.min, max: options.address.max }),
	];
}

let validate = {
	validateSave,
	options,
};
module.exports = {validate};
