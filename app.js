var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const passport = require('passport'); //  thư viện kiểm tra đăng nhập
//const helmet = require('helmet'); //Bảo mật, lọc các HTTP header độc hại (nhằm khai thác lỗ hổng XSS hay clickjacking
//var logger = require('morgan');// Mở ra khi muốn xem console.log() các tập tin css, js...

//const validator = require('express-validator'); // Kiểm tra dữ liệu, kiểu dữ liệu
const session = require('express-session'); //express-flash-notification
//const flash = require('express-flash-notification'); //express-flash-notification
var flash = require('connect-flash'); // hiện thông báo, thay thế cho  express-flash-notification

const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
//var restify = require('restify')// chua biết lý co, có phải dùng chung với xss-clean
const xss = require('xss-clean'); // restify
const rateLimit = require("express-rate-limit"); // chạy

var moment = require('moment'); // Thư viện xử lý ngày tháng - thời gian
var socket_io = require("socket.io");
const pathConfig = require('./path');

// Define Path
global.__base = __dirname + '/';
global.__path_app = __base + pathConfig.folder_app + '/';
global.__path_configs = __path_app + pathConfig.folder_configs + '/';
global.__path_helpers = __path_app + pathConfig.folder_helpers + '/';

global.__path_routers = __path_app + pathConfig.folder_routers + '/';
global.__path_routers_openapi = __path_routers + pathConfig.folder_module_openapi + '/';
global.__path_routers_blog = __path_routers + pathConfig.folder_module_blog + '/';
global.__path_routers_admin = __path_routers + pathConfig.folder_module_admin + '/';
global.__path_routers_apiadmin = __path_routers + pathConfig.folder_module_apiadmin + '/';
global.__path_routers_chat = __path_routers + pathConfig.folder_module_chat + '/';

global.__path_schemas = __path_app + pathConfig.folder_schemas + '/';
global.__path_controllers = __path_app + pathConfig.folder_controllers + '/';
global.__path_controllersAPI = __path_app + pathConfig.folder_controllersAPI + '/';
global.__path_models = __path_app + pathConfig.folder_models + '/';
global.__path_validates = __path_app + pathConfig.folder_validates + '/';
global.__path_middleware = __path_app + pathConfig.folder_middleware + '/';

global.__path_views = __path_app + pathConfig.folder_views + '/';
global.__path_language = __path_app + pathConfig.folder_language + '/';
global.__path_views_admin = __path_views + pathConfig.folder_module_admin + '/';
global.__path_views_blog = __path_views + pathConfig.folder_module_blog + '/';
global.__path_views_chat = __path_views + pathConfig.folder_module_chat + '/';

global.__path_public = __base + pathConfig.folder_public + '/';
global.__path_uploads = __path_public + pathConfig.folder_uploads + '/';

global.__path_views_backend = __path_app + pathConfig.folder_views_backend + '/';
global.__path_templateExport = __base + pathConfig.folder_templateExport + '/';

global.__path_ca = __path_app + pathConfig.folder_ca + '/';

const systemConfig = require(__path_configs + 'system');
const databaseConfig = require(__path_configs + 'database');

// ------- connect to mongoDB on cloud -------
//mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.server}/${databaseConfig.database}?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.server}/${databaseConfig.database}?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true });


// ------- connect to mongoDB on local -------
// try {
//   mongoose.connect('mongodb://localhost:27017/futureOffice');
// } catch (error) {
//   handleError(error);
// }


//mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@cluster0.example.mongodb.net/?retryWrites=true&w=majority


// mongoose.connect('mongodb://127.0.0.1/futureOffice')
//     .catch (error => console.log(error));

// when running can actually remove this message
const db = mongoose.connection;
db.on('error', () => {console.log('Connection MongoDB error:')});
db.once('open', function() {
  console.log('we are connected MongoDB!')  
}); // when running can actually remove this message

//express-flash-notification
var app = express();
app.use(xss());
app.disable('x-powered-by');//  Hacker có thể sử dụng header này để xác định ứng dụng của bạn sử dụng Express.js
// Giới hạn requests
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 4000 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Socket.io
var io = socket_io();
app.io = io;

app.use(cookieParser('anonystick'));// security string
app.use(session({
  secret: 'abcnhds', // security string
  resave: false,
  saveUninitialized: false,
  // cookie: {
  //   maxAge: 1800000  // 30 phút
  // }
  //500000  // 10 phút
}
));

require(__path_configs + 'passport')(passport); // Kéo vào để sử dụng kiểm tra đăng nhập,  truyền vào biến const passport đã khai báo ở trên
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req, res, next) {
  let url 			= new URL(req.protocol + "://" + req.get('host'));
  systemConfig.prefixUrl = url;
  
  res.locals.messages = req.flash();
  next();
});
// app.use(validator({
//   customValidators: {
//     isNotEqual: (value1, value2) => {
//       return value1 !== value2;
//     }
//   }
// }));
//app.use(helmet());









//dùng thư viên  express-flash-notification
//app.use(flash(app, {  // đã bỏ
//  viewName: __path_views_backend + 'elements/notify',
// }));

//// Kiểm tra dữ liệu, kiểu dữ liệu
// điện nghĩa  thêm hàm kiển tra không phải isNotEqual


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //template engine ejs
app.use(expressLayouts);
app.set('layout', __path_views_backend + 'backend'); // đường dẫn file layout



// app.use(logger('dev'));
app.use(express.json({ limit: '200kb' })); //Giới  hạn dữ liệu từ clinet gửi lên server ///defaults to a body size limit of 100kb//
//app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Local variable
app.locals.systemConfig = systemConfig;
app.locals.moment = moment;

// Setup router 
// router 1: OpenApi
//  console.log(systemConfig.prefixOpenApi);
//  console.log(__path_routers_openapi);
app.use(`/${systemConfig.prefixOpenApi}`, require(__path_routers_openapi + 'index'));
// router 2: Blog
app.use(`/${systemConfig.prefixBlog}`, require(__path_routers_blog + 'index'));
// router 3: ApiAdmin
app.use(`/${systemConfig.prefixApiAdmin}`, require(__path_routers_apiadmin + 'index')); // Phải để dòng này ở trên
// router 4: Admin
app.use(`/${systemConfig.prefixAdmin}`, require(__path_routers_admin + 'index'));

// router 5: Chat
// app.use(`/${systemConfig.prefixChat}`, require(__path_routers_chat + 'index')(io));




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(async (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if (systemConfig.env == "dev") {
    res.status(err.status || 500);
    res.render(__path_views + 'pages/error', { pageTitle: 'Page Not Found ' });
    //res.render(__path_views_admin +  'pages/error', { pageTitle   : 'Page Not Found ' });
  }

  // render the error page
  if (systemConfig.env == "production") {
    // const CategoriesModel = require(__path_models + 'categories');
    let itemsCategories = [];
    // await CategoriesModel.listItemsFrontend(null, {task:'items-in-menu'}).then( (items) =>{itemsCategories = items;});
    res.status(err.status || 500);
    res.render(__path_views_blog + 'pages/error', {
      top_post: false,
      itemsCategories,
      layout: __path_views_blog + 'frontend'
    });
  }

});


// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render(__path_views +  'pages/error', { pageTitle   : 'Page Not Found ' });
// });

module.exports = app;

