const ArticlesModel 	= require(__path_models + 'articles');

module.exports = async(req, res, next) => {
    
    await ArticlesModel
        .listItemsFrontendItemRandom()
        .then( (items) => { res.locals.itemsRandoms = items; });
    next();
}