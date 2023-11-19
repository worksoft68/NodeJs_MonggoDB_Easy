//**************************************************************************************************************************
//     Creation time: Monday, 12 June 2023 3:48 PM
//     Creator: 
//**************************************************************************************************************************
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
//const databaseConfig = require(__path_configs + 'database');
let schema = new mongoose.Schema({
	company_id: {
			type: Schema.Types.ObjectId,
			ref: 'sys_companies',
			required: true
		},
	sys_companies: {
			id: {type: Schema.Types.ObjectId},
			name : String
		},
	department_name: String,
	abbreviation: String,
	ordering: Number,
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
module.exports = mongoose.model('sys_departments', schema);



//******************************************************************************************
//Please cut the code below, then paste it into the Schema containing the foreign key: sys_companies 
schema.virtual('restaurants', {
	ref: 'sys_departments', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'company_id', // is equal to foreignField
});

//Set Object and Json property to true. Default is set to false
schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });
//******************************************************************************************
