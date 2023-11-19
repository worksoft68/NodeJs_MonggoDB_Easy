//**************************************************************************************************************************
//     Creation time: Monday, 12 June 2023 7:01 PM
//     Creator: 
//**************************************************************************************************************************
const util = require('util');

const options = {
	name: { min: 1, max: 50 },
	slug: { min: 1, max: 50 },
	viewtype: { min: 3, max: 20 },
	status: { min: 3, max: 10 },
}

let validateSave = (obj, language) => {	
	let message = {};
	if((obj.name.length < options.name.min) || (obj.name.length > options.name.max)){
		message['name'] = util.format(language['Message_Invalid_name'], options.name.min, options.name.max);
	}
	if((obj.slug.length < options.slug.min) || (obj.slug.length > options.slug.max)){
		message['slug'] = util.format(language['Message_Invalid_slug'], options.slug.min, options.slug.max);
	}
	if((obj.viewtype.length < options.viewtype.min) || (obj.viewtype.length > options.viewtype.max)){
		message['viewtype'] = util.format(language['Message_Invalid_viewtype'], options.viewtype.min, options.viewtype.max);
	}
	if((obj.status.length < options.status.min) || (obj.status.length > options.status.max)){
		message['status'] = util.format(language['Message_Invalid_status'], options.status.min, options.status.max);
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
