const mongoose = require('mongoose');
let schema = {
	action			: String,
	impactZone		: String,
	idCollection	: String,
	contentLog		: String,	
	ip				: String,
	macAddress		: String,
	hostName		: String,
	userId			: String,
	fullName		: String,
	dateTimeLog		: Date,
};
module.exports = mongoose.model('sys_Log', schema);
