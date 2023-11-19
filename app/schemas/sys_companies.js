//**************************************************************************************************************************
//     Creation time: Saturday, 10 June 2023 1:20 PM
//     Creator: 
//**************************************************************************************************************************
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
//const databaseConfig = require(__path_configs + 'database');
let schema = new mongoose.Schema({
	name: String,
	address: String,
	provincial: String,
	district: String,
	email1: String,
	email2: String,
	phone_number1: String,
	phone_number2: String,
	number_worker: Number,
	note: String,
	renewal_date: Date,
	expiration_date: Date,
	representative_name: String,
	link_facebook: String,
	registration_amount: Number,
	registered_storage: Number,
	registered_sms: Number,
	registration_amount_sms: Number,
	bank_account_number1: String,
	bank_name1: String,
	bank_account_number2: String,
	bank_name2: String,
	status: String,
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
module.exports = mongoose.model('sys_companies', schema);


