//**************************************************************************************************************************
//     Creation time: Wednesday, 21 September 2022 4:40 PM
//     Creator: 
//**************************************************************************************************************************
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
//const databaseConfig = require(__path_configs + 'database');
let schema = new mongoose.Schema({
	user_id: {
			type: Schema.Types.ObjectId,
			ref: 'sys_users',
			required: true
		},
	sys_users: {
			id: {type: Schema.Types.ObjectId},
			fullName : String
		},
	functions: String,
	sys_function_for_permissions: {
			id: String,
			description : String
		},
	fullauthority: Boolean,
	addnew: Boolean,
	updates: Boolean,
	readonly: Boolean,
	full_of_yourself: Boolean,
	permission1: Boolean,
	permission2: Boolean,
	permission3: Boolean,
	permission4: Boolean,
	permission5: Boolean,
	permission6: Boolean,
	permission7: Boolean,
	permission8: Boolean,
	permission9: Boolean,
	permission10: Boolean,
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
module.exports = mongoose.model('sys_permissions', schema);



//******************************************************************************************
//Please cut the code below, then paste it into the Schema containing the foreign key: sys_users 
schema.virtual('restaurants', {
	ref: 'sys_permissions', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'user_id', // is equal to foreignField
});


//******************************************************************************************
//Please cut the code below, then paste it into the Schema containing the foreign key: sys_function_for_permissions 
schema.virtual('restaurants', {
	ref: 'sys_permissions', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'functions', // is equal to foreignField
});

//Set Object and Json property to true. Default is set to false
schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });
//******************************************************************************************
