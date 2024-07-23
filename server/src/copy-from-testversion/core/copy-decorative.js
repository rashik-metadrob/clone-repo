const mongoose = require('mongoose');
const config = require("../../config/config")
const _ = require('lodash')

const { exec } = require("child_process");

const dataToCopy = require('../data-to-copy/metadrob-test.products.json')

const productService = require('../../services/product.service')

const metadrobUploadFolder = "/home/ubuntu/metadrob-backend/public/uploads"
const drobverseUploadFolder = "/home/ubuntu/metadrob-backend-test/public/uploads"

// mongoimport --uri="mongodb://admin:admin@metadrob.com:17017/Metadrob?authSource=Metadrob&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false" --db=Metadrob --collection=products --mode=upsert --type=json --jsonArray --file="C:\PROJECT\Metadrob shopify\metadrob\server\src\copy-from-testversion\data-to-copy\metadrob-test.products.json"

mongoose.connect(config.mongoose.url, config.mongoose.options).then(async () => {
    console.log('Connected to MongoDB at ' + config.mongoose.url);
    
    for(let i = 0; i < dataToCopy.length; i++){
        console.log("START COPY DATA", i)
        const image = _.get(dataToCopy, [i, 'image'], '')
        const objectUrl = _.get(dataToCopy, [i, 'objectUrl'], '')

        const cmdImageCode = `cp ${drobverseUploadFolder}/${image} ${metadrobUploadFolder}/${image}`
        const cmdObjectCode = `cp ${drobverseUploadFolder}/${objectUrl} ${metadrobUploadFolder}/${objectUrl}`

        exec(cmdImageCode, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: DATA ${i} ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: DATA ${i} ${stderr}`);
                return;
            }
            console.log(`stdout: DATA ${i} ${stdout}`);
        });

        exec(cmdObjectCode, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: DATA ${i} ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: DATA ${i} ${stderr}`);
                return;
            }
            console.log(`stdout: DATA ${i} ${stdout}`);
        });

        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 500)
        })

        console.log("END COPY DATA", i)
    }
});