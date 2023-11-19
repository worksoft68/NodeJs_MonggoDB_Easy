//***********************************************************
// Kéo tập tìn này vào sử dụng ở tập tin app 
// kiểm tra quyền admin trong middleware
// giao diện này chỉ kiểm tra xem đăng nhập thành công không?
//***********************************************************

const Sys_UserModel = require(__path_models + 'sys_users');
const notify  		= require(__path_configs + 'notify');
var LocalStrategy   = require('passport-local').Strategy;
module.exports      = function(passport){
    passport.use(new LocalStrategy(
       async function(username, password, done) { // kiểm tra đăng nhập  
        Sys_UserModel.getUserByUserNameEncrypted (username).then(async ( user) => {               
                if (user === undefined || user.length == 0) {
                    return done(null, false, { message: notify.ERROR_LOGIN });
                }else { 
                    if(password !== user.password) { // kiểm tra mật khẩu
                        return done(null, false, { message: notify.ERROR_LOGIN }); // sai
                    }else {
                        return done(null, user); // trả về user
                    }
                }
            });
        }
    ));


    passport.serializeUser(function(user, done) {
        done(null, user); // Lưu vào bộ nhớ session  để hàm deserializeUser gọi  
    });
    
    // lưu vào session để các nơi khác gọi user. nhưng chỉ có id thôi để tiết kiệm bộ nhớ RAM server
     //Khi request được tính là đã xác thực nó sẽ gọi hàm passport.deserializeUser. Hàm này sử dụng thông tin trong session để lấy dữ liệu đầy đủ về thằng user rồi gắn nó vào req.user.
    passport.deserializeUser(function(user, done) {
        done(null, user) // ghi id user vao session, không ghi toàn bộ usser để tiết kiememj bộ nhớ RAM server
        // UsersModel.getItem(id, null).then( (user) => {
        //     done(null, user);// ghi user vao session
        // });
    });



   
}



  // Lưu vào bộ nhớ session
   // Với mỗi request , express sẽ load các sữ liệu trong session ra và gắn nó và đối tượng request (req.session). Ở trên ta đã sử dụng hàm serializeUser để đưa dữ liệu vào session nên ta có thể tìm thấy dữ liệu đó tạo req.session.passport.user.
//    passport.serializeUser(function(user, done) {
//     user.password = '';   
//     done(null, user);   // Lưu user vào   session, nhưng không lưu passwword
// });

// Đọc ra từ session
//Khi request được tính là đã xác thực nó sẽ gọi hàm passport.deserializeUser. Hàm này sử dụng thông tin trong session để lấy dữ liệu đầy đủ về thằng user rồi gắn nó vào req.user.

// passport.deserializeUser(function(user, done) {
//     UsersModel.getItem(user._id, null).then( (user) => {
//         user.password = '';
//         done(null, user);
//     });
// });



    
//     // Lưu vào bộ nhớ session
//    // Với mỗi request , express sẽ load các sữ liệu trong session ra và gắn nó và đối tượng request (req.session). Ở trên ta đã sử dụng hàm serializeUser để đưa dữ liệu vào session nên ta có thể tìm thấy dữ liệu đó tạo req.session.passport.user.
//     passport.serializeUser(function(user, done) {
//         done(null, user._id);     
//     });
    
//     // Đọc ra từ session
//     //Khi request được tính là đã xác thực nó sẽ gọi hàm passport.deserializeUser. Hàm này sử dụng thông tin trong session để lấy dữ liệu đầy đủ về thằng user rồi gắn nó vào req.user.

//     passport.deserializeUser(function(id, done) {
//         UsersModel.getItem(id, null).then( (user) => {
//             done(null, user);
//         });
//     });
