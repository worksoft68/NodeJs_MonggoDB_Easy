//**************************************************************************************************************************
//     Creation time: Saturday, 04 November 2023 3:34 PM
//     Creator: 
//**************************************************************************************************************************
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
//const databaseConfig = require(__path_configs + 'database');
let schema = new mongoose.Schema({
	id: Number,
	fullname: String,
	email: String,
	phone: String,
	content_message: String,
	done_processing: Number,
});
module.exports = mongoose.model('contact', schema);


