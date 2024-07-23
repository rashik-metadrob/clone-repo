import { Select } from "@react-three/postprocessing";
import { useGesture } from "@use-gesture/react";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIsPreviewModel, getSelectedObject, getTreeData, syncProductPrice } from "../../../../redux/modelSlice";
import { useThree } from "@react-three/fiber";
import { Box3, Raycaster, Vector2, PMREMGenerator, CanvasTexture, DoubleSide, TextureLoader, Texture, RepeatWrapping, SphereGeometry, MeshBasicMaterial, Color, PlaneGeometry, Vector3, Matrix3, Matrix4, Quaternion, Euler, BoxGeometry } from "three";

import { useLocation, useParams } from "react-router-dom";
import moment from "moment"
import { createTracking } from "../../../../api/tracking.api";
import { CURRENCY_LIST, FRAME_3D_DEPTH, MODEL_BLOCK, PLACEHOLDER_SIZES, PRODUCT_TYPES, PUBLISH_ROLE, TRACKING_ACTION_NAME, TRACKING_TYPE, TREE_DATA_NODE_TYPE } from "../../../../utils/constants";
import { getAssetsUrl, getSnapPoint, getSnapPointInSphere, is3DFile, isPublishModeLocation, isRightClick, loadTexture, mergeScale } from "../../../../utils/util";
import { notification } from "antd";
import { Center, Image } from "@react-three/drei";
import EditorMenuHtml from "../editorMenuHtml/EditorMenuHtml";
import _ from 'lodash'
import DescriptionBoardHtml from "../descriptionBoardHtml/DescriptionBoardHtml";
import ProductIndicator from "../productIndicator/ProductIndicator";
import { getProductById } from "../../../../api/product.api";
import { useAppDispatch } from "../../../../redux";
import { findNodeOfTreeData, traverseTreeData } from "../../../../utils/treeData.util";
import Placeholder3D from "./components/placeholder3D/Placeholder3D";
import Placeholder2D from "./components/placeholder2D/Placeholder2D";

const Placeholder = ({
    item,
    onSelectObject = () => {},
    cameraControl,
    onChangePosition = () => {},
    snapPoints,
    onMeshCollision = () => {},
    stopMeshCollision = () => {},
    onChangeRotation = () => {},
    onShowObjectDetail = () => {},
    onCopy = () => {},
    onPaste = () => {},
    onDelete = () => {},
    onLock = () => {},
    onDuplicate = () => {}
}) => {
    const {id: projectId} = useParams()
    const clickTimeRef = useRef(0)
    const timeoutRef = useRef()
    let location = useLocation();
    const treeData = useSelector(getTreeData)

    const productRef = useRef()

    const [objectBox, setObjectBox] = useState()
    const { camera, gl, scene } = useThree();
    const [raycaster] = useState(new Raycaster());
    const indexVisible = useRef()
    const point = useRef()

    const position = useMemo(() => {
        return [item.position.x ?? 0, item.position.y ?? 0, item.position.z ?? 0]
    }, [item.position.x, item.position.y, item.position.z])
    const rotation = useMemo(() => {
        return [item.rotation.x ?? 0, item.rotation.y ?? 0, item.rotation.z ?? 0]
    }, [item.rotation.x, item.rotation.y, item.rotation.z])
    const [scale, setScale] = useState([1, 1, 1])

    const isAxesHelper = useMemo(() => { return _.get(item, ['axesHelper'], false) }, [item])

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

    const [isIntersectWithOrther, setIsIntersectWithOrther] = useState(false)

    const frameSize = useMemo(() => {
        return _.get(PLACEHOLDER_SIZES.find(el => el.value === item?.placeholderType), ['size'], 0.5)
    }, [item?.placeholderType])

    const isDecor = useMemo(() => { return isPreviewMode && (item.type === PRODUCT_TYPES.DECORATIVES || item.type === PRODUCT_TYPES.ELEMENT)}, [item, isPreviewMode])

    const selectedProductToShow = useMemo(() => {
        return  _.get(item, ['selectedProductToShow'], null)
    }, [item])

    const selectedProductToShowBlock = useMemo(() => {
        return  _.get(selectedProductToShow, ['block'], '')
    }, [selectedProductToShow])

    useEffect(() => {
        setScale(mergeScale(item?.scale, _.get(item, ['uniformScale'], 0)))
    }, [item])

    useEffect(() => {
        setScale(mergeScale(item?.scale, _.get(item, ['uniformScale'], 0)))
    }, [item?.scale?.x, item?.scale?.y, item?.scale?.z, item?.uniformScale])

    useEffect(() => {
        setObjectBox(new Box3().setFromObject(productRef.current))
    }, [scale])

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

    return <>
       <group
            position={position}
            rotation={rotation}
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
                    scale={scale}
                    name={`prod-${item.id}`}
                >
                    <Center top>
                        {
                            selectedProductToShow && 
                            <>
                                {
                                    selectedProductToShowBlock === MODEL_BLOCK["3D"] &&
                                    <Placeholder3D 
                                        selectedProductToShow={selectedProductToShow}
                                    />
                                }
                                {
                                    selectedProductToShowBlock === MODEL_BLOCK["2D"] &&
                                    <Placeholder2D 
                                        selectedProductToShow={selectedProductToShow}
                                    />
                                }
                            </>
                        }
                        {/* Cube bounding */}
                        {!isPreviewMode && <mesh>
                            <boxGeometry args={[frameSize, frameSize, frameSize]} />
                            <meshStandardMaterial opacity={0.2} transparent={true} side={DoubleSide} attach="material"/>
                        </mesh>}
                    </Center>
                </group>
            </Select>
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
        </group>
    </>
}

export default React.memo(Placeholder)