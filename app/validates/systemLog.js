const util          = require('util');
const collection 	= "systemLog";
const publicFunction = require(__path_helpers + 'publicFunction');

const options = {
}
module.exports = {
	validator: async (req) => {
		let language 	= await publicFunction.getLanguageJson(collection+".ini");

		let errors  = req.validationErrors() !== false ? req.validationErrors() : [];
		let message = {};
		errors.map((val,ind) => {
			let text = language[val.param];
			message[text] = val.msg;
		})
		return message;
	}
}
