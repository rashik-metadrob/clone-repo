const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { productService, projectService } = require('../services');

const path = require('path');
const execFile = require('child_process').execFile;
const fs = require("fs");
const _ = require('lodash')

const im = require('imagemagick');

const { Document, NodeIO } =  require('@gltf-transform/core');
const { ALL_EXTENSIONS } = require('@gltf-transform/extensions');
const draco3d = require('draco3dgltf');
const { resample, prune, dedup, draco, textureCompress } = require('@gltf-transform/functions');

const obj2gltf = require("obj2gltf");
const config = require('../config/config');
const { UPLOADS_FOLDER, MINIMUM_IMAGE_SIZE, COLLIDER_PREFIX, FLOOR_PREFIXES, SPAWN_POINT_PREFIX } = require('../utils/constant');
const options = {
  binary: true,
};

let nodeIO = null

const uploadFolder = path.join(process.cwd(), 'public/uploads')

async function initNodeIO(){
  console.log('initNodeIO')
  nodeIO = new NodeIO()
      .registerExtensions(ALL_EXTENSIONS)
      .registerDependencies({
          'draco3d.decoder': await draco3d.createDecoderModule(), // Optional.
          'draco3d.encoder': await draco3d.createEncoderModule(), // Optional.
      });
}

initNodeIO();
/**
 * shouldResize = 1: Resize with width and height
 * shouldResize = 2: Resize to 512 but bold ratio
 */
const uploadFile = catchAsync(async (req, res) => {
  const { folder } = _.pick(req.query, ['folder'])
  if(req.file.path && req.file.path.substring(req.file.path.length - 4, req.file.path.length) === ".fbx"){
    let output = req.file.filename;
    let inputFile = req.file.path;
    let outputFile = req.file.path.replace(".fbx", ".glb")
    execFile(path.resolve(process.platform == 'win32' ? './external_app/FBX2glTF-windows-x64.exe' : './external_app/FBX2glTF-linux-x64'), ['--input', inputFile, '--output', outputFile], async function(err, data) {
      if(err) {
        console.log("err", err)
        fs.unlinkSync(req.file.path);

        res.status(httpStatus.BAD_REQUEST).send({
          message: "Can't convert to glb file.",
          status: 400
        });
      } 
      else {
        fs.unlinkSync(req.file.path);
        output = output.replace(".fbx", ".glb")  

        const isValidGlbFile = await checkGlbFileHasColliderAndFloor(folder, outputFile);
        if(!isValidGlbFile){
          fs.unlinkSync(outputFile)
          res.status(httpStatus.BAD_REQUEST).send({
            message: "The model must have the mesh with these prefix: \"floor_\" and \"collider_\" for the floor and collider corresponding.",
            status: 400
          });

          return
        }

        const cameraAndSpawnPointInfo = await checkGlbFileHasCameraAndSpawnPoint(folder, outputFile);
                 
        res.status(httpStatus.CREATED).send({
          results: getResultFilename(folder, output),
          status: 200,
          cameraAndSpawnPointInfo
        });
      }
    }); 
  } else if(req.file.path && req.file.path.substring(req.file.path.length - 4, req.file.path.length) === ".obj"){
    let output = req.file.filename;
    let inputFile = req.file.path;
    let outputFile = req.file.path.replace(".obj", ".glb")

    try{
      obj2gltf(inputFile, options).then(async function (glb) {
        fs.writeFileSync(outputFile, glb);
        fs.unlinkSync(req.file.path);
        output = output.replace(".obj", ".glb")  

        const isValidGlbFile = await checkGlbFileHasColliderAndFloor(folder, outputFile);
        if(!isValidGlbFile){
          fs.unlinkSync(outputFile)
          res.status(httpStatus.BAD_REQUEST).send({
            message: "The model must have the mesh with these prefix: \"floor_\" and \"collider_\" for the floor and collider corresponding.",
            status: 400
          });

          return
        }

        const cameraAndSpawnPointInfo = await checkGlbFileHasCameraAndSpawnPoint(folder, outputFile);
                 
        res.status(httpStatus.CREATED).send({
          results: getResultFilename(folder, output),
          status: 200,
          cameraAndSpawnPointInfo,
        });
      });
    } catch (err) {
      fs.unlinkSync(req.file.path);
      res.status(httpStatus.BAD_REQUEST).send({
        message: "Can't convert to glb file.",
        status: 400
      });
    }
  } else {
    // if(nodeIO && req.file.path && req.file.path.substring(req.file.path.length - 4, req.file.path.length) === ".glb" && config.shouldCompressGlb == 'true'){
    //   await compressGlbFile(req.file.path, req.file.path)
    // }
    const isValidGlbFile = await checkGlbFileHasColliderAndFloor(folder, req.file.path);
    if(!isValidGlbFile){
      fs.unlinkSync(req.file.path)
      res.status(httpStatus.BAD_REQUEST).send({
        message: "The model must have the mesh with these prefix: \"floor_\" and \"collider_\" for the floor and collider corresponding.",
        status: 400
      });

      return
    }
    const cameraAndSpawnPointInfo = await checkGlbFileHasCameraAndSpawnPoint(folder, req.file.path);
    // Resize to standard thumnail 231x130
    if(req.file.mimetype.includes("image/") && _.get(req.query, 'shouldResize', 0) == 1 && config.shouldCompressImage == 'true'){
      const filter = _.pick(req.query, ['width', 'height'])
      im.convert([req.file.path, '-resize', `${_.get(filter, ['width'], 231)}x${_.get(filter, ['height'], 130)}`, '-background', 'transparent', '-compose', 'Copy', '-gravity', 'center', '-extent', `${_.get(filter, ['width'], 231)}x${_.get(filter, ['height'], 130)}`,  req.file.path], function(err, stdout, stderr){
        if (err) {
          fs.unlinkSync(req.file.path)
          res.status(httpStatus.BAD_REQUEST).send({
            results: getResultFilename(folder, req.file.filename),
            status: 400,
            message: "Can't convert file.",
          });
        } else {
          res.status(httpStatus.CREATED).send({
            results: getResultFilename(folder, req.file.filename),
            status: 200
          });
        }
      });
    } 
    // Resize to 512 but hole the ratio
    else if(req.file.mimetype.includes("image/") && _.get(req.query, 'shouldResize', 0) == 2 && config.shouldCompressImage == 'true'){
      im.identify(req.file.path, (identifyErr, features) => {
        if(identifyErr){
          fs.unlinkSync(req.file.path)
          res.status(httpStatus.BAD_REQUEST).send({
            status: 400,
            message: "Can't read identify data.",
          });
        } else {
          const { width, height } = features
          let newWidth = 231
          let newHeight = 130
          if(width > MINIMUM_IMAGE_SIZE || height > MINIMUM_IMAGE_SIZE) {
            if(width > height){
              newWidth = MINIMUM_IMAGE_SIZE
              newHeight = (height / width) * MINIMUM_IMAGE_SIZE
            } else {
              newWidth = (width / height) * MINIMUM_IMAGE_SIZE
              newHeight = MINIMUM_IMAGE_SIZE
            }
            im.convert([req.file.path, '-resize', `${newWidth}x${newHeight}`,  req.file.path], function(err, stdout, stderr){
              if (err) {
                fs.unlinkSync(req.file.path)
                res.status(httpStatus.BAD_REQUEST).send({
                  results: getResultFilename(folder, req.file.filename),
                  status: 400,
                  message: "Can't convert file.",
                });
              } else {
                res.status(httpStatus.CREATED).send({
                  results: getResultFilename(folder, req.file.filename),
                  status: 200
                });
              }
            });
          } else {
            res.status(httpStatus.CREATED).send({
              results: getResultFilename(folder, req.file.filename),
              status: 200
            });
          }
        }
      })
    } else {
      res.status(httpStatus.CREATED).send({
        results: getResultFilename(folder, req.file.filename),
        status: 200,
        size: req.file.size,
        cameraAndSpawnPointInfo
      });
    }
  }
});

const checkGlbFileHasColliderAndFloor = async (folder, filePath) => {
  if(folder == UPLOADS_FOLDER.TEMPLATE && nodeIO && filePath && filePath.substring(filePath.length - 4, filePath.length) === ".glb"){
    const fileContent = await read3DFile(filePath)

    const nodes = _.get(fileContent, ['json', 'nodes'], [])
    const isHasCollider = nodes.length > 0 && _.some(nodes, (el) => el.mesh && _.get(el, ['name'], '').includes(COLLIDER_PREFIX))
    const isHasFloor = nodes.length > 0 && _.some(nodes, (el) => el.mesh && _.some(FLOOR_PREFIXES, prefix => el.name && (el.name.toLowerCase().endsWith(prefix) || el.name.toLowerCase().startsWith(prefix))))

    return isHasCollider && isHasFloor
  }

  return true
}

const checkGlbFileHasCameraAndSpawnPoint = async (folder, filePath) => {
  let isHasCamera = true
  let isHasSpawnPoint = true
  if(folder == UPLOADS_FOLDER.TEMPLATE && nodeIO && filePath && filePath.substring(filePath.length - 4, filePath.length) === ".glb"){
    const fileContent = await read3DFile(filePath)

    const cameras = _.get(fileContent, ['json', 'cameras'], [])
    isHasCamera = cameras.length > 0 && _.some(cameras, (el) => el.name && !el.name.toLowerCase().startsWith(SPAWN_POINT_PREFIX))
    isHasSpawnPoint = cameras.length > 0 && _.some(cameras, (el) => el.name && el.name.toLowerCase().startsWith(SPAWN_POINT_PREFIX))

  }

  return {
    isHasCamera,
    isHasSpawnPoint
  }
}

const resolutionAllThumnail = catchAsync(async (req, res) => {
  const filter = _.pick(req.query, ['from', 'to'])
  const from = _.get(filter, ['from'], 0)
  const to = _.get(filter, ['to'], 1)
  const folderPath = uploadFolder
  const productThumnail = await productService.getAllThumnail();
  const projectThumnail = await projectService.getAllThumnail();

  let allThumnails = [...productThumnail, ...projectThumnail].filter(el => el.thumnail && !el.thumnail.includes('http')).map(el => `${folderPath}\\${el.thumnail}`)
  allThumnails = _.uniqBy(allThumnails, obj => obj)

  allThumnails.forEach((path, index) => {
    if(index >= from && index < to){
      im.convert([path, '-resize', '231x130', '-background', 'transparent', '-compose', 'Copy', '-gravity', 'center', '-extent', '231x130',  path], function(err, stdout, stderr){
        if (err) {
          console.log('err', path)
        } else {
          console.log('success', path)
        }
      })
    }
  })

  res.send(allThumnails)
})

const getResultFilename = (folder, filename) => {
  return `${folder ? folder + '/' : ''}${filename}`
}

const uploadTextImageFileBase64 = catchAsync(async (req, res) => {
  const base64Data = req.body.base64.replace(/^data:image\/png;base64,/, "");

  const folderPath = path.join(uploadFolder, `texts`)
  const fileName = `${new Date().getTime().toString()}`
  

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  try{
    const filePath = path.join(uploadFolder, `texts/${fileName}.png`)
    fs.writeFile(filePath, base64Data, 'base64', function(err) {
      if (err) {
        console.log('err', err, base64Data)
        throw err
      };
      fs.readFile(filePath, function(err, data) {
        if (err) throw err;
        
        res.status(httpStatus.CREATED).send({
          results: `texts/${fileName}.png`,
          status: 200,
        });
      });
    });
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).send({
      results: _.get(err, "message", "Can't read file!"),
      status: 400
    });
  }
});

const read3DFile = async (inputFilePath) => {
  const document = await nodeIO.readAsJSON(inputFilePath);

  return document
}

// Always used for template file
async function compressGlbFile(inputFilePath, outPutFilePath) {
  const document = await nodeIO.read(inputFilePath);

  await document.transform(
    // Losslessly resample animation frames.
    resample(),
    // Remove unused nodes, textures, or other data.
    prune(),
    // Remove duplicate vertex or texture data, if any.
    dedup(),
    // Compress mesh geometry with Draco.
    draco(),
    // Convert textures to WebP (Requires glTF Transform v3 and Node.js).
    textureCompress({
        targetFormat: 'webp'
    })
  );

  const glb = await nodeIO.writeBinary(document);
  fs.writeFileSync(outPutFilePath, glb);
}

module.exports = {
    uploadFile,
    nodeIO,
    uploadTextImageFileBase64,
    resolutionAllThumnail
};