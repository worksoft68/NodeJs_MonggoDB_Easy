//**************************************************************************************************************************
//     Creation time: Friday, 30 September 2022 8:26 PM
//     Creator: 
//**************************************************************************************************************************
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
//const databaseConfig = require(__path_configs + 'database');
let schema = new mongoose.Schema({
	parent_id: {type: Schema.Types.ObjectId	},
	categoryParent: {
		id: String,
		parentName: String		
	},
	companies_id: String,
	name: String,
	slug: String,
	thumbnail: String,
	viewtype: String,
	link: String,
	zone: String,
	is_show_homepage: Boolean,
	ordering: Number,
	description: String,
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
module.exports = mongoose.model('categories', schema);


