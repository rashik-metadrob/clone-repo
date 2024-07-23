const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { COMPRESS_DATA_TYPE } = require("../utils/constant")
const { compressService } = require("../services")

const onCompressedFile = catchAsync(async (req, res) => {
    const { status, filePath, dataType} = req.body
    if(dataType == COMPRESS_DATA_TYPE.PROJECT) {
        await compressService.updateTemplateStatusAfterCompress(filePath)
    } else if(dataType == COMPRESS_DATA_TYPE.PRODUCT) {
        await compressService.updateProdAndDecorStatusAfterCompress(filePath)
    }

    res.send();
});

const onCompressedFileError = catchAsync(async (req, res) => {
    const { status, filePath, dataType} = req.body
    

    res.send();
});


module.exports = {
    onCompressedFile,
    onCompressedFileError
};