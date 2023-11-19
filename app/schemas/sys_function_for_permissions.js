//**************************************************************************************************************************
//     Creation time: Monday, 12 June 2023 4:21 PM
//     Creator: 
//**************************************************************************************************************************
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
//const databaseConfig = require(__path_configs + 'database');
let schema = new mongoose.Schema({
	function_name: String,
	description: String,
	note: String,
	modulesystem: String,
	status: Boolean,
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
module.exports = mongoose.model('sys_function_for_permissions', schema);


