const util = require("util");
const path = require("path");
const multer = require("multer")
const _ = require("lodash")
const fs = require("fs");
const config = require("../config/config");

const uploadFilePath = path.join(process.cwd(), `public/uploads`);
// const uploadFilePath = config.uploadDirectory;

const storageFile = multer.diskStorage({
  destination: function (req, file, cb) {
    const { folder } = _.pick(req.query, ['folder'])
    if(folder){
      const folderPath = `${uploadFilePath}//${folder}`
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      cb(null, folderPath)
    } else {
      cb(null, uploadFilePath)
    }
  },
  filename(req, file, fn) {
    fn(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
  },
});

const storageFileAfterCompress = multer.diskStorage({
  destination: function (req, file, cb) {
    const { folder } = _.pick(req.query, ['folder'])
    if(folder){
      const folderPath = `${uploadFilePath}//${folder}`
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      cb(null, folderPath)
    } else {
      cb(null, uploadFilePath)
    }
  },
  filename(req, file, fn) {
    const { fileName } = _.pick(req.query, ['fileName'])
    if(fileName) {
      fn(null, fileName);
    } else {
      fn(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
    }
    
  },
});

const uploadFile = multer({
  storage: storageFile,
  // limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadFileAfterCompress = multer({
  storage: storageFileAfterCompress,
  // limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = {
  uploadFile,
  uploadFileAfterCompress
}