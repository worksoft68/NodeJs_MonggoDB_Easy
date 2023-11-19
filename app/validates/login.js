const util  = require('util');
const notify= require(__path_configs + 'notify');

// const { check, sanitizeBody } = require('express-validator'); // Kiểm tra dữ liệu, kiểu dữ liệu

const options = {
    username: { min: 3, max: 50 },
    password: { min: 3, max: 50 },    
}
module.exports = {
    validator: async (req) => {
        // username
        // req.checkBody('username', util.format(notify.ERROR_NAME, options.username.min, options.username.max) )
        //     .isLength({ min: options.username.min, max: options.username.max });
        // await body('username', util.format(notify.ERROR_NAME, options.username.min, options.username.max) )
        // .isLength({ min: options.username.min, max: options.username.max });

        // password
        // req.checkBody('password', util.format(notify.ERROR_NAME, options.password.min, options.password.max) )
        //     .isLength({ min: options.password.min, max: options.password.max })
        
        // await body('password', util.format(notify.ERROR_NAME, options.password.min, options.password.max) )
        // .isLength({ min: options.password.min, max: options.password.max })

        }
}