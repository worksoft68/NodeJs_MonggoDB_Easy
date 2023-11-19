//const systemConfig  = require(__path_configs + 'system');
const dbConnection = require(__path_helpers + 'utils-mssql');
const fs = require("fs");
const path = require('path');
// get user from Cookies but not password
let getUserLogin = (req, res = null) => {
	try {
		if (req.user == undefined) {
			return false;
		}
		// if (req.signedCookies.info != req.user)	// kiểm tra Id từ cookie có khác với id sesstion không?
		// 	return false;
		//res.redirect(systemConfig.prefixAdmin + '/auth/login/');	
		req.session.cookie.maxAge = 1800000;// 30 phút// gia hạn thêm thời gian hết hạn của cookie khi lấy thông tin đúng
		return req.signedCookies.info;
	}
	catch (Error) {
		if (req.user == undefined) {
			return false;
		}
		//res.redirect(systemConfig.prefixAdmin + '/auth/login/');
	}
}
//1800000 30 phút
// 600000 10 phút

let replaceAll = (str, find, replace) => {
	//return str.split(find).join(replace);
	return str.replace(new RegExp(find, 'g'), replace);
}

let replaceAllSpecialCharacters = (str) => {
	str = replaceAll(str, "\"", "");
	str = replaceAll(str, "'", "");
	return str;
}
let decodeSpecialCharacters = (str) => {
	str = replaceAll(str,"&lt;","<");
	str = replaceAll(str,"&gt;",">");
	str = replaceAll(str,"&quot;","\"");
	str = replaceAll(str,"&#39;","'");
	return str;
}


async function getDataValue(Table, Column, Where) {
	let strSQL = " SELECT " + Column + " FROM " + Table + " Where " + Where;
	let recordset = await dbConnection.selectQueryRecordset(strSQL);
	//var jsonString = JSON.stringify(recordsets);  
	return recordset;
}
async function createPathName(params, userLoginId) {
	let NewFolder = __path_templateExport + 'Download/' + userLoginId;
	if (!fs.existsSync(NewFolder)) {
		await fs.mkdirSync(NewFolder, function (err) {
			if (err) {
				return "";
			}
		});
	}
	await fs.readdir(NewFolder, async (err, files) => {
		for (const file of files) {
			await fs.unlink(path.join(NewFolder, file), err => {
			});
		}
	});



	var date = new Date();
	let FullYear = date.getFullYear().toString();
	let Month = date.getMonth().toString();
	let Day = date.getDay().toString();
	let Hours = date.getHours().toString();
	let Minutes = date.getMinutes().toString();
	let Seconds = date.getSeconds().toString();
	let result = 'Download/' + userLoginId + "/" + params + '_' + userLoginId.toString() + '_' + FullYear + '.' + Month + '.' + Day + '.' + Hours + '.' + Minutes + '.' + Seconds + '.xlsx';
	return result;
}

async function getLanguage(fileLanguage, chooseLanguage=null) {
	let folderLanguage = __path_language + "default/" + fileLanguage;
	if(chooseLanguage != null){
		folderLanguage = __path_language+chooseLanguage + '/' + fileLanguage;
	}
	try {
		if (fs.existsSync(folderLanguage)) {
			let languageBuffer = fs.readFileSync(folderLanguage);
			let language = languageBuffer.toString();			
			return language;
		}
		else{
			return 'file_not_exists';
		}
	} catch(err) {
		console.error(err);
		return 'file_not_exists';
	}
}

async function getLanguageJson(fileLanguage, chooseLanguage=null) {
	let folderLanguage = __path_language + 'default/'+ fileLanguage;
	if(chooseLanguage != null){
		folderLanguage = __path_language+chooseLanguage + '/' + fileLanguage;
	}
	
	try {
		if (fs.existsSync(folderLanguage)) {
			let languageBuffer = fs.readFileSync(folderLanguage);
			let languageString = languageBuffer.toString();
			let language = JSON.parse(languageString);
			return language;
		}
		else{
			return 'file_not_exists';
		}
	} catch(err) {
		console.error(err);
		return 'file_not_exists';
	}
}

const getLanguageRequest = async (req, name_Cookie_Language) => {
	let languageInterface = req.cookies[name_Cookie_Language];
	if((typeof languageInterface == 'undefined')) {
		languageInterface = req[name_Cookie_Language];
	} 
	return languageInterface.text;	 
}



module.exports = {
	getUserLogin,
	replaceAll,
	getDataValue,
	replaceAllSpecialCharacters,
	decodeSpecialCharacters,
	createPathName,
	getLanguage,
	getLanguageJson,
	getLanguageRequest
}