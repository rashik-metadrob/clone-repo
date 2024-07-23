const config = require('../config/config');
const path = require("path");
const fs = require('fs');
const axios = require("axios")
const FormData = require("form-data");
const moment = require('moment')

const outputBaseFolder = path.join(process.cwd(), 'public/uploads')
function createCompressRequest (filePathName, dataType) {
    console.log('createCompressRequest')
    const filePath = path.join(outputBaseFolder, filePathName)
    const readStream = fs.createReadStream(filePath);

    const form = new FormData();
    form.append("file", readStream);
    form.append("webhookUrl", `${config.serverUrl}/v1/compress-webhooks/compress-file`)
    form.append("webhookErrorUrl", `${config.serverUrl}/v1/compress-webhooks/compress-file-error`)
    form.append("filePath", filePathName)
    form.append("dataType", dataType)

    axios({
        method: 'POST',
        url: "http://103.170.122.69:3000/gltf",
        data: form,
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "stream",
    })
    .then(async (rs) => {
    })
    .catch((err) => {
        console.log(`ERR WHEN createCompressRequest ${moment().toISOString()}`, err.message)
    });
}

module.exports = {
    createCompressRequest
}