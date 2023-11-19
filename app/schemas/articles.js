//**************************************************************************************************************************
//     Creation time: Saturday, 01 October 2022 6:07 PM
//     Creator: 
//**************************************************************************************************************************
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
//const databaseConfig = require(__path_configs + 'database');
let schema = new mongoose.Schema({
	categorie_id: {
			type: Schema.Types.ObjectId,
			ref: 'categories',
			required: true
		},
	categories: {
			id: {type: Schema.Types.ObjectId},
			name : String
		},
	company_id: String,
	title: String,
	slug: String,
	thumb: String,
	summary: String,
	content_articles: String,
	ordering: Number,
	is_special: Boolean,
	status: String,
	approved: String,
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

	count_view: Number,
	count_like: Number,
	count_dislike: Number,
});
module.exports = mongoose.model('articles', schema);



//******************************************************************************************
//Please cut the code below, then paste it into the Schema containing the foreign key: categories 
schema.virtual('restaurants', {
	ref: 'articles', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'categorie_id', // is equal to foreignField
});

//Set Object and Json property to true. Default is set to false
schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });
//******************************************************************************************
