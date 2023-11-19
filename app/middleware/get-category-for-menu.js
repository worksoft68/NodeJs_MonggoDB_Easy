const CategoriesModel 	= require(__path_models + 'categories');

module.exports = async(req, res, next) => {    
    await CategoriesModel
            .listItemsFrontend()
            .then( (items) => { res.locals.itemsCategories = items; });
    next();
}