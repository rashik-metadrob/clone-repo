const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const {uploadFile} = require('../../utils/upload')

const router = express.Router();

router.get('/resolution-all-thumnail', uploadController.resolutionAllThumnail);
router.post('/base64', uploadController.uploadTextImageFileBase64);
router.post('/', uploadFile.single('file'), uploadController.uploadFile);

module.exports = router;