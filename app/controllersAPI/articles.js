const clean = require('xss-clean/lib/xss').clean;
const collection = "articles";
//const systemConfig = require(__path_configs + 'system');
const MainModel = require(__path_models + collection);
const MainValidate = require(__path_validates + collection);
const ParamsHelpers = require(__path_helpers + 'params');

module.exports = {
	getAll: async function (req, res, next) {
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		item = clean(item);
		let params = await ParamsHelpers.createPagination(item);
		await MainModel.listItems(params, {}, item).then((data) => {
			if((!data) || (data.length < 1))return res.status(200).json({success : true, data : "Empty data"})
			else{
				params.pagination["totalItems"] = data[0].TotalRecord;							
				res.status(200).json({
					success : true,
					data,
					params,
					item
				});
			}
		});		
	},
	getById: async function (req, res, next) {
		let id = ParamsHelpers.getParam(req.params, 'id', '');
		await MainModel.getById(id, {}).then((data) => {
			if(!data) return res.status(200).json({success : true, data : "Empty data"})
			else{
				res.status(200).json({
					success : true,
					data				
				});
			}
		});		
	},
};


