const { calendarFormat } = require("moment");
var jwt 			      = require('jsonwebtoken');
const UsersModel = require(__path_models + 'sys_users');
var ErrorResponse = require(__path_helpers + 'ErrorResponse')
const StringHelpers = require(__path_helpers + 'string');
const systemConfig = require(__path_configs + 'system');
const linkLogin = StringHelpers.formatLink('/' + systemConfig.prefixAdmin + '/auth/login/');
module.exports = async (req, res, next) => {  
    let userInfo = {};
    let userInfoNew;
    let token = '';
    try {
		if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){     
			 token = req.headers.authorization.split(' ')[1]    
		  
		}else if(req.signedCookies.info){		 
		  let info  = req.signedCookies.info;         
		  token = info.tokenLogin; 
		}
        if ((req.user == undefined)&&(!token)) {
            return next(res.redirect(linkLogin));
            res.redirect(linkLogin);			
        }
		try {
		  // decode token      
		  const decoded = jwt.verify(token,systemConfig.JWT_SECRET); 
		  userInfo = await UsersModel.getByIdCheckLogin(decoded.id);
          if(userInfo) {           
            req.user = userInfo; 
            res.locals.userInfo = userInfo; 
          }     
		  next();
			} catch (err) { 			
				console.log(err);				
				res.redirect(linkLogin); 
			}
		}
		catch (Error) {
			console.log(Error);
		//res.status(202).send({ success: false, data: 'Please login your account' });
            res.redirect(linkLogin);
		}


    // if (req.isAuthenticated()) {
    //     userInfo = req.signedCookies.info; // lấy cookie có tên là  info  

    //     if (userInfo.UsersId != undefined) {
    //         await UsersModel.getByIdCheckLogin(userInfo.UsersId).then((result) => {
    //             userInfoNew = result;
    //         });
    //     }
    //     else {
    //         res.redirect(linkLogin);
    //     }
    // }
    // else {
    //     //return next(new ErrorResponse(401,'Vui lòng đăng nhập tài khoản'));
    //     res.redirect(linkLogin);
    // }
    // res.locals.userInfo = userInfoNew;
    // next();
}