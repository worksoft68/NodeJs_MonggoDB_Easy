//**************************************************************************************************************************
//     Creation time: Friday, 03 November 2023 5:03 PM
//     Creator: 
//**************************************************************************************************************************
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
//const databaseConfig = require(__path_configs + 'database');
let schema = new mongoose.Schema({
	id: String,
	action_user: String,
	impact_zone: String,
	id_collection: String,
	content_log: String,
	ip: String,
	mac_address: String,
	hostname: String,
	id_user: String,
	fullname: String,
	datetime_log: Date,
});
module.exports = mongoose.model('sys_logs', schema);


