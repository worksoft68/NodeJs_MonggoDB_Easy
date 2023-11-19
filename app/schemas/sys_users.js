//**************************************************************************************************************************
//     Creation time: Thursday, 22 September 2022 10:19 AM
//     Creator: 
//**************************************************************************************************************************
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
//const databaseConfig = require(__path_configs + 'database');
let schema = new mongoose.Schema({
	employee_code: String,
	id_company: {
			type: Schema.Types.ObjectId,
			ref: 'sys_companies',
			required: true
		},
	sys_companies: {
			id: {type: Schema.Types.ObjectId},
			name : String
		},
	id_department: {
			type: Schema.Types.ObjectId,
			ref: 'sys_departments',
			required: true
		},
	sys_departments: {
			id: {type: Schema.Types.ObjectId},
			department_name : String
		},
	id_position: {
			type: Schema.Types.ObjectId,
			ref: 'sys_positions',
			required: true
		},
	sys_positions: {
			id: {type: Schema.Types.ObjectId},
			position_name : String
		},
	lastname: String,
	firstname: String,
	username: String,
	username_encrypted: String,
	password: String,
	tokenLogin: String,
	birthday: Date,
	sex: String,
	email: String,
	phonenumber: String,
	address: String,
	district: String,
	provincial: String,
	nation: String,
	is_management: Number,
	status: String,
	last_time_login: Date,
	avatar: String,
	receive_email: Number,
	receive_sms: Number,
	full_path_temporary_save: String,
	temporary_file_name: String,
	path_temporary_save: String,
	manager_code: Number,
	link_change_password: String,
	token_change_password: String,
	notification_time_changed_password: Date,
	time_changed_password: Date,
	browser_headers: String,
	is_status_login: Boolean,
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
module.exports = mongoose.model('sys_users', schema);



//******************************************************************************************
//Please cut the code below, then paste it into the Schema containing the foreign key: sys_companies 
schema.virtual('restaurants', {
	ref: 'sys_users', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'id_company', // is equal to foreignField
});


//******************************************************************************************
//Please cut the code below, then paste it into the Schema containing the foreign key: sys_departments 
schema.virtual('restaurants', {
	ref: 'sys_users', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'id_department', // is equal to foreignField
});


//******************************************************************************************
//Please cut the code below, then paste it into the Schema containing the foreign key: sys_positions 
schema.virtual('restaurants', {
	ref: 'sys_users', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'id_position', // is equal to foreignField
});

//Set Object and Json property to true. Default is set to false
schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });
//******************************************************************************************
