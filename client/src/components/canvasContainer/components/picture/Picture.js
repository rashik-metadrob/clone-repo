import { Select } from "@react-three/postprocessing";
import { useGesture } from "@use-gesture/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getIsPreviewModel, getSelectedObject, getTreeData } from "../../../../redux/modelSlice";
import { useLoader, useThree } from "@react-three/fiber";
import { Box3, Raycaster, Vector2, DoubleSide, TextureLoader, SphereGeometry, MeshBasicMaterial, Color, PlaneGeometry, Vector3, Matrix3, Matrix4, Euler } from "three";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment"
import { createTracking } from "../../../../api/tracking.api";
import { MODEL_BLOCK, PRODUCT_TYPES, TRACKING_ACTION_NAME, TRACKING_TYPE, TREE_DATA_NODE_TYPE } from "../../../../utils/constants";
import { getAssetsUrl, getSnapPoint, getSnapPointInSphere, is3DFile, isPublishModeLocation, isRightClick, mergeScale } from "../../../../utils/util";
import { notification } from "antd";
import { Center } from "@react-three/drei";
import EditorMenuHtml from "../editorMenuHtml/EditorMenuHtml";
import _ from 'lodash'
import DescriptionBoardHtml from "../descriptionBoardHtml/DescriptionBoardHtml";
import ProductIndicator from "../productIndicator/ProductIndicator";
import { findNodeOfTreeData, traverseTreeData } from "../../../../utils/treeData.util";
import { getIsOverrideMaterialDesktop, getIsOverrideMaterialMobile } from "../../../../redux/configSlice";
import { isMobile } from "react-device-detect"

const Picture = ({
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
    onChangeRotation = () => {},
    onShowObjectDetail = () => {},
    onCopy = () => {},
    onPaste = () => {},
    onDelete = () => {},
    onLock = () => {},
    onDuplicate = () => {}
}) => {
    const groupContainerRef = useRef()
    const {id: projectId} = useParams()
    const clickTimeRef = useRef(0)
    const timeoutRef = useRef()
    let location = useLocation();
    const treeData = useSelector(getTreeData)
    const isAxesHelper = useMemo(() => { return _.get(item, ['axesHelper'], false) }, [item])
    const isOverrideMaterialDesktop = useSelector(getIsOverrideMaterialDesktop)
    const isOverrideMaterialMobile = useSelector(getIsOverrideMaterialMobile)

    const shouldOverrideMaterial = useMemo(() => {
        return (!isMobile && isOverrideMaterialDesktop) || (isMobile && isOverrideMaterialMobile)
    }, [isOverrideMaterialDesktop, isOverrideMaterialMobile])

    const productRef = useRef()

    const [objectBox, setObjectBox] = useState()
    const { camera, gl, scene } = useThree();
    const [raycaster] = useState(new Raycaster());

    const position = useMemo(() => {
        return [item.position.x ?? 0, item.position.y ?? 0, item.position.z ?? 0]
    }, [item.position.x, item.position.y, item.position.z])
    const rotation = useMemo(() => {
        return [item.rotation.x ?? 0, item.rotation.y ?? 0, item.rotation.z ?? 0]
    }, [item.rotation.x, item.rotation.y, item.rotation.z])
    const [scale, setScale] = useState([1, 1, 1])

    const selectedObject = useSelector(getSelectedObject)
    const isPreviewMode = useSelector(getIsPreviewModel)
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

    const [listSnapHelper, setListSnapHelper] = useState([])

    const [isIntersectWithOrther, setIsIntersectWithOrther] = useState(false)

    const imageRef = useRef()

    const pictureUrl = useMemo(() => {
        let assetUrl = item.url
        let galleryId = _.get(item, ['selectedGalleryId'], '')
        if(galleryId){
            const selectedGallery = _.find(_.get(item, ['gallery'], []), (el) => el?.id === galleryId)
            if(selectedGallery && selectedGallery.image && !is3DFile(selectedGallery.image)){
                assetUrl = selectedGallery.image
            }
        }

        return assetUrl
    }, [item?.selectedGalleryId])

    const usedTexture = useLoader(TextureLoader, getAssetsUrl(pictureUrl))
    // const [usedTexture, setUsedTexture] = useState(null)

    const snapGeometry = useMemo(() => { return new SphereGeometry(0.05, 32, 16)}, [])
    const snapMaterial = useMemo(() => { return new MeshBasicMaterial({color: new Color("#FF0000")})}, [])

    const planeImageGeo = useMemo(() => { return new PlaneGeometry(1, 1) }, [])

    const materialConfigs = useMemo(() => {
        let galleryId = _.get(item, ['selectedGalleryId'], '')
        const gallery = _.find(_.get(item, ['gallery'], []), (el) => el?.id === galleryId)
        return _.pick(gallery?.materialConfigs, ["envMapIntensity"]);
    }, [JSON.stringify(_.get(item, ['gallery'], ''))])

    const isProd = useMemo(() => { return item?.type === PRODUCT_TYPES.PRODUCTS}, [item])
    const isDecor = useMemo(() => { return isPreviewMode && (item.type === PRODUCT_TYPES.DECORATIVES || item.type === PRODUCT_TYPES.ELEMENT)}, [item, isPreviewMode])
    const isHasDescriptionBoard = useMemo(() => { return item?.type === PRODUCT_TYPES.PRODUCTS}, [item])

    useEffect(() => {
        if(groupContainerRef.current && !groupContainerRef.current.userData?.isDragging){
            groupContainerRef.current.position.set(item.position.x ?? 0, item.position.y ?? 0, item.position.z ?? 0)
        }
    }, [item.position.x, item.position.y, item.position.z])

    useEffect(() => {
        if(groupContainerRef.current){
            groupContainerRef.current.rotation.set(item.rotation.x ?? 0, item.rotation.y ?? 0, item.rotation.z ?? 0)
        }
    }, [item.rotation.x, item.rotation.y, item.rotation.z])

    useEffect(() => {
        if(usedTexture && usedTexture.source.data){
            const {naturalWidth, naturalHeight} = usedTexture.source.data;
            imageRef.current.scale.set(1, naturalHeight / naturalWidth, 10)
            setObjectBox(new Box3().setFromObject(productRef.current))

            onLoaded(item.id)
        }
    }, [usedTexture])

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

    const checkIntersectWithOrther = () => {
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
    }

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
                    onMeshCollision();
                }
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
    }, [position[0], position[1], position[2], rotation[0], rotation[1], rotation[2], isIntersectWithOrther, selectedObject, isPreviewMode])

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

    const bind = useGesture({
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

            const event = e.event
            const rect = gl.domElement.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            let canvasPointer = new Vector2()
            canvasPointer.x = ( x / gl.domElement.clientWidth ) *  2 - 1;
            canvasPointer.y = ( y / gl.domElement.clientHeight) * - 2 + 1
            raycaster.setFromCamera(canvasPointer, camera);

            if(scene){
                let intersects = raycaster.intersectObjects([...scene.children.filter(el => !el.userData?.id && !el.isTransformControls)], true);

                if(intersects.length && intersects.findIndex(el => el.object.visible) >= 0){
                    let indexVisible = intersects.findIndex(el => el.object.visible)
                    let point = getSnapPoint(intersects[indexVisible].point, snapPoints.current)
                    let points = getSnapPointInSphere(point, snapPoints.current)
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
            if(e.movement && e.movement.length === 2){
                if(e.movement[0] === 0 && e.movement[1] === 0){
                    return
                }
            }
            if(selectedObject === item.id && _.get(item, ['isLock'], false)){
                return
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
                    let listObjectCanBeIntersect = scene.children.filter(el => !el.userData?.id && !el.isTransformControls);
                    if(item.type === PRODUCT_TYPES.PRODUCTS){
                        listObjectCanBeIntersect = scene.children.filter(el => !el.isTransformControls && (!el.userData?.id || (el.userData?.id && el.userData?.type === PRODUCT_TYPES.DECORATIVES)));
                    }
                    let intersects = raycaster.intersectObjects([...listObjectCanBeIntersect], true);

                    if(intersects.length && intersects.findIndex(el => el.object.visible) >= 0){
                        let indexVisible = intersects.findIndex(el => el.object.visible)
                        let point = getSnapPoint(intersects[indexVisible].point, snapPoints.current)
                        const target = calculateTargetForNewPosition(intersects[indexVisible])
                        calculateNewRotation(intersects[indexVisible].point, target, productRef.current.up)
                        calculateNewPosition(intersects[indexVisible], point)
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

    const calculateTargetForNewPosition = (intersect) => {
        let normalMatrix = new Matrix3();
        let worldNormal = new Vector3();
        normalMatrix.getNormalMatrix( intersect.object.matrixWorld );
        worldNormal.copy( intersect.face.normal ).applyMatrix3( normalMatrix ).normalize();

        return intersect.point.clone().add(worldNormal)
    }

    // Calculate new rotation with object non have parent
    const calculateNewRotation = (_position, _target, _up) => {
        const m1 = new Matrix4()
        m1.lookAt(_position, _target, _up)
        const rot = new Euler().setFromRotationMatrix(m1)
        // rot.set(rot.x + Math.PI, rot.y + Math.PI, rot.z + Math.PI)
        onChangeRotation(item.id, {x: rot.x, y: rot.y + Math.PI, z: rot.z})
    }

    const calculateNewPosition = (intersect, point) => {
        let normalMatrix = new Matrix3();
        let worldNormal = new Vector3();
        normalMatrix.getNormalMatrix( intersect.object.matrixWorld );
        worldNormal.copy( intersect.face.normal ).applyMatrix3( normalMatrix ).normalize();

        onChangePosition(item.id, point.clone().add(worldNormal.normalize().multiplyScalar(0.02)))
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
            ref={groupContainerRef}
            userData={{
                id: item.id,
                type: item.type
            }}
            visible={_.get(item, ['visible'], true)}
        >
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
                    name={`prod-${item.id}`}
                >
                    <Center>
                        <mesh ref={imageRef} geometry={planeImageGeo}>
                            {usedTexture && !shouldOverrideMaterial && <meshStandardMaterial map={usedTexture} side={DoubleSide} transparent={true} {...materialConfigs}/>}
                            {usedTexture && shouldOverrideMaterial && <meshLambertMaterial map={usedTexture} side={DoubleSide} transparent={true} {...materialConfigs}/>}
                        </mesh>
                    </Center>
                </group>
            </Select>
            {(isHasDescriptionBoard && isPreviewMode) && <DescriptionBoardHtml
                productPosition={position}
                item={item}
                onAddToCart={onAddToCart}
                onCloseDescriptionBoard={onCloseDescriptionBoard}
                visible={selectedObject === item.id}
                objectBox={objectBox}
                onShowMoreInfo={onShowMoreInfo}
            />}
            {(!isPreviewMode && isSelectCurrentObject) && <EditorMenuHtml 
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
            {isProd && <ProductIndicator  
                productPosition={position}
                objectBox={objectBox}
                is2D={true}
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
    </>
}

const PictureContainer = (props) => {
    if(!props.item.block || props.item.block === MODEL_BLOCK["3D"]){
        return null
    }

    return <Picture {...props} />
}

export default PictureContainer;