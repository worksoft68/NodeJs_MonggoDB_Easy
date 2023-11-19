const util          = require('util');
const collection 	= "groups";
const publicFunction = require(__path_helpers + 'publicFunction');

const options = {
	GroupName: { min: 1, max: 150 },
}
module.exports = {
	validator: async (req) => {
		let language 	= await publicFunction.getLanguageJson(collection+".ini");

		//GroupName
		req.checkBody('GroupName', util.format(language["Message_Invalid_GroupName"], options.GroupName.min, options.GroupName.max))
			.isLength({ min: options.GroupName.min, max: options.GroupName.max });

		let errors  = req.validationErrors() !== false ? req.validationErrors() : [];
		let message = {};
		errors.map((val,ind) => {
			let text = language[val.param];
			message[text] = val.msg;
		})
		return message;
	}
}
