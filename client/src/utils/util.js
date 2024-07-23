/* eslint-disable no-loop-func */
import { AudioLoader, Box3, Color, LoadingManager, MathUtils, Matrix3, MeshLambertMaterial, NoColorSpace, PMREMGenerator, TextureLoader, Vector2, Vector3 } from "three";
import { EDITOR_MATERIAL_KEYS, MATERIAL_VALUE_TYPES, MODAL_STORE_EDITOR_WIDTH, PAYMENT_STATUS, PRODUCT_TYPES, SHIPMENT_STATUS, TEXTURE, USER_ROLE } from "./constants";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { MeshoptDecoder } from'three/addons/libs/meshopt_decoder.module.js'
import { getStorageUserDetail } from "./storage";
import orderApi from "../api/order.api";
import easyShipApi from "../api/easyShip.api";
import _, { reject } from "lodash";
import global from "../redux/global";
import routesConstant from "../routes/routesConstant";
import fonts from "../components/canvasContainer/components/descriptionBoard/fonts";
import { GLTFLoader } from "../libs/GLTFLoader";

export const mergeScale = (scale, uniform = 0) => {

    return [(scale?.x || 1) + uniform, (scale?.y || 1) + uniform, (scale?.z || 1) + uniform]
}

export const isRightClick = (e) => {
    let isRightMB = false

    if(_.has(e, ['which'])){
        isRightMB = e.which == 3
    } else if(_.has(e, ['button'])) {
        isRightMB = e.button == 2
    }

    return isRightMB
}

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });

export function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export function apllyMaterials(materials, savedMaterials) {
    if(savedMaterials && Object.keys(savedMaterials).length > 0){
        let matsKeys = Object.keys(materials);
        let savedMatsKeys = Object.keys(savedMaterials);

        matsKeys.filter(el => savedMatsKeys.find(o => o === el)).forEach(el => {
            let atrMatKeys = Object.keys(materials[el]);
            let atrSavedMatKeys = Object.keys(savedMaterials[el]);

            atrMatKeys.filter(o => atrSavedMatKeys.find( m => m === o)).forEach(o => {
                let atrInfo = savedMaterials[el][o]

                if(atrInfo){
                    if(atrInfo.type === MATERIAL_VALUE_TYPES.COLOR){
                        materials[el][o] = new Color().setHex(savedMaterials[el][o].value, NoColorSpace);
                    } else if(atrInfo.type === MATERIAL_VALUE_TYPES.TEXTURE){
                        apllyTexture(materials[el], savedMaterials[el][o].value)
                    } else {
                        materials[el][o] = savedMaterials[el][o].value;
                    }
                }
            })
        })
    }
}

export function apllyTexture(material, textureName) {
    if(typeof textureName !== 'string'){
        return
    }

    let attr = 'emissiveMap'
    if(material?.type === "MeshPhysicalMaterial"){
        attr = 'map'
    }
    
    if(!textureName || textureName === TEXTURE.AVAILABLE){
        if(material[attr]?.availableTexture){
            material[attr] = material[attr].availableTexture
            material.needsUpdate = true
        }
        return
    }

    const availableTextureName = _.get(material[attr], ['userData', 'textureName'], '')

    new TextureLoader().load(
        getAssetsUrl(textureName), 
        texture => {
            texture.userData = {...texture.userData, textureName: textureName}
            if(!availableTextureName){
                texture.availableTexture = material[attr]
            }
            if(material[attr]?.availableTexture){
                texture.availableTexture = material[attr].availableTexture
            }
            material[attr] = texture
            material.needsUpdate = true
        },
        () => {},
        err => {
            console.log('Error when load texture.')
        }
    );
   
}

export const buildGraph = (object) => {
    const data = { nodes: {}, materials: {} }
    if (object) {
      object.traverse((obj) => {
        if (obj.name) data.nodes[obj.name] = obj
        if (obj.material && !data.materials[obj.material.name]) data.materials[obj.material.name] = obj.material
      })
    }
    return data
}

export const isGLBFile = (name) => {
    return name && name.length > 4 && (name.substring(name.length - 4, name.length) === ".glb" || name.substring(name.length - 5, name.length) === ".gltf")
}

export const loadAudio = (url, onLoad = () => {}) => {
    const loader = new AudioLoader();

    loader.load(
        // resource URL
        url,
    
        // onLoad callback
        function ( audioBuffer ) {
            onLoad(audioBuffer)
        },

        // onProgress callback
        function ( xhr ) {
        },

        // onError callback
        function ( err ) {
            console.log( 'loadAudio error happened', err );
        }
    );
}


export const loadTexture = (url) => {
    const textureLoader = new TextureLoader();
    return new Promise((resolve, reject) => {
        textureLoader.load(
            // resource URL
            url,
        
            // onLoad callback
            function ( texture ) {
                resolve(texture)
            },

            // onProgress callback
            function ( xhr ) {
            },

            // onError callback
            function ( err ) {
                console.log( 'loadTexture error happened', err );
                reject(err)
            }
        );
    })
}

export const loadFont = (url) => {
    return new Promise((resolve, reject) => {
        const loader = new TTFLoader();

        loader.load(
            // resource URL
            getFontUrl(url),
        
            // onLoad callback
            function ( json ) {
                resolve(json)
            },

            // onProgress callback
            function ( xhr ) {
            },

            // onError callback
            function ( err ) {
                console.log( 'loadFont error happened', err );
                reject(err)
            }
        );
    })
}

export const loadMultiGlbModels = (urls, renderer) => {
    const promises = []
    for(let i = 0; i < _.get(urls, ['length'], 0); i++){
        promises.push(loadModel(urls[i], () => {}, renderer))
    }

    return Promise.all(promises)
}

export const loadHdriEnvironment = (url, renderer, onLoading = () => {}) => {
    let generator = new PMREMGenerator(renderer);
    return new Promise((resolve, reject) => {
        new RGBELoader().load(
            url, 
            (hdrmap) => {
                let envmap = generator.fromEquirectangular(hdrmap);
                
                resolve(envmap)
            },
            (e) => {
                if (e.lengthComputable) {
                    onLoading(e.loaded / e.total * 100)
                } else {
                    onLoading(100)
                }
            },
            (err) => { 
                console.log('err load hdr', err)
                reject(err)
            }
        )
    });
}

export const checkBox3HasInfinityValue = (box) => {
    return (
        box.max.x === Infinity || box.max.x === -Infinity
        || box.max.y === Infinity || box.max.y === -Infinity
        || box.max.z === Infinity || box.max.z === -Infinity
        || box.min.x === Infinity || box.min.x === -Infinity
        || box.min.y === Infinity || box.min.y === -Infinity
        || box.min.z === Infinity || box.min.z === -Infinity
    )
}

export const loadModel = (
    url, 
    onLoading = () => {}, 
    renderer,
    shouldOverrideMaterialByMeshLambertMaterial = false
) => {
    return new Promise((resolve, reject) => {
      const manager = new LoadingManager()
      manager.onProgress = (url, loaded, total) => {
        onLoading(loaded / total * 100)
      }
      if(isGLBFile(url)){
        const drcLoader = new DRACOLoader();
        drcLoader.setDecoderPath( `${process.env.REACT_APP_HOMEPAGE}/draco/` );
        drcLoader.setDecoderConfig({type: "js"})

        const loader = new GLTFLoader()
        const KTX2_LOADER = new KTX2Loader().setTranscoderPath( `${process.env.REACT_APP_HOMEPAGE}/basis/` );
        loader.setDRACOLoader(drcLoader).setKTX2Loader( KTX2_LOADER.detectSupport( renderer ) )
        loader.setMeshoptDecoder(MeshoptDecoder)
        loader.load(
            url,
            gltf => {
                if(shouldOverrideMaterialByMeshLambertMaterial) {
                    changeMaterialToMeshLambertMaterial(gltf.scene)
                }
                gltf = Object.assign(gltf, buildGraph(gltf.scene))
                resolve(gltf)
            },
            e => {
                if (e.lengthComputable) {
                    onLoading(e.loaded / e.total * 100)
                } else {
                    onLoading(100)
                }
            },
            err => {
                reject(err)
            },
        )
      } else {
        const loader = new FBXLoader(manager)
        loader.load(
            url,
            gltf => {
                let object = {
                    scene: gltf,
                    cameras: []
                }
                object = Object.assign(object, buildGraph(object.scene))
                resolve(object)
            },
            e => {
            },
            err => {
                reject(err)
            },
        )
      }
    })
}

export const changeMaterialToMeshLambertMaterial = (group) => {
    group.traverse(el => {
        if(el.isMesh) {
          var prevMaterial = el.material;
          el.material = new MeshLambertMaterial({});
          el.material.copy(prevMaterial)
          el.receiveShadow = false
          el.castShadow = false
        }
    })
}

export const getSnapPoint = (point, listSnapPoints) => {
    if(listSnapPoints.length > 0){
        let minDistance = point.distanceTo(listSnapPoints[0].point)
        let closestPoint = point.clone();

        for(let i = 1; i < listSnapPoints.length; i++){
            if(point.distanceTo(listSnapPoints[i].point) < minDistance){
                minDistance = point.distanceTo(listSnapPoints[i].point);
                closestPoint = listSnapPoints[i].point.clone();
            }
        } 

        return minDistance < 0.5 ? closestPoint : point
    }

    return point
}

export const getSnapPointInSphere = (point, listSnapPoints) => {
    let points = []
    let box = new Box3().setFromCenterAndSize(point, new Vector3(2, 2, 2))
    if(listSnapPoints.length > 0){
        for(let i = 1; i < listSnapPoints.length; i++){
            if(box.containsPoint(listSnapPoints[i].point)){
                points.push(listSnapPoints[i].point.clone())
            }
        }
    }
    return points
}

export const getDefaultHomePage = (user = null, isFromMainPage = false) => {
    if(user === null){
        user = getStorageUserDetail();
    }
    if(global.IS_SHOPIFY){
        return routesConstant.firstLogin.path
    }
    if(user?.role === USER_ROLE.CUSTOMER){
        return "/customer"
    } else if(user?.role === USER_ROLE.ADMIN && !isFromMainPage){
        return "/admin"
    } else {
        return "/dashboard/store"
    }
}

export const encodeUrl = (url) => {
    return btoa(url);
}

export const decodeUrl = (url) => {
    return atob(url);
}

export const createShipment = (order, newStatus) => {
    if(order){
        orderApi.updateOrder(order.id, { paymentStatus: newStatus }).then(rs => {
            if(rs.shipmentStatus === SHIPMENT_STATUS.NOT_SHIPMENT){
                // Create shipment here
                if(newStatus === PAYMENT_STATUS.SUCCEEDED){
                    easyShipApi.createShipment({
                        "incoterms": rs.rateSetting.incoterms,
                        "insurance": rs.rateSetting.insurance,
                        "courier_selection": {
                            "allow_courier_fallback": false,
                            "apply_shipping_rules": true,
                            "selected_courier_id": rs.delivery.courier_id
                        },
                        "shipping_settings": {
                            "additional_services": {
                                "qr_code": "none"
                            },
                            "units": {
                                "weight": "kg",
                                "dimensions": "cm"
                            },
                            "buy_label": false,
                            "buy_label_synchronous": false,
                            "printing_options": {
                                "format": "png",
                                "label": "4x6",
                                "commercial_invoice": "A4",
                                "packing_slip": "4x6"
                            }
                        },
                        "origin_address": rs.rateSetting.origin_address,
                        "destination_address": rs.rateSetting.destination_address,
                        "parcels": rs.rateSetting.parcels
                    }).then(data => {
                        //created draft calculating cancelling cancelled discarded deleted
                        if(data?.shipment.shipment_state === "created"){
                            orderApi.updateOrder(order.id, { 
                                shipmentStatus: SHIPMENT_STATUS.CREATED,
                                easyshipShipmentId: data.shipment.easyship_shipment_id
                            })
                        }
                        
                    })
                }
            }
        })
    }
}

export const kFormatter = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

export const findPointMouseRaycastWithScene = (e, gl, raycaster, camera, scene, newProd, snapPoints) => {
    const event = e
    const rect = gl.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let canvasPointer = new Vector2()
    canvasPointer.x = ( x / gl.domElement.clientWidth ) *  2 - 1;
    canvasPointer.y = ( y / gl.domElement.clientHeight) * - 2 + 1
    raycaster.setFromCamera(canvasPointer, camera);

    let point = null

    if(scene){
        let listObjectCanBeIntersect = scene.children.filter(el => !el.userData?.id && !el.isTransformControls);
        if(newProd?.type === PRODUCT_TYPES.PRODUCTS){
            listObjectCanBeIntersect = scene.children.filter(el => !el.isTransformControls && (!el.userData?.id || (el.userData?.id && el.userData?.type === PRODUCT_TYPES.DECORATIVES)));
        }
        let intersects = raycaster.intersectObjects([...listObjectCanBeIntersect], true);

        if(intersects.length && intersects.findIndex(el => el.object.visible) >= 0){
            let indexVisible = intersects.findIndex(el => el.object.visible)
            point = getSnapPoint(intersects[indexVisible].point, snapPoints)
        }
    }

    return point
}

export const checkIsIntersectFaceFlat = (object, face, camera) => {
    if(!object || !face || !camera){
        return false
    }
    let check = false;
    let normalMatrix = new Matrix3();
    let worldNormal = new Vector3();
    normalMatrix.getNormalMatrix( object.matrixWorld );
    worldNormal.copy( face.normal ).applyMatrix3( normalMatrix ).normalize();

    const angleToCameraUp = worldNormal.angleTo(camera.up) / Math.PI * 180

    if(
    (angleToCameraUp >= 0 && angleToCameraUp <= 5)
    || (angleToCameraUp >= 175 && angleToCameraUp <= 180)
    ){
        check = true
    }

    return check
}

export const isManipulationEqual = (a, b) => {
    const {
        listProducts: listProducts1,
        listTexts: listTexts1,
        listPlaceholders: listPlaceholders1
    } = a
    const {
        listProducts: listProducts2,
        listTexts: listTexts2,
        listPlaceholders: listPlaceholders2
    } = b

    if(
        !compareTwoList(listProducts1, listProducts2)
        || !compareTwoList(listTexts1, listTexts2)
        || !compareTwoList(listPlaceholders1, listPlaceholders2)
    ) {
        return false
    }

    return true
}

export const compareTwoList = (a, b) => {
    const valueKeys = ['id', 'name', 'description']
    const vectorKeys = ['position', 'rotation', 'scale']

    if(a.length !== b.length){
        return false
    }

    let check = true
    for(let i = 0; i < a.length; i ++){
        valueKeys.forEach(key => {
            if(
                _.has(a, [i, key]) !== _.has(b, [i, key])
                || _.get(a, [i, key]) !==_.get(b, [i, key]) 
            ) {
                check = false
            }
        })
        vectorKeys.forEach(key => {
            if(
                _.has(a, [i, key]) !== _.has(b, [i, key])
                || !compareVector(_.get(a, [i, key]) ,_.get(b, [i, key]))
            ) {
                check = false
            }
        })
    }

    return check
}

const compareVector = (a, b) => {
    if(!a && !b){
        return true
    } else if((!a && b) || (a && !b)){
        return false
    }
    return a.x === b.x && a.y === b.y && a.z === b.z;
}

export const checkPointInCanvas = (e, gl) => {
    const event = e
    const rect = gl.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if(x > 0 && x < rect.width && y > 0 && y < rect.height){
        return true
    }

    return false
}

export const checkPointInCanvasWhenDragFromEditorSidebar = (e, gl) => {
    const event = e
    const rect = gl.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const modalWidth = Math.min(window.innerWidth, MODAL_STORE_EDITOR_WIDTH)

    if(x > modalWidth && x < rect.width && y > 0 && y < rect.height){
        return true
    }

    return false
}

export const findDistanceByRandSquaredLine = (r, a) => {
    return Math.sqrt(Math.pow(r, 2) - Math.pow(a, 2))
}

export const getFontUrl = (filePath) => {
    if(Object.keys(fonts).map(el => fonts[el]).includes(filePath)){
        return filePath
    } else {
        return getAssetsUrl(filePath)
    }
}

export const getAssetsUrl = (fileName) => {
    if(!fileName){
        return ""
    }
    if(fileName.startsWith('data:image')){
        return fileName
    }
    if(fileName.startsWith("http")){
        return fileName
    } else {
        return `${process.env.REACT_APP_UPLOAD_ENDPOINT}/${fileName}`
    }
}

export const disposeGroup = (group) => {
    if(group.isMesh){
        if (group && group['geometry']) {
            group.geometry.dispose();
        }
        if (group && group['material']) {
            group.material.dispose();
        }
    } else {
        group.children.forEach(el => {
            if (el && el['geometry']) {
                el.geometry.dispose();
            }
            if (el && el['material']) {
                el.material.dispose();
            }
        
            if(el && el.children){
                disposeGroup(el)
            }
        })
    }
}

export const itemPaginationRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Previous</a>;
    }
    if (type === 'next') {
      return <a>Next</a>;
    }
    return originalElement;
  };

export const is3DFile = (filename) => {
    return filename && (filename.includes('.glb') || filename.includes('.fbx') || filename.includes('.obj'))
}

export const isImageFile = (filename) => {
    return filename.match(/.(jpg|jpeg|png|gif)$/i)
}

export const isVideoFile = (filename) => {
    return filename.match(/.(mp4)$/i)
}


export function roundedRect( ctx, x, y, width, height, radius ) {
    ctx.moveTo( x, y + radius );
    ctx.lineTo( x, y + height - radius );
    ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
    ctx.lineTo( x + width - radius, y + height );
    ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
    ctx.lineTo( x + width, y + radius );
    ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
    ctx.lineTo( x + radius, y );
    ctx.quadraticCurveTo( x, y, x, y + radius );
}

export function htmlDecode(input){
    var e = document.createElement('textarea');
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

export const isPublishModeLocation = (location) => {
    return location.pathname.includes('publish')
}

export const isShopifyAdminLocation = (location) => {
    return location.pathname.includes('admin-shopify')
}

export const bytesToMegabytes = (bytes) => {
    if(!bytes){
        return 0
    } else {
        return bytes / (1024 * 1024)
    }
}
