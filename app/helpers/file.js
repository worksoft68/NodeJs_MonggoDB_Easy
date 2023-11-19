var multer = require('multer');
var randomstring = require("randomstring");
const path = require('path');
const fs = require('fs');

const notify = require(__path_configs + 'notify');
const StringHelpers = require(__path_helpers + 'string');
let uploadFile =  (field, folderDes = 'images', fileNameLength = 10, fileSizeMb = 10, fileExtension = 'jpeg|jpg|png|gif') => {
	
	let fullPath = __path_uploads + folderDes + '/';
	 fs.existsSync(fullPath) || fs.mkdirSync(fullPath);
	const storage = multer.diskStorage({
	
		destination: (req, file, cb) => {
			cb(null, fullPath)
		},
		filename: (req, file, cb) => {
		
			let date = new Date().toISOString().slice(0, 10);
			date = date.replace('-', '');
			date = date.replace('-', '').substr(2);	//YYMMDD		
			let extname = path.extname(file.originalname);
			let fileName = path.basename(file.originalname); // file.originalname is Full name
			fileName = StringHelpers.createAlias(fileName.replace(extname, ''));
			fileName += '-' + date + '-' + randomstring.generate(fileNameLength) + extname;
			cb(null, fileName);
		}
	});

	const upload = multer({
		storage: storage,
		limits: {
			fileSize: fileSizeMb * 1024 * 1024,
		},
		fileFilter: (req, file, cb) => {

			const filetypes = new RegExp(fileExtension);
			const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
			const mimetype = filetypes.test(file.mimetype);

			if (mimetype && extname) {
				return cb(null, true);
			} else {
				cb(notify.ERROR_FILE_EXTENSION);
			}
		}
	}).single(field);

	return upload;
}

let removeFile = async (folder, fileName) => {
	if (fileName != "" && fileName != undefined) {
		let path = folder + fileName;
		if (fs.existsSync(path)) fs.unlink(path, (err) => { if (err) return false; });
	}
	return true;
}


module.exports = {
	upload: uploadFile,
	remove: removeFile
}