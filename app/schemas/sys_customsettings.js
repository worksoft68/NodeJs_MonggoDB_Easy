//**************************************************************************************************************************
//     Creation time: Friday, 30 September 2022 1:24 PM
//     Creator: 
//**************************************************************************************************************************
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
//const databaseConfig = require(__path_configs + 'database');
let schema = new mongoose.Schema({
	keySettings: String,
	image_setting: String,
	is_use_ckeditor: Boolean,
	value_setting: String,
	default_value: String,
	location: String,
	start_time: Date,
	end_time: Date,
	description: String,
	status: String,
	ordering: Number,
	is_system: Boolean,
	create: {
		user_id_created: String,
		user_name_created: String,
		datetime_created: Date
	},

	modified: {
		user_id_modified: String,
		user_name_modified: String,
		datetime_modified: Date
	},

});
module.exports = mongoose.model('sys_customsettings', schema);


