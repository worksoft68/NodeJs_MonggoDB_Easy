var express = require('express');
var router = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../lib/swagger.json');
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

// add middleAuthentication vào giữa router để kiểm tra đăng nhập

//const middleGetUserInfo         = require(__path_middleware + 'get-user-info');

//router.use('/', middleGetUserInfo, require('./home'));

module.exports = router;

      
      

