var express = require('express');
var router = express.Router();
const systemConfig  = require(__path_configs + 'system');
const NhanVienModel 	= require(__path_models + 'nhanviens');


/* GET home page. */
router.get('/', async function(req, res, next) {
  
   let result = await  NhanVienModel.LayDanhSachUser();

   let resultDelete = await  NhanVienModel.deleteItem(10);
   

  //let result1 = await NhanVienModel.update();


  res.send('test 123');
  
});

module.exports = router;
