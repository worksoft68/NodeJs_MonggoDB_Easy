//**************************************************************************************************************************
//     Creation time: Friday, 03 November 2023 3:40 PM
//     Creator: 
//**************************************************************************************************************************
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
//const databaseConfig = require(__path_configs + 'database');
let schema = new mongoose.Schema({
	id: Number,
	action_user: String,
	impact_zone: String,
	id_table: String,
	content_log: String,
	contentlog_max: String,
	ip: String,
	mac_address: String,
	hostname: String,
	id_user: Number,
	fullname: String,
	datetime_log: Date,
});
module.exports = mongoose.model('systemlogs', schema);


