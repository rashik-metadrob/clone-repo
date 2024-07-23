import { Select } from "@react-three/postprocessing";
import { useGesture } from "@use-gesture/react";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getIsPreviewModel, getSelectedObject, getTreeData } from "../../../../redux/modelSlice";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Box3, Raycaster, Vector2, SphereGeometry, MeshBasicMaterial, Color, AnimationMixer, LoopOnce, LoopRepeat, VideoTexture, RepeatWrapping, DoubleSide, Vector3 } from "three";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment"
import { createTracking } from "../../../../api/tracking.api";
import { AVAILABLE_ANIMATION, MODEL_BLOCK, PRODUCT_TYPES, TRACKING_ACTION_NAME, TRACKING_TYPE, TREE_DATA_NODE_TYPE } from "../../../../utils/constants";
import { apllyMaterials, buildGraph, changeMaterialToMeshLambertMaterial, disposeGroup, getAssetsUrl, getSnapPoint, getSnapPointInSphere, is3DFile, isPublishModeLocation, isRightClick, loadModel, mergeScale } from "../../../../utils/util";
import { notification } from "antd";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader';
import _ from "lodash";
import EditorMenuHtml from "../editorMenuHtml/EditorMenuHtml";
import DescriptionBoardHtml from "../descriptionBoardHtml/DescriptionBoardHtml";
import ProductIndicator from "../productIndicator/ProductIndicator";
import { findNodeOfTreeData, traverseTreeData } from "../../../../utils/treeData.util";
import MediaTexturePlaylist from "./components/mediaTexturePlaylist/MediaTexturePlaylist";
import { Html, useGLTF } from "@react-three/drei";
import { MeshoptDecoder } from'three/addons/libs/meshopt_decoder.module.js'
import { getIsOverrideMaterialDesktop, getIsOverrideMaterialMobile } from "../../../../redux/configSlice";
import { isMobile } from "react-device-detect"

const Product = ({
    item,
    onSelectObject = () => {},
    cameraControl,
    onChangePosition = () => {},
    onAddToCart = () => {},
    snapPoints,
    onMeshCollision = () => {},
    stopMeshCollision = () => {},
    onShowMoreInfo = () => {},
    onLoaded = () => {},
    onShowObjectDetail = () => {},
    onCopy = () => {},
    onPaste = () => {},
    onDelete = () => {},
    onLock = () => {},
    onDuplicate = () => {},
    onChangeMedia = () => {}
}) => { 
    const groupContainerRef = useRef()
    const treeData = useSelector(getTreeData)
    const productUrl = useMemo(() => {
        let assetUrl = item.url
        let galleryId = _.get(item, ['selectedGalleryId'], '')
        if(galleryId){
            const selectedGallery = _.find(_.get(item, ['gallery'], []), (el) => el?.id === galleryId)
            if(selectedGallery && selectedGallery.object && is3DFile(selectedGallery.object)){
                assetUrl = selectedGallery.object
            }
        }

        return assetUrl
    }, [item?.selectedGalleryId])
    const isAxesHelper = useMemo(() => { return _.get(item, ['axesHelper'], false) }, [item])
    const isOverrideMaterialDesktop = useSelector(getIsOverrideMaterialDesktop)
    const isOverrideMaterialMobile = useSelector(getIsOverrideMaterialMobile)

    const shouldOverrideMaterial = useMemo(() => {
        return (!isMobile && isOverrideMaterialDesktop) || (isMobile && isOverrideMaterialMobile)
    }, [isOverrideMaterialDesktop, isOverrideMaterialMobile])

    // const [model, setModel] = useState(null)
    // Don't use manual loader. The useLoader has cache, when user delete element from list, another element's doesn't rerender
    const model = useLoader(
        GLTFLoader, 
        getAssetsUrl(productUrl), 
        loader => {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath( `${process.env.REACT_APP_HOMEPAGE}/draco/` );
            dracoLoader.setDecoderConfig({type: "js"})
            loader.setDRACOLoader(dracoLoader);
            loader.setMeshoptDecoder(MeshoptDecoder)
        }
    )
    const [isPlayAnimation, setIsPlayAnimation] = useState(false);
    const [mediaSource, setMediaSource] = useState(null)
    const [distanceToCamera, setDistanceToCamera] = useState()
    const productRef = useRef()

    // Apply for TV
    const videoTexture = useMemo(() => {
        if(mediaSource){
            const texture = new VideoTexture(mediaSource)
            texture.wrapS = RepeatWrapping
            texture.wrapT = RepeatWrapping

            texture.repeat.set(1, 1)

            return texture
        } else {
            return null
        }
    }, [mediaSource])

    const object = useMemo(() => {
        if(!model){
            return null
        }
        const clone = model.scene.clone();
        if(clone){
            if(shouldOverrideMaterial){
                changeMaterialToMeshLambertMaterial(clone)
            } else {
                clone.traverse(el => {
                    if(el.isMesh){
                        el.material = el.material.clone()
                    }
                })
            }
            // Set video texture
            clone.traverse(el => {
                if(el.isMesh){
                    if(videoTexture){
                        el.material = el.material.clone()
                    }
                    el.material.envMapIntensity = 2;
                    el.material.needsUpdate = true;

                    if(videoTexture){
                        const selectedMaterial = _.get(item, ['media', 'selectedMaterial'])
                        if(selectedMaterial === el.material?.name) {
                            el.material.map = videoTexture
                            el.material.side = DoubleSide
                        }
                    }
                }
            })
        }
        return clone;
    },[model, videoTexture, item?.media?.selectedMaterial, shouldOverrideMaterial])

    useEffect(() => {
        const selectedGalleryId = _.get(item, ['selectedGalleryId'], '')
        let savedMaterials = {}
        if(selectedGalleryId){
            const selectedGallery = _.find(_.get(item, ['gallery'], []), (el) => el.id === selectedGalleryId)
            savedMaterials = _.get(selectedGallery, ['materials'], {})
        }
        const material = buildGraph(object)
        apllyMaterials(material.materials, savedMaterials)
    }, [object, item?.gallery])

    const mixer = useMemo(() => {
        let newMixer = new AnimationMixer(object);
        return newMixer
    }, [object])

    const action = useMemo(() => {
        if(model && model.animations.length > 0){
            return mixer.clipAction(model.animations[0])
        } else {
            return null
        }
    }, [mixer, model])

    useEffect(() => {
        if(object) {
            productRef.current.remove(...productRef.current.children)
            productRef.current.add(object)
        }
        
        return () => {
            if(object) {
                disposeGroup(object)
            }
        }
    }, [object])

    useEffect(() => {
        if(object){
            onLoaded(item.id)
        }
    },[item?.id, object, onLoaded])

    const {id: projectId} = useParams()
    const clickTimeRef = useRef(0)
    const timeoutRef = useRef()
    let location = useLocation();

    // const [object, setObject] = useState()
    const [objectBox, setObjectBox] = useState()
    const { camera, gl, scene } = useThree();
    const [raycaster] = useState(new Raycaster());

    const position = useMemo(() => {
       return [item.position.x ?? 0, item.position.y ?? 0, item.position.z ?? 0]
    }, [item.position.x, item.position.y, item.position.z])

    const productPosition = useMemo(() => {
        return new Vector3(_.get(item, ['position', 'x'], 0), _.get(item, ['position', 'y'], 0), _.get(item, ['position', 'z'], 0))
    }, [item?.position])

    const selectedObject = useSelector(getSelectedObject)
    const isSelectCurrentObject = useMemo(() => {
        if(selectedObject && selectedObject === item.id){
            return true
        } else {
            return false
        }
    }, [selectedObject, item.id])

    const isSelectGroupContainItem = useMemo(() => {
        if(selectedObject){
            const node = findNodeOfTreeData(treeData, selectedObject)
            if(node && _.get(node, ['nodeType']) === TREE_DATA_NODE_TYPE.FOLDER){
                const keys = traverseTreeData([], node)
                return keys.includes(item.id)
            }
            return false
        } else {
            return false
        }
    }, [selectedObject, item.id, treeData])
    const isPreviewMode = useSelector(getIsPreviewModel)
    const [listSnapHelper, setListSnapHelper] = useState([])
    const [isIntersectWithOrther, setIsIntersectWithOrther] = useState(false)

    const indexVisible = useRef()
    const point = useRef()

    const snapGeometry = useMemo(() => { return new SphereGeometry(0.05, 32, 16)}, [])
    const snapMaterial = useMemo(() => { return new MeshBasicMaterial({color: new Color("#FF0000")})}, [])
    const isProd = useMemo(() => { return item?.type === PRODUCT_TYPES.PRODUCTS}, [item])
    const isDecor = useMemo(() => { return isPreviewMode && (item.type === PRODUCT_TYPES.DECORATIVES || item.type === PRODUCT_TYPES.ELEMENT)}, [item, isPreviewMode])
    const isHasDescriptionBoard = useMemo(() => { return item?.type === PRODUCT_TYPES.PRODUCTS}, [item])

    useFrame((a, delta) => {
        if(mixer && ((selectedObject === item?.id && !isPreviewMode) || isPreviewMode) && action){
            mixer.update(delta)
        }

        if(_.get(item, ['media', 'isSpatialAudio'], false)){
            setDistanceToCamera(_.round(camera.position.distanceTo(productPosition), 2))
        }
    })

    useEffect(() => {
        if(groupContainerRef.current && !groupContainerRef.current.userData?.isDragging){
            groupContainerRef.current.position.set(item.position.x ?? 0, item.position.y ?? 0, item.position.z ?? 0)
        }
    }, [item.position.x, item.position.y, item.position.z])

    useEffect(() => {
        if(!isPreviewMode){
            if(isPlayAnimation && action && item?.availableAnimation !== AVAILABLE_ANIMATION.PLAY_NEVER){
                action.reset()
                if(item.availableAnimation === AVAILABLE_ANIMATION.LOOP_ONE){
                    action.loop = LoopOnce
                } else {
                    action.loop = LoopRepeat
                }
                action.play()
            } else {
                if(action){
                    action.paused = true;
                }
            }
        }
    },[isPlayAnimation, action, item.availableAnimation, isPreviewMode])

    useEffect(() => {
        if(isPreviewMode){
            if(action && item?.availableAnimation !== AVAILABLE_ANIMATION.PLAY_NEVER){
                action.reset()
                if(item.availableAnimation === AVAILABLE_ANIMATION.LOOP_ONE){
                    action.loop = LoopOnce
                } else {
                    action.loop = LoopRepeat
                }
                action.play()
            }
        }
        
    }, [action, item.availableAnimation, isPreviewMode])

    useEffect(() => {
        if(selectedObject === item.id){
            setIsPlayAnimation(true)
        } else {
            setIsPlayAnimation(false)
        }
    },[item, selectedObject])

    useEffect(() => {
        if(groupContainerRef.current){
            groupContainerRef.current.rotation.set(item.rotation.x ?? 0, item.rotation.y ?? 0, item.rotation.z ?? 0)
        }
    }, [item.rotation.x, item.rotation.y, item.rotation.z])

    useEffect(() => {
        const scaleValue = mergeScale(item?.scale, _.get(item, ['uniformScale'], 0))
        productRef.current.scale.set(scaleValue[0],scaleValue[1], scaleValue[2])
        setTimeout(() => {
            if(productRef.current){
                productRef.current.updateWorldMatrix(true, true)
                setObjectBox(new Box3().setFromObject(productRef.current))
            }
        }, 200)
    }, [item?.scale?.x, item?.scale?.y, item?.scale?.z, item?.uniformScale])

    useEffect(() => {
        if(object){
            setTimeout(() => {
                if(productRef.current){
                    productRef.current.updateWorldMatrix(true, true)
                    setObjectBox(new Box3().setFromObject(productRef.current))
                }
            }, 200)
        }
    }, [object])

    const checkIntersectWithOrther = useCallback(() => {
        // All object product, decor, other, ...
        const ortherProducts = scene.children.filter(el => el.userData?.id && el.userData.id !== item.id);

        productRef.current.updateWorldMatrix(true, true)
        const productBox = new Box3().setFromObject(productRef.current)

        const listProducts = []
        ortherProducts.forEach(el => {
            if(el?.children.find(el => el.userData.id)){
                listProducts.push(el.children.find(el => el.userData.id))
            }
        })

        for(let i = 0; i < listProducts.length; i++){
            listProducts[i].updateWorldMatrix(true, true)
            let box = new Box3().setFromObject(listProducts[i])

            if(box.intersectsBox(productBox)){
                return true
            }
        }

        return false;
    }, [item.id, scene])

    useEffect(() => {
        return () => {
            if(selectedObject === item.id){
                stopMeshCollision()
            }
        }
    }, [selectedObject])

    useEffect(() => {
        if(isPreviewMode){
            return
        }
        if(selectedObject === item.id && item?.type !== PRODUCT_TYPES.PRODUCTS){
            const checkIntersect = checkIntersectWithOrther()
            if(checkIntersect){
                if(!isIntersectWithOrther){
                    notification.error({
                        message: "Your object is overlapping with others!"
                    })
                }
                onMeshCollision();
                setIsIntersectWithOrther(true)
            } else {
                stopMeshCollision()
                setIsIntersectWithOrther(false)
            }
        } else {
            setIsIntersectWithOrther(false)
        }
        if(!selectedObject){
            stopMeshCollision()
        }
    }, [isIntersectWithOrther, selectedObject, isPreviewMode, item.id, item?.type, checkIntersectWithOrther, onMeshCollision, stopMeshCollision])

    const handleCreateTracking = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            let traking = {
                trackingContainerId: projectId,
                type: TRACKING_TYPE.STORE,
                track: {
                    actionName: TRACKING_ACTION_NAME.CLICK_PRODUCT,
                    actionTime: moment().toString(),
                    actionValue: clickTimeRef.current,
                    actionTrackingId: item.objectId,
                    actionUnit: "time"
                }
            }
            createTracking(traking).then(rs => {
                clickTimeRef.current = 0
            })
        }, 1000)
    }

    const trackingClickItem = () => {
        if(!location.pathname.includes('publish')){
            return
        }
        clickTimeRef.current = clickTimeRef.current + 1

        handleCreateTracking()
    }

    const onPointerDown = (e) => {
        if(e.event.srcElement.tagName !== "CANVAS"){
            return
        }
        if(isDecor || !_.get(item, ['visible'], true)){
            return
        }
        
        if(e.event.intersections.length === 0){
            return
        }
        if(
            !((e.event?.distance && (e.event?.distance === e.event.intersections[0].distance)) 
            || (e.event?.intersection?.distance && (e.event?.intersection?.distance === e.event.intersections[0].distance)))
        ){
            return
        }
        if(isRightClick(e.event)){
            onLock()
        }
        trackingClickItem()
        onSelectObject(item.id)
    }

    const bind1 = useGesture({
        onPointerDown
    })
    const bind2 = useGesture({
        onPointerDown,
        onDragStart: (e) => {
            if(isAxesHelper){
                return
            }
            if(isPreviewMode){
                return
            }
            if(selectedObject === item.id && _.get(item, ['isLock'], false)){
                return
            }
            if(selectedObject === item.id){
                if(cameraControl.current && cameraControl.current.cameraRef()){
                    let cameraRef = cameraControl.current.cameraRef()
                    cameraRef.enabled = false;
                    cameraRef.saveState();
                }
            }

            const rect = gl.domElement.getBoundingClientRect();
            const x = e.event.clientX - rect.left;
            const y = e.event.clientY - rect.top;
            let canvasPointer = new Vector2()
            canvasPointer.x = ( x / gl.domElement.clientWidth ) *  2 - 1;
            canvasPointer.y = ( y / gl.domElement.clientHeight) * - 2 + 1
            raycaster.setFromCamera(canvasPointer, camera);

            if(scene){
                let intersects = raycaster.intersectObjects([...scene.children.filter(el => !el.userData?.id && !el.isTransformControls)], true);

                if(intersects.length && intersects.findIndex(el => el.object.visible) >= 0){
                    indexVisible.current = intersects.findIndex(el => el.object.visible)
                    point.current = getSnapPoint(intersects[indexVisible.current].point, snapPoints.current)
                    let points = getSnapPointInSphere(point.current, snapPoints.current)
                    setListSnapHelper([...points])
                }
            }
        },
        onDrag: (e) => {
            if(isAxesHelper){
                return
            }
            if(isPublishModeLocation(location) || isPreviewMode){
                return
            }
            if(selectedObject === item.id && _.get(item, ['isLock'], false)){
                return
            }
            if(e.movement && e.movement.length === 2){
                if(e.movement[0] === 0 && e.movement[1] === 0){
                    return
                }
            }
            if(selectedObject === item.id){
                if(cameraControl.current && cameraControl.current.cameraRef()){
                    let cameraRef = cameraControl.current.cameraRef()
                    if(cameraRef && cameraRef.enabled){
                        cameraRef.enabled = false;
                        cameraRef.saveState();
                    }
                }
            }
            if(selectedObject === item.id){
                const event = e.event
                const rect = gl.domElement.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                let canvasPointer = new Vector2()
                canvasPointer.x = ( x / gl.domElement.clientWidth ) *  2 - 1;
                canvasPointer.y = ( y / gl.domElement.clientHeight) * - 2 + 1
                raycaster.setFromCamera(canvasPointer, camera);

                if(scene){
                    let listObjectCanBeIntersect = scene.children.filter(el => !el.userData?.id && !el.userData.box && !el.isTransformControls);
                    if(item.type === PRODUCT_TYPES.PRODUCTS){
                        listObjectCanBeIntersect = scene.children.filter(el => !el.isTransformControls && (!el.userData?.id || (el.userData?.id && el.userData?.type === PRODUCT_TYPES.DECORATIVES)));
                    }
                    let intersects = raycaster.intersectObjects([...listObjectCanBeIntersect], true);

                    if(intersects.length && intersects.findIndex(el => el.object.visible) >= 0){
                        indexVisible.current = intersects.findIndex(el => el.object.visible)
                        point.current = getSnapPoint(intersects[indexVisible.current].point, snapPoints.current)
                        onChangePosition(item.id, point.current)
                    }
                }
            }
        },
        onDragEnd: () => {
            if(isAxesHelper){
                return
            }
            if(isPreviewMode){
                return
            }
            if(selectedObject === item.id && _.get(item, ['isLock'], false)){
                return
            }
            if(selectedObject === item.id){
                if(cameraControl.current && cameraControl.current.cameraRef()){
                    let cameraRef = cameraControl.current.cameraRef()
                    cameraRef.enabled = true;
                    cameraRef.saveState();
                }
                stopMeshCollision();
            }
        },
    })

    let bind = bind1

    if(!isPreviewMode){
        bind = bind2
    }

    const onCloseDescriptionBoard = () => {
        onSelectObject(null)
    }

    useEffect(() => {
        if(selectedObject !== item.id){
            setListSnapHelper([])
        }
    }, [item.id, selectedObject])
    
    
    return <>
        <group
            // position={position}
            // rotation={rotation}
            visible={_.get(item, ['visible'], true)}
            userData={{
                id: item.id,
                type: item.type
            }}
            ref={groupContainerRef}
        >
            {/* <AudioPlayer mediaSource={mediaSource} /> */}
            <Select 
                enabled={(isSelectCurrentObject || isSelectGroupContainItem) && !isDecor}
                userData={{
                    id: item.id,
                    type: item.type
                }}
            >
                <group
                    {...bind()}
                    ref={productRef}
                    // scale={scale}
                    name={`prod-${item.id}`}
                >
                    {/* {object && <primitive
                        object={object}
                    />} */}
                </group>
            </Select>
            {(isHasDescriptionBoard && isPreviewMode) && objectBox && <DescriptionBoardHtml 
                productPosition={position}
                item={item} 
                onAddToCart={onAddToCart}
                onCloseDescriptionBoard={onCloseDescriptionBoard}
                visible={isSelectCurrentObject}
                objectBox={objectBox}
                onShowMoreInfo={onShowMoreInfo}
            />}
            {(!isPreviewMode && isSelectCurrentObject) && objectBox && <EditorMenuHtml 
                productPosition={position}
                item={item}
                visible={isSelectCurrentObject}
                objectBox={objectBox}
                onShowObjectDetail={onShowObjectDetail}
                onCopy={onCopy}
                onPaste={onPaste}
                onDelete={onDelete}
                onLock={onLock}
                onDuplicate={onDuplicate}
            />}
            {isProd && objectBox && <ProductIndicator  
                productPosition={position}
                objectBox={objectBox}
                isSelected={isSelectCurrentObject}
            />}
        </group>
        {
            listSnapHelper && listSnapHelper.map((el, index) => (
                <>
                    <mesh position={[el.x, el.y, el.z]} key={`grid-circle-${index}`} geometry={snapGeometry} material={snapMaterial}>
                    </mesh>
                </>
            ))
        }
        <Html>
            <MediaTexturePlaylist 
                item={item}
                distanceToCamera={distanceToCamera}
                selectedObject={selectedObject}
                onChangeMedia={onChangeMedia}
                onVideoSourceChange={(video) => {setMediaSource(video)}}
            />
        </Html>
    </>
}

const ProductContainer = (props) => {
    if(props.item.block && props.item.block === MODEL_BLOCK["2D"]){
        return null
    }

    return <Product {...props} />
}
export default React.memo(ProductContainer);