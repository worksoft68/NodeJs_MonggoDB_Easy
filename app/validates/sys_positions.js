//**************************************************************************************************************************
//     Creation time: Saturday, 10 June 2023 1:18 PM
//     Creator: 
//**************************************************************************************************************************
const {check} = require('express-validator');

const options = {
	position_name: { min: 1, max: 50 },
}

let validateSave = () => {	
	return [
		check('position_name', 'Message_Invalid_position_name').isLength({ min: options.position_name.min, max: options.position_name.max }),
	];
}

let validate = {
	validateSave,
	options,
};
module.exports = {validate};
