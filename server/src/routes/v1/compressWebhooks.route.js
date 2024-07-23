const express = require('express');
const compressWebhooksController = require('../../controllers/compressWebhooks.controller');
const { uploadFileAfterCompress } = require('../../utils/upload');

const router = express.Router();

router.post('/compress-file', uploadFileAfterCompress.single('file'), compressWebhooksController.onCompressedFile);
router.post('/compress-file-error', compressWebhooksController.onCompressedFileError);

module.exports = router;