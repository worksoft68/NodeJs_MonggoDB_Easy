//**************************************************************************************************************************
//     Creation time: Monday, 12 June 2023 6:37 PM
//     Creator: 
//**************************************************************************************************************************
const util = require('util');

const options = {
	keySettings: { min: 1, max: 50 },
	value_setting: { min: 1, max: 1600 },
	default_value: { min: 1, max: 1600 },
	location: { min: 1, max: 50 },
}

let validateSave = (obj, language) => {	
	let message = {};
	if((obj.keySettings.length < options.keySettings.min) || (obj.keySettings.length > options.keySettings.max)){
		message['keySettings'] = util.format(language['Message_Invalid_keySettings'], options.keySettings.min, options.keySettings.max);
	}
	if((obj.value_setting.length < options.value_setting.min) || (obj.value_setting.length > options.value_setting.max)){
		message['value_setting'] = util.format(language['Message_Invalid_value_setting'], options.value_setting.min, options.value_setting.max);
	}
	if((obj.default_value.length < options.default_value.min) || (obj.default_value.length > options.default_value.max)){
		message['default_value'] = util.format(language['Message_Invalid_default_value'], options.default_value.min, options.default_value.max);
	}
	if((obj.location.length < options.location.min) || (obj.location.length > options.location.max)){
		message['location'] = util.format(language['Message_Invalid_location'], options.location.min, options.location.max);
	}
	if(Object.keys(message).length==0)
		return false;
	return message;	
}

let validate = {
	validateSave,
	options,
};
module.exports = {validate};
