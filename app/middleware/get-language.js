//*************************************************************************************
//This middleware is language interface for backen and fontend of the same server
//*************************************************************************************

const publicFunction = require(__path_helpers + 'publicFunction');
const systemConfigs = require(__path_configs + 'system')
exports.language = (...parameter) => {
  return async (req,res,next) => {
    let functionBranch = parameter[0].toLowerCase();
    let name_cookie_language = 'language_'+functionBranch;

  // check default language
    let chooseLanguage = 'default';
    let configs  = req.cookies['configs']; 
    if((typeof configs !== 'undefined') && configs){
      configs = JSON.parse(configs);  
      chooseLanguage  = configs.language; 
      if((typeof chooseLanguage === 'undefined') ) {
        chooseLanguage = 'default';
      }
    } 
    // end check default language

    // Delete all cookies language
    let cookiesList = req.cookies;    
    var keysCookiesList  = Object.keys(cookiesList);
    let countKey    = keysCookiesList.length;   
    for(let i=0; i < countKey; i++){   
      let cookiesName  = keysCookiesList[i];
      let index = cookiesName.indexOf("language_");
      if(index >= 0){
        res.clearCookie(cookiesName);
      }      
    }
  // End delete all cookies language
    let languageObject  = req.cookies[name_cookie_language];   
    if((typeof languageObject !== 'undefined') && languageObject) {     
      res.cookie(name_cookie_language,languageObject, { maxAge: systemConfigs.maxAge_Cookie_Language }); 
      return next();    
    }   
    
    let languageText = await publicFunction.getLanguageJson(functionBranch + ".ini", chooseLanguage);
    let languageInterface = {};
    if(languageText != 'file_not_exists'){
      languageInterface = {
        text: languageText,
        time: new Date(),
      }
      res.cookie(name_cookie_language,languageInterface, { maxAge: 900000, httpOnly: true }); 
      req[name_cookie_language] = languageInterface;      
    }   
    return next(); 
  }
}

