//**************************************************************************************************************************
//     Creation time: Monday, 12 June 2023 7:02 PM
//     Creator: 
//**************************************************************************************************************************
const util = require('util');

const options = {
	categorie_id: { min: 1, max: 50 },
	title: { min: 1, max: 255 },
	slug: { min: 1, max: 255 },
	summary: { min: 1, max: 1000 },
	content_articles: { min: 1, max: 65535 },
}

let validateSave = (obj, language) => {	
	let message = {};
	if((obj.categorie_id.length < options.categorie_id.min) || (obj.categorie_id.length > options.categorie_id.max)){
		message['categorie_id'] = util.format(language['Message_Invalid_categorie_id'], options.categorie_id.min, options.categorie_id.max);
	}
	if((obj.title.length < options.title.min) || (obj.title.length > options.title.max)){
		message['title'] = util.format(language['Message_Invalid_title'], options.title.min, options.title.max);
	}
	if((obj.slug.length < options.slug.min) || (obj.slug.length > options.slug.max)){
		message['slug'] = util.format(language['Message_Invalid_slug'], options.slug.min, options.slug.max);
	}
	if((obj.summary.length < options.summary.min) || (obj.summary.length > options.summary.max)){
		message['summary'] = util.format(language['Message_Invalid_summary'], options.summary.min, options.summary.max);
	}
	if((obj.content_articles.length < options.content_articles.min) || (obj.content_articles.length > options.content_articles.max)){
		message['content_articles'] = util.format(language['Message_Invalid_content_articles'], options.content_articles.min, options.content_articles.max);
	}
	if(Object.keys(message).length==0)
		return false;
	return message;	
}

let validate = {
	validateSave,
	options,
};
module.exports = {validate};
