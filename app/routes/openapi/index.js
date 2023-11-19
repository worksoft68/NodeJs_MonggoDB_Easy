var express = require('express');
var router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../lib/swagger.json');
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));


router.use('/categories', require('./categories'));
//router.use('/articles', require('./articles'));


module.exports = router;

      
      

