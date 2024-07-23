import { useThree } from "@react-three/fiber";
import { Suspense, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Vector2, Vector3, AudioListener, NoColorSpace, Color, Box3, Mesh, BoxGeometry, MeshBasicMaterial } from "three";
import { checkPointInCanvas, checkPointInCanvasWhenDragFromEditorSidebar, isManipulationEqual, findPointMouseRaycastWithScene, htmlDecode, is3DFile, isPublishModeLocation, loadAudio, uuidv4 } from "../../../../utils/util";
import Product from "../product/Product";
import { EffectComposer, Outline, Selection } from "@react-three/postprocessing";
import { KernelSize, BlendFunction, Resizer } from 'postprocessing'
import { useSelector } from "react-redux";
import { getAllProducts, getIsLoadedInitData, getIsObjectsLoaded, getIsPreviewModel, getIsShowDrawerObjectDetail, getIsViewerMode, getListPlaceholders, getListProducts, getListTexts, getObjectEditorMaterials, getSelectedObject, getStoreInfo, getTreeData, setAttributeOfPlaceholder, setAttributeOfProduct, setAttributeOfText, setIsLoadedInitData, setIsObjectsLoaded, setIsShowAutoSaving, setIsShowDrawerObjectDetail, setListPlaceholders, setListProducts, setListTexts, setObjectsLoadedPercent, setTreeData, syncDataOfTreeAndObjects } from "../../../../redux/modelSlice";
import { useLocation, useParams } from "react-router-dom";
import { getProjectById, updateProjectById } from "../../../../api/project.api";
import _ from "lodash"
import { CONFIG_TEXT, DEFAULT_CURRENCY, DEFAULT_MODEL_BLOCK, DRAG_FOLDER_BOX_NAME, EDITOR_MATERIAL_KEYS, MATERIAL_VALUE_TYPES, MODEL_BLOCK, PRODUCT_TYPES, TREE_DATA_NODE_TYPE, USER_ROLE } from "../../../../utils/constants";
import Picture from "../picture/Picture";
import { Html, TransformControls } from "@react-three/drei";
import DrawerObjectDetail from "../../../drawerObjectDetail/DrawerObjectDetail";
import MoreInfoModal from "../../../moreInfoModal/MoreInfoModal";
import { notification } from "antd";
import { getIsShowModalMoreInfo } from "../../../../redux/uiSlice";
import GroupTextView from "../groupTextView/GroupTextView";
import { useAppDispatch } from "../../../../redux";
import { getUser } from "../../../../redux/appSlice";
import { findNodeOfTreeData, initTreeDataForProject, loop, syncOffsetChangeFromGroupToProdAndText, traverseTreeData } from "../../../../utils/treeData.util";
import Placeholder from "../placeholder/Placeholder";
import usePermissions from "../../../../hook/usePermissions";

const ModelContainer = forwardRef(({
    onSelectObject = () => {},
    cameraControl,
    onAddToCart = () => {},
    snapPoints,
    container,
    onChangeIsShowModalMoreInfo = () => {},
}, ref) => {
    const dispatch = useAppDispatch()
    const location = useLocation()
    const {id: projectId, editorRole} = useParams()
    const firstUpdate = useRef(true)
    const outlinePassRef = useRef()
    const listProducts = useSelector(getListProducts)
    const isObjectsLoaded = useSelector(getIsObjectsLoaded)

    const list3DItems = useMemo(() => {
        return listProducts.filter(item => !item.block || item.block === MODEL_BLOCK["3D"])
    }, [listProducts])

    const list2DItems = useMemo(() => {
        return listProducts.filter(item => item.block && item.block === MODEL_BLOCK["2D"])
    }, [listProducts])

    const listTexts = useSelector(getListTexts)
    const listPlaceholders = useSelector(getListPlaceholders)
    const treeData = useSelector(getTreeData)
    const { camera, gl, scene, raycaster } = useThree();
    window.camera = camera
    window.scene = scene
    window.gl = gl;

    const timeoutRef = useRef()
    const timeoutManipulationRef = useRef()

    const selectedObject = useSelector(getSelectedObject)
    const isLoadedInitData = useSelector(getIsLoadedInitData)
    const isPreviewMode = useSelector(getIsPreviewModel)

    const [listener] = useState(new AudioListener());

    const theOpenMenuSound = useRef()
    const theCloseMenuSound = useRef()

    const theClickSound = useRef()
    const theAddToCartSound = useRef()
    const theWalkSound = useRef()
    const theMouseSound = useRef()
    const theMeshCollisionSound = useRef()
    const [listPrevManipulations, setListPrevManipulations] = useState([])
    const [listNextManipulations, setListNextManipulations] = useState([])
    const [isAnyMeshCollision, setIsAnyMeshCollision] = useState(false)

    const isShowModalMoreInfo = useSelector(getIsShowModalMoreInfo)
    const [selectedProductDetail, setSelectedProductDetail] = useState({})
    const shouldUpdateMaterial = useRef(false)
    const isViewerMode = useSelector(getIsViewerMode)

    const isShowDrawerObjectDetail = useSelector(getIsShowDrawerObjectDetail)

    const user = useSelector(getUser)
    const storeInfo = useSelector(getStoreInfo)

    const objectEditorMaterials = useSelector(getObjectEditorMaterials)

    const allProducts = useSelector(getAllProducts)

    const transformRef = useRef()

    const {isStaff, staffOwnerId} = usePermissions()

    const isUserCanEditStore = useMemo(() => {
        if(editorRole === USER_ROLE.RETAILERS){
            if(user?.id === storeInfo?.createdBy || (isStaff && staffOwnerId === storeInfo?.createdBy)){
                return true
            }
        } else {
            return false
        }

        return false
    }, [user, storeInfo, isStaff, staffOwnerId])

    useEffect(() => {
        if(isLoadedInitData && listProducts.length === 0){
            dispatch(setIsObjectsLoaded(true))
            dispatch(setObjectsLoadedPercent(100))
        }
    }, [listProducts, isLoadedInitData])

    useEffect(() => {
        loadAudio(`${process.env.REACT_APP_HOMEPAGE}/musics/Menu 01 Open.wav`, (audioBuffer) => {
            onSetTheSound(theOpenMenuSound, audioBuffer)
        })
        loadAudio(`${process.env.REACT_APP_HOMEPAGE}/musics/Menu 02 Close.wav`, (audioBuffer) => {
            onSetTheSound(theCloseMenuSound, audioBuffer)
        })
        loadAudio(`${process.env.REACT_APP_HOMEPAGE}/musics/Select Itemwav.wav`, (audioBuffer) => {
            onSetTheSound(theClickSound, audioBuffer)
        })
        loadAudio(`${process.env.REACT_APP_HOMEPAGE}/musics/Add to cart.wav`, (audioBuffer) => {
            onSetTheSound(theAddToCartSound, audioBuffer)
        })
        loadAudio(`${process.env.REACT_APP_HOMEPAGE}/musics/Footsteps.wav`, (audioBuffer) => {
            onSetTheSound(theWalkSound, audioBuffer, true)
        })
        loadAudio(`${process.env.REACT_APP_HOMEPAGE}/musics/Audio_MouseInteraction.mp3`, (audioBuffer) => {
            onSetTheSound(theMouseSound, audioBuffer)
        })
        loadAudio(`${process.env.REACT_APP_HOMEPAGE}/musics/Overlapp object _ Play Once.wav`, (audioBuffer) => {
            onSetTheSound(theMeshCollisionSound, audioBuffer)
        })

        return () => {
            dispatch(setIsObjectsLoaded(false))
        }
    }, [])

    const onSetAttributeForProductAndText = useCallback((selectedId, attribute, value) => {
        if(!_.isNil(selectedId) && !_.isNil(attribute)) {
            const prod = listProducts.find(el => el.id === selectedId)
            if(prod){
                dispatch(setAttributeOfProduct({
                    attribute: attribute,
                    value: value,
                    id: selectedId
                }))
                onResetListNextManipulations()
            }
            const text = listTexts.find(el => el.id === selectedId)
            if(text){
                dispatch(setAttributeOfText({
                    attribute: attribute,
                    value: value,
                    id: selectedId
                }))
            }

            const placeholder = listPlaceholders.find(el => el.id === selectedId)
            if(placeholder){
                dispatch(setAttributeOfPlaceholder({
                    attribute: attribute,
                    value: value,
                    id: selectedId
                }))
            }
        }
    }, [listTexts, listProducts, listPlaceholders])

    const onTreeDataGroupChange = useCallback((id, data) => {
        const cloneTreeData = _.cloneDeep(treeData);
        let node = findNodeOfTreeData(cloneTreeData, id)
        if(node && _.get(node, ['nodeType']) === TREE_DATA_NODE_TYPE.FOLDER){
            const nodeClone = _.cloneDeep(node)

            const newNode = {
                ...nodeClone,
                ...data
            }

            const changeOfNode = {
                position: {
                    x: _.get(newNode, ['position', 'x'], 0) - _.get(nodeClone, ['position', 'x'], 0),
                    y: _.get(newNode, ['position', 'y'], 0) - _.get(nodeClone, ['position', 'y'], 0),
                    z: _.get(newNode, ['position', 'z'], 0) - _.get(nodeClone, ['position', 'z'], 0)
                },
                rotation: {
                    x: _.get(newNode, ['rotation', 'x'], 0) - _.get(nodeClone, ['rotation', 'x'], 0),
                    y: _.get(newNode, ['rotation', 'y'], 0) - _.get(nodeClone, ['rotation', 'y'], 0),
                    z: _.get(newNode, ['rotation', 'z'], 0) - _.get(nodeClone, ['rotation', 'z'], 0)
                },
                scale: {
                    x: _.get(newNode, ['scale', 'x'], 0) - _.get(nodeClone, ['scale', 'x'], 0),
                    y: _.get(newNode, ['scale', 'y'], 0) - _.get(nodeClone, ['scale', 'y'], 0),
                    z: _.get(newNode, ['scale', 'z'], 0) - _.get(nodeClone, ['scale', 'z'], 0)
                },
                uniformScale: _.get(newNode, ['uniformScale'], 0) - _.get(nodeClone, ['uniformScale'], 0)
            }
   
            loop(cloneTreeData, id, (_item, index, arr) => {
                Object.keys(data).forEach(key => {
                    _item[key] = data[key]
                })
            })
            
            const {
                newListProducts,
                newListTexts,
                newListPlaceholders
            } = syncOffsetChangeFromGroupToProdAndText(cloneTreeData, id, changeOfNode, listProducts, listTexts, listPlaceholders)

            dispatch(syncDataOfTreeAndObjects({
                treeData: cloneTreeData,
                listProducts: newListProducts,
                listTexts: newListTexts,
                listPlaceholders: newListPlaceholders
            }))
        }
    }, [treeData, listProducts, listTexts, listPlaceholders])

    const onChangePosition = useCallback((id, pos) => {
        const node = findNodeOfTreeData(treeData, id)
        if(node && _.get(node, ['nodeType']) === TREE_DATA_NODE_TYPE.FOLDER) {
            onTreeDataGroupChange(id, {position: vector3ToJson(pos)})
        } else {
            onSetAttributeForProductAndText(id, 'position', vector3ToJson(pos))
        }
    }, [onSetAttributeForProductAndText, treeData, onTreeDataGroupChange])

    useEffect(() => {
        if (transformRef.current) {
          const controls = transformRef.current

          const changeCallback = event => {
            if(selectedObject) {
                const object = event.target.object
                if(object) {
                    object.userData.isDragging = true
                    if(object.userData.isFolder) {
                        const node = findNodeOfTreeData(treeData, selectedObject)

                        if(node && node.nodeType === TREE_DATA_NODE_TYPE.FOLDER) {
                            const translate = new Vector3(
                                object.position.x - _.get(object, ['userData', 'lastPosition', 'x'], 0),
                                object.position.y - _.get(object, ['userData', 'lastPosition', 'y'], 0),
                                object.position.z - _.get(object, ['userData', 'lastPosition', 'z'], 0)
                            )

                            const keys = traverseTreeData([], node)
                            console.log(keys,'KEYYYYYY')

                            keys.forEach(key => {
                                const childObject = scene.children.find(el => el.userData?.id === key)
                                if(childObject) {
                                    childObject.position.copy(childObject.position.add(translate))
                                }
                            })

                            object.userData.lastPosition = object.position.clone()
                        }
                    }
                }
            }
          }

          const callback = event => {
            if(cameraControl.current && cameraControl.current.cameraRef()){
                let cameraRef = cameraControl.current.cameraRef()
                cameraRef.enabled = !event.value;
                cameraRef.saveState();
            }
          }

          const mouseUpCallback = event => {
            stopMeshCollisionSound()

            if(selectedObject) {
                const object = event.target.object
                if(object) {
                    object.userData.isDragging = false
                    if(object.userData.isFolder) {
                        const translate = new Vector3(
                            object.position.x - _.get(object, ['userData', 'origin', 'x'], 0),
                            object.position.y - _.get(object, ['userData', 'origin', 'y'], 0),
                            object.position.z - _.get(object, ['userData', 'origin', 'z'], 0)
                        )
                        const newPosition = new Vector3(
                            _.get(object, ['userData', 'nodePosition', 'x'], 0),
                            _.get(object, ['userData', 'nodePosition', 'y'], 0),
                            _.get(object, ['userData', 'nodePosition', 'z'], 0)
                        ).add(translate)

                        // Update data when drag end
                        onChangePosition(selectedObject, vector3ToJson(newPosition))
                    } else {
                        // Update data when drag end
                        onChangePosition(selectedObject, vector3ToJson(object.position))
                    }
                }
            }
          }

          controls.addEventListener("dragging-changed", callback)
          controls.addEventListener("mouseUp", mouseUpCallback)
          controls.addEventListener("change", changeCallback)
          return () => {
            controls.removeEventListener("dragging-changed", callback)
            controls.removeEventListener("mouseUp", mouseUpCallback)
            controls.removeEventListener("change", changeCallback)
          }
        }
    }, [cameraControl, isPreviewMode, selectedObject, list3DItems, treeData, onChangePosition, scene])

    useEffect(() => {
        // Handle transform control axis
        if(transformRef.current) {
            if(!isPreviewMode) {
                const node = findNodeOfTreeData(treeData, selectedObject)
                if(node && _.get(node, ['nodeType']) === TREE_DATA_NODE_TYPE.FOLDER) {
                    const keys = traverseTreeData([], node)
                    const box = new Box3()
                    keys.forEach(key => {
                        const object = scene.children.find(el => el.userData?.id === key)
                        if(object) {
                            box.expandByObject(object)
                        }
                    })
                    const center = box.getCenter(new Vector3())
                    
                    let dragBox = scene.getObjectByName(DRAG_FOLDER_BOX_NAME)
                    if(dragBox) {
                        dragBox.position.copy(center)
                        dragBox.userData = {
                            origin: center,
                            lastPosition: center,
                            isFolder: true,
                            nodePosition: node.position
                        }
                    } else {
                        dragBox = new Mesh(new BoxGeometry(0.01, 0.01, 0.01), new MeshBasicMaterial({color: new Color("#FFFFFF")}))
                        dragBox.position.copy(center)
                        dragBox.userData = {
                            origin: center,
                            lastPosition: center,
                            isFolder: true,
                            nodePosition: node.position
                        }
                        dragBox.name = DRAG_FOLDER_BOX_NAME
                        scene.add(dragBox)
                    }

                    transformRef.current.attach(dragBox)
                } else {
                    let item = _.find(listProducts, {id: selectedObject})
                    if(!item){
                        item = _.find(listTexts, {id: selectedObject})
                    }
                    if(!item){
                        item = _.find(listPlaceholders, {id: selectedObject})
                    }
                    if(item && !_.get(item, ['isLock'], false) && _.get(item, ['axesHelper'], false)){
                        const object = scene.children.find(el => el.userData?.id === item.id)
                        if(object) {
                            transformRef.current.attach(object)
                            removeDragBox()
                        } else {
                            transformRef.current.detach()
                            removeDragBox()
                        }
                    } else {
                        transformRef.current.detach()
                        removeDragBox()
                    }
                }
            } else {
                transformRef.current.detach()
            }
        }

        // Disappear drawer object detail
        if(!selectedObject){
            outlinePassRef.current.clearSelection()
            dispatch(setIsShowDrawerObjectDetail(false))
        }
    }, [selectedObject, isPreviewMode, listProducts, listTexts, listPlaceholders, scene, treeData])

    useEffect(() => {
        const detail = _.find(listProducts, (el) => el.id === selectedObject)
        if(detail){
            setSelectedProductDetail(_.cloneDeep(detail))
        }
    },[selectedObject, listProducts])

    const mouseEventRef = useRef({
        clientX: 0,
        clientY: 0
    })

    const objectsLoaderStatus = useRef([])

    const removeDragBox = () => {
        let dragBox = scene.getObjectByName(DRAG_FOLDER_BOX_NAME)
        if(dragBox) {
            scene.remove(dragBox)
        }
    }

    const handleRevertManipulation = useCallback(() => {
        let oldList = _.cloneDeep({
            listProducts,
            listTexts,
            treeData,
            listPlaceholders
        })
        let newList = _.cloneDeep(listPrevManipulations)

        let data = newList.pop();

        while(data && newList.length > 0 && isManipulationEqual(data, oldList)){
            data = newList.pop();
        }

        if(data && !isManipulationEqual(data, oldList)){
            setListPrevManipulations(newList);

            dispatch(setListProducts(data.listProducts || []));
            dispatch(setListTexts(data.listTexts || []));
            dispatch(setTreeData(data.treeData || []));
            dispatch(setListPlaceholders(data.listPlaceholders || []));

            if(listNextManipulations.length === 0 || !isManipulationEqual(listNextManipulations[listNextManipulations.length - 1], oldList)){
                const listNexts = _.cloneDeep(listNextManipulations)
                listNexts.push(oldList)
                setListNextManipulations(listNexts);
            }
        } else {
            setListPrevManipulations(newList)
        }
    }, [dispatch, listNextManipulations, listPlaceholders, listPrevManipulations, listProducts, listTexts, treeData])

    const handleNextManipulation = useCallback(() => {
        let oldList = _.cloneDeep({
            listProducts,
            listTexts,
            treeData,
            listPlaceholders
        })
        let newList = _.cloneDeep(listNextManipulations)

        let data = newList.pop();

        while(data && newList.length > 0 && isManipulationEqual(data, oldList)){
            data = newList.pop();
        }

        if(data && !isManipulationEqual(data, oldList)){
            setListNextManipulations(newList);

            dispatch(setListProducts(data.listProducts || []));
            dispatch(setListTexts(data.listTexts || []));
            dispatch(setTreeData(data.treeData || []));
            dispatch(setListPlaceholders(data.listPlaceholders || []));

            if(listPrevManipulations.length === 0 || !isManipulationEqual(listPrevManipulations[listPrevManipulations.length - 1], oldList)){
                const listPrevs = _.cloneDeep(listPrevManipulations)
                listPrevs.push(oldList)
                setListPrevManipulations(listPrevs);
            }
        } else {
            setListNextManipulations(newList)
        }
    }, [dispatch, listNextManipulations, listPlaceholders, listPrevManipulations, listProducts, listTexts, treeData])

    const handleKeyDown = useCallback((e) => {
        const prod = listProducts.find(el => el.id === selectedObject)
        const text = listTexts.find(el => el.id === selectedObject)
        const placeholder = listPlaceholders.find(el => el.id === selectedObject)
        if((e.target?.tagName === "BODY" || (e.target?.tagName === "DIV" && !e.target.classList.contains('ck'))) && !isPublishModeLocation(location) && !isPreviewMode){
            if(selectedObject) {
                if(e.code === "KeyQ" || e.code === "KeyE"){
                    playMouseInteractionSound()
                    if(prod){
                        const oldRot = _.get(_.find(listProducts, el => el.id === selectedObject), ['rotation'], {x: 0, y: 0, z: 0})
                        dispatch(setAttributeOfProduct({
                            attribute: 'rotation',
                            value: {x: oldRot.x, y: oldRot.y + (e.code === "KeyQ" ? Math.PI / 4 : - Math.PI / 4), z: oldRot.z},
                            id: selectedObject
                        }))
                        onResetListNextManipulations()
                    }
                    if(text){
                        const oldRot = _.get(_.find(listTexts, el => el.id === selectedObject), ['rotation'], {x: 0, y: 0, z: 0})
                        dispatch(setAttributeOfText({
                            attribute: 'rotation',
                            value: {x: oldRot.x, y: oldRot.y + (e.code === "KeyQ" ? Math.PI / 4 : - Math.PI / 4), z: oldRot.z},
                            id: selectedObject
                        }))
                    }
                    if(placeholder){
                        const oldRot = _.get(_.find(listPlaceholders, el => el.id === selectedObject), ['rotation'], {x: 0, y: 0, z: 0})
                        dispatch(setAttributeOfPlaceholder({
                            attribute: 'rotation',
                            value: {x: oldRot.x, y: oldRot.y + (e.code === "KeyQ" ? Math.PI / 4 : - Math.PI / 4), z: oldRot.z},
                            id: selectedObject
                        }))
                    }
                }
                if(e.code === "Backspace" || e.code === "Delete"){
                    handleDeleteObject()
                }
                if(e.code === "KeyI"){
                    dispatch(setIsShowDrawerObjectDetail(!isShowDrawerObjectDetail))
                }
                if(e.code === "KeyC" && (e.ctrlKey || e.metaKey)){
                    onCopy()
                }
            }
            
            if(e.code === "KeyV" && (e.ctrlKey || e.metaKey)){
                onPaste()
            }
        }
        if(selectedObject && (e.target?.tagName === "BODY" || (e.target?.tagName === "DIV" && !e.target.classList.contains('ck'))) && !isPreviewMode){
            if(e.code === "Escape"){
                onSelectObject("")
            }
        }
        if(!isPublishModeLocation(location) && e.target?.tagName === "BODY" && !isPreviewMode){
            if(e.code === "KeyZ" && (e.ctrlKey || e.metaKey)){
                playMouseInteractionSound()
                handleRevertManipulation()
            }
            if((e.code === "KeyY" && (e.ctrlKey || e.metaKey)) || ( e.code === "KeyZ" && (e.metaKey || e.shiftKey))){
                playMouseInteractionSound()
                handleNextManipulation()
            }
        }
    }, [isPreviewMode, isShowDrawerObjectDetail, listProducts, listTexts, location, onSelectObject, selectedObject, listPlaceholders, handleRevertManipulation, handleNextManipulation])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)
        // Pointer move only used for Ctrl V
        if(!isPreviewMode){
            document.addEventListener("pointermove", handleMouseMove)
        }
        document.addEventListener("pointerdown", handlePointerDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.removeEventListener("pointermove", handleMouseMove)
            document.removeEventListener("pointerdown", handlePointerDown)
        }
    }, [selectedObject, listProducts, listPrevManipulations, listNextManipulations, isPreviewMode, handleKeyDown])

    const onSetTheSound = (ref, buffer, loop = false) => {
        const debounce = _.debounce(() => {
            if(ref.current){
                ref.current.setBuffer(buffer);
                ref.current.setLoop(loop);
                ref.current.autoplay = false;
                ref.current.setVolume(1);
            } else {
                onSetTheSound(ref, buffer, loop)
            }
        }, 500)

        debounce()
    }

    useEffect(() => {
        fetchProjectData()
    }, [projectId])

    const handleSaveManipulations = useCallback(() => {
        if(isPublishModeLocation(location)){
            return
        }

        const newList = _.cloneDeep(listPrevManipulations)
        const prevStep = _.cloneDeep({
            listProducts,
            listTexts,
            treeData,
            listPlaceholders
        })
        if(listNextManipulations.length > 0 && isManipulationEqual(listNextManipulations[listNextManipulations.length - 1], prevStep)){
            return
        }
        newList.push(prevStep)
        setListPrevManipulations(newList)
    }, [listPlaceholders, listPrevManipulations, listNextManipulations, listProducts, listTexts, location, treeData])

    useEffect(() => {
        if(isLoadedInitData 
            && (
                listPrevManipulations.length === 0
                || !isManipulationEqual(listPrevManipulations[listPrevManipulations.length - 1], {
                    listProducts,
                    listTexts,
                    treeData,
                    listPlaceholders
                })
            
            )
        ) {
            if(timeoutManipulationRef.current) {
                clearTimeout(timeoutManipulationRef.current)
            }

            timeoutManipulationRef.current = setTimeout(() => {
                handleSaveManipulations()
            }, 300);
        }
    }, [listProducts, listTexts, treeData, listPlaceholders, isLoadedInitData, listPrevManipulations, handleSaveManipulations])

    useEffect(() => {
        if(isLoadedInitData){
            handleUpdateProjectProducts()
        }
    }, [listProducts, listTexts, treeData, isLoadedInitData])

    // useEffect(() => {
    //     handleUpdateProjectMaterials()
    // }, [elementMaterials])

    const onUpdateListProducts = (newListProducts, isResetNextManipulation) => {
        dispatch(setListProducts(newListProducts));
        if(isResetNextManipulation){
            onResetListNextManipulations()
        }
    }

    const onResetListNextManipulations = () => {
        setListNextManipulations([])
    }

    const onUpdateListTexts = (newListTexts, isResetNextManipulation) => {
        dispatch(setListTexts(newListTexts))
        if(isResetNextManipulation){
            onResetListNextManipulations()
        }
    }

    const onUpdateListPlaceholders = (newListPlaceholders, isResetNextManipulation) => {
        dispatch(setListPlaceholders(newListPlaceholders))
        if(isResetNextManipulation){
            onResetListNextManipulations()
        }
    }

    const handleMouseMove = (event) => {
        const x = event.clientX
        const y = event.clientY

        mouseEventRef.current = {
            clientX: x,
            clientY: y
        }
    }
    const onObjectLoaded = useCallback((id) => {
        objectsLoaderStatus.current[id] = true;
        if(isLoadedInitData && listProducts.length === 0) {
            dispatch(setIsObjectsLoaded(true))
            dispatch(setObjectsLoadedPercent(100))
        }
        if(!_.some(listProducts, el => !objectsLoaderStatus.current[el.id] )){
            dispatch(setIsObjectsLoaded(true))
            dispatch(setObjectsLoadedPercent(100))
        } else {
            dispatch(setIsObjectsLoaded(false))
            dispatch(setObjectsLoadedPercent(
                listProducts.filter(el => objectsLoaderStatus.current[el.id]).length / listProducts.length * 100
            ))
        }
    }, [listProducts, isObjectsLoaded, isLoadedInitData])

    const handleUpdateProjectProducts = () => {
        if(isPublishModeLocation(location)){
            dispatch(setIsShowAutoSaving(false))
            return
        }
        if(firstUpdate.current){
            firstUpdate.current = false;
            dispatch(setIsShowAutoSaving(false))
            return
        }
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }
        if(editorRole === USER_ROLE.ADMIN || isViewerMode){
            dispatch(setIsShowAutoSaving(false))
            return
        }
        if(!isUserCanEditStore){
            dispatch(setIsShowAutoSaving(false))
            return
        }
        // Only auto save if retailer edit their store
        // Admin edit store, save data to local and save when admin click in save as teamplate
        dispatch(setIsShowAutoSaving(true))
        timeoutRef.current = setTimeout(() => {
            let data = {
                listProducts: _.cloneDeep(listProducts),
                listTexts: _.cloneDeep(listTexts),
                treeData: _.cloneDeep(treeData)
            }
            if(projectId !== 'unsaved'){
                updateProjectById(projectId, data).then(data => {
                    dispatch(setIsShowAutoSaving(false))
                }).catch(err => {
                    notification.error({
                        message: _.get(err, ['response', 'data', 'message'], "An error occurred during saving.")
                    })
                })
            }
        }, 1000)
    }

    const fetchProjectData = (isGetProducts = true, isGetTexts = true, resetManipulation = true) => {
        getProjectById(projectId, isPublishModeLocation(location)).then(data => {
            // Handle init tree view
            if(_.has(data, ['treeData']) && _.get(data, ['treeData', 'length'], 0) > 0){
                dispatch(setTreeData(_.get(data, ['treeData'])))
            } else {
                dispatch(setTreeData(initTreeDataForProject(data)))
            }
            if(isGetProducts){
                data.listProducts = data.listProducts.map(el => {
                    if(el.gallery && el.gallery){
                        el.gallery = el.gallery.map(o => {
                            if(!o.id){
                                o.id = uuidv4()
                            }
                            return o
                        })
                    }
                    if(el.description){
                        el.description = htmlDecode(el.description)
                    }
                    return el
                })
                // if(isShopifyEmbedded()){
                //     let prods = _.cloneDeep(data.listProducts || [])
                //     prods = prods.filter(el => {
                //         return el.type != PRODUCT_TYPES.PRODUCTS || 
                //             (el.type == PRODUCT_TYPES.PRODUCTS && (el.useThirdPartyCheckout || _.get(el, ['cartType'], CART_TYPES.METADROB_CART) == CART_TYPES.SHOPIFY_CART) && el.shopifyVariantMerchandiseId)
                //     })
                //     onUpdateListProducts(prods, true)
                // } else {
                onUpdateListProducts(_.cloneDeep(data.listProducts || []), true)
                // }
            }
            if(isGetTexts){
                onUpdateListTexts(_.cloneDeep(data.listTexts || []), true)
            }
            if(resetManipulation){
                setListPrevManipulations([])
            }

            dispatch(setIsLoadedInitData(true))
        }).catch(err => {

        })
    }

    const handlePointerDown = (e) => {
        //Handle unselect 
        if(e.target.tagName !== "CANVAS"){
            return
        }
        //Handle unselect 
        if(checkPointInCanvas(e, gl)){
            const event = e
            const rect = gl.domElement.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            let canvasPointer = new Vector2()
            canvasPointer.x = ( x / gl.domElement.clientWidth ) *  2 - 1;
            canvasPointer.y = ( y / gl.domElement.clientHeight) * - 2 + 1
            raycaster.setFromCamera(canvasPointer, camera);

            if(scene){
                let intersects = raycaster.intersectObjects([...scene.children.filter(el => el.userData?.id || el.isTransformControls)], true);

                const intersect = _.find(intersects, el => !_.isNil(el.face) && !_.isNil(el.faceIndex) && !el.object.isTransformControlsPlane)
                if(!intersect){
                    onSelectObject("")
                }
            }
        }
    }

    const playMouseInteractionSound = () => {
        if(theMouseSound.current){
            theMouseSound.current.stop();
            theMouseSound.current.play();
        }
    }

    const vector3ToJson = (v) => {
        return {x: v.x, y: v.y, z: v.z}
    }

    const handleDragEnd = useCallback((e, el) => {
        if(checkPointInCanvasWhenDragFromEditorSidebar(e, gl)){
            let point = findPointMouseRaycastWithScene(e, gl, raycaster, camera, scene, el, snapPoints);
            if(point) {
                let newObjectUuid = uuidv4();
                if(el.type !== PRODUCT_TYPES.TEXT && el.type !== PRODUCT_TYPES.PLACEHOLDER){
                    const newProductAdded = {
                        ...el,
                        id: newObjectUuid,
                        selectedGalleryId: newObjectUuid,
                        url: _.get(el, 'objectUrl', ''),
                        position: vector3ToJson(point),
                        rotation: vector3ToJson(new Vector3(0, 0, 0)),
                        scale: vector3ToJson(new Vector3(1, 1, 1)),
                        type: _.get(el, 'type', ''),
                        objectId: el._id ? el._id : el.id,
                        description: htmlDecode(_.get(el, 'description', '')),
                        price: _.get(el, 'price', 0),
                        lastPrice: _.get(el, 'price', 0) - _.get(el, 'price', 0) * (_.get(el, 'discount', 0) / 100),
                        name: _.get(el, 'name', ''),
                        displayCurrency: _.get(el, 'displayCurrency', '') || DEFAULT_CURRENCY,
                        block: _.get(el, 'block', '') ? _.get(el, 'block', '') : DEFAULT_MODEL_BLOCK,
                        axesHelper: false,
                    }

                    let gallery = null
                    gallery = {
                        [newProductAdded.block === MODEL_BLOCK["3D"] ? 'object' : 'image']: _.get(el, 'objectUrl', ''),
                        thumnail: _.get(el, 'image', ''),
                        assetId: null,
                        id: newObjectUuid
                    }

                    if(gallery){
                        if(el.type === PRODUCT_TYPES.DECORATIVES){
                            const decorativeMaterial = _.get(el, ['attributes', 'decorativeMaterial'], null)

                            if(decorativeMaterial){
                                _.set(gallery, ['materials'], decorativeMaterial)
                            }
                        }
                        newProductAdded.gallery = [gallery, ..._.get(newProductAdded, ['gallery'], [])]
                    }

                    if(newProductAdded.gallery){
                        newProductAdded.gallery.map(el => {
                            if(!el.id){
                                el.id = uuidv4()
                            }
                            return el
                        })
                    }

                    onUpdateListProducts([
                        ...listProducts,
                        newProductAdded
                    ], true)
                } else if(el.type === PRODUCT_TYPES.TEXT){
                    onUpdateListTexts([
                        ...listTexts,
                        {
                            ...el,
                            id: newObjectUuid,
                            position: vector3ToJson(point),
                            rotation: vector3ToJson(new Vector3(0, 0, 0)),
                            scale: vector3ToJson(new Vector3(1, 1, 1)),
                            axesHelper: false,
                        }
                    ])
                } else if(el.type === PRODUCT_TYPES.PLACEHOLDER){
                    let selectedProductToShow = null
                    const includedCategoriesIds = _.get(el, ['includedCategoriesIds'], [])
                    const filterProducts = allProducts.filter(el => includedCategoriesIds.includes(el.categoryId))
                    if(filterProducts.length > 0){
                        selectedProductToShow = filterProducts[Math.floor(Math.random() * filterProducts.length)]
                    }

                    onUpdateListPlaceholders([
                        ...listPlaceholders,
                        {
                            image: _.get(el, ['image']),
                            id: newObjectUuid,
                            position: vector3ToJson(point),
                            rotation: vector3ToJson(new Vector3(0, 0, 0)),
                            scale: vector3ToJson(new Vector3(1, 1, 1)),
                            selectedGalleryId: newObjectUuid,
                            objectId: el._id ? el._id : el.id,
                            description: htmlDecode(_.get(el, 'description', '')),
                            name: _.get(el, 'name', ''),
                            placeholderType: _.get(el, 'placeholderType', 1),
                            isLock: false,
                            includedCategoriesIds: _.get(el, ['includedCategoriesIds'], []),
                            selectedProductToShow: selectedProductToShow,
                            axesHelper: false,
                        }
                    ])
                }
                
                onSelectObject(newObjectUuid);
            }
        }
    },[camera, gl, listProducts, listTexts, listPlaceholders, allProducts, onSelectObject, raycaster, scene, snapPoints])

    const onDelete = () => {
        handleDeleteObject()
        // Modal.confirm({
        //     title: "Are you sure to delete object?",
        //     centered: true,
        //     className: "dialog-confirm",
        //     onOk: () => {
        //         handleDeleteObject()
        //     }
        // })
    }

    const onLock = () => {
        const id = selectedObject
        const prod = listProducts.find(el => el.id === id)
        if(prod){
            const oldLock = _.get(_.find(listProducts, el => el.id === id), ['isLock'], false)
            dispatch(setAttributeOfProduct({
                attribute: 'isLock',
                value: !oldLock,
                id: id
            }))
            onResetListNextManipulations()
        }
        const text = listTexts.find(el => el.id === id)
        if(text){
            const oldLock = _.get(_.find(listTexts, el => el.id === id), ['isLock'], false)
            dispatch(setAttributeOfText({
                attribute: 'isLock',
                value: !oldLock,
                id: id
            }))
        }

        const placeholder = listPlaceholders.find(el => el.id === id)
        if(placeholder){
            const oldLock = _.get(_.find(listPlaceholders, el => el.id === id), ['isLock'], false)
            dispatch(setAttributeOfPlaceholder({
                attribute: 'isLock',
                value: !oldLock,
                id: id
            }))
        }
    }

    const handleDeleteObject = () => {
        const prod = listProducts.find(el => el.id === selectedObject)
        const text = listTexts.find(el => el.id === selectedObject)
        const placeholder = listPlaceholders.find(el => el.id === selectedObject)

        notification.success({
            message: CONFIG_TEXT.DELETED_SUCCESSFULLY
        })
        playMouseInteractionSound()
        if(prod){
            // onUpdateElementMaterialsAfterDeleteObject(_.cloneDeep(listProducts).filter(el => el.id !== selectedObject))
            onUpdateListProducts(listProducts.filter(el => el.id !== selectedObject), true)
        }
        if(text){
            onUpdateListTexts(listTexts.filter(el => el.id !== selectedObject), true)
        }

        if(placeholder){
            onUpdateListPlaceholders(listPlaceholders.filter(el => el.id !== selectedObject), true)
        }
        
        onSelectObject("")
    }

    const onDuplicate = () => {
        onCopy()
        onPaste(true)
    }

    const onCopy = () => {
        playMouseInteractionSound()
        let text = JSON.stringify({id: selectedObject})
        navigator.clipboard.writeText(text)
    }

    const onPaste = (autoPickPosition = false) => {
        playMouseInteractionSound()
        navigator.clipboard.readText().then(
            (text) => {
                if(text){
                    let json = JSON.parse(text)
                    if(typeof json === "object" && json.id){    
                        let cloneObject = listProducts.find(el => el.id === json.id);
                        if(cloneObject){
                            let point = new Vector3(0, 0, 0)
                            if(autoPickPosition){
                                point = new Vector3(cloneObject.position.x - 1, cloneObject.position.y, cloneObject.position.z)
                            } else {
                                point = findPointMouseRaycastWithScene(mouseEventRef.current, gl, raycaster, camera, scene, cloneObject, snapPoints);
                            }
                           
                            if(cloneObject && point){
                                onUpdateListProducts([
                                    ...listProducts,
                                    {
                                        ..._.cloneDeep(cloneObject),
                                        id: uuidv4(),
                                        position: vector3ToJson(point)
                                    }
                                ], true)
                            }
                        }
                        
                        cloneObject = listTexts.find(el => el.id === json.id);
                        if(cloneObject){
                            let point = new Vector3(0, 0, 0)
                            if(autoPickPosition){
                                point = new Vector3(cloneObject.position.x - 1.5, cloneObject.position.y, cloneObject.position.z)
                            } else {
                                point = findPointMouseRaycastWithScene(mouseEventRef.current, gl, raycaster, camera, scene, cloneObject, snapPoints);
                            }
                            if(cloneObject && point){
                                onUpdateListTexts([
                                    ...listTexts,
                                    {
                                        ..._.cloneDeep(cloneObject),
                                        id: uuidv4(),
                                        position: vector3ToJson(point)
                                    },
                                ], true)
                            }
                        }

                        cloneObject = listPlaceholders.find(el => el.id === json.id);
                        if(cloneObject){
                            let point = new Vector3(0, 0, 0)
                            if(autoPickPosition){
                                point = new Vector3(cloneObject.position.x - 1.5, cloneObject.position.y, cloneObject.position.z)
                            } else {
                                point = findPointMouseRaycastWithScene(mouseEventRef.current, gl, raycaster, camera, scene, cloneObject, snapPoints);
                            }
                            if(cloneObject && point){
                                onUpdateListPlaceholders([
                                    ...listPlaceholders,
                                    {
                                        ..._.cloneDeep(cloneObject),
                                        id: uuidv4(),
                                        position: vector3ToJson(point)
                                    },
                                ], true)
                            }
                        }
                    }
                }
            }
        );
    }

    const onChangeRotation = useCallback((id, rot) => {
        const node = findNodeOfTreeData(treeData, id)
        if(node && _.get(node, ['nodeType']) === TREE_DATA_NODE_TYPE.FOLDER) {
            onTreeDataGroupChange(id, {rotation: vector3ToJson(rot)})
        } else {
            onSetAttributeForProductAndText(id, 'rotation', vector3ToJson(rot))
        }
    }, [onSetAttributeForProductAndText, treeData, onTreeDataGroupChange])

    const onChangeUniformScale = useCallback((id, uni) => {
        const node = findNodeOfTreeData(treeData, id)
        if(node && _.get(node, ['nodeType']) === TREE_DATA_NODE_TYPE.FOLDER) {
            onTreeDataGroupChange(id, {uniformScale: uni})
        } else {
            onSetAttributeForProductAndText(id, 'uniformScale', uni)
        }
    }, [onSetAttributeForProductAndText, treeData, onTreeDataGroupChange])

    const onChangeAxesHelper = useCallback((id, value) => {
        const node = findNodeOfTreeData(treeData, id)
        if(node && _.get(node, ['nodeType']) === TREE_DATA_NODE_TYPE.FOLDER) {
            onTreeDataGroupChange(id, {axesHelper: value})
        } else {
            onSetAttributeForProductAndText(id, 'axesHelper', value)
        }
    }, [onSetAttributeForProductAndText, treeData, onTreeDataGroupChange])

     // value: {x, y, z}
     const onChangeScale = useCallback((id, value) => {
        const node = findNodeOfTreeData(treeData, id)
        if(node && _.get(node, ['nodeType']) === TREE_DATA_NODE_TYPE.FOLDER) {
            onTreeDataGroupChange(id, {scale: value})
        } else {
            onSetAttributeForProductAndText(id, 'scale', value)
        }
    }, [onSetAttributeForProductAndText, treeData, onTreeDataGroupChange])

    const onChangeMaterial2D = (id, val) => {
        const prod = listProducts.find(el => el.id === id)
        if(prod){
            let newListDecor = _.cloneDeep(listProducts).map(prod => {
                if(prod.id === id){
                    const selectedGalleryId = _.get(prod, ['selectedGalleryId'], '')
                    if(selectedGalleryId){
                        const selectedGallery = _.find(_.get(prod, ['gallery'], []), (el) => el.id === selectedGalleryId)
                        _.set(selectedGallery, ['materialConfigs'], val)
                    }
                }
    
                return prod
            })
    
            onUpdateListProducts([...newListDecor], true)
        }
    }

    const onChangeSelectedGallery = (id, val) => {
        const prod = listProducts.find(el => el.id === id)
        if(prod){
            let newListDecor = _.cloneDeep(listProducts).map(el => {
                if(el.id === id){
                    el.selectedGalleryId = val
                    const selectedGallery = _.find(_.get(el, ['gallery'], []), o => o.id === val)
                    if(selectedGallery){
                        if(selectedGallery.object && is3DFile(selectedGallery.object)){
                            el.block = MODEL_BLOCK["3D"]
                        } else {
                            el.block = MODEL_BLOCK['2D']
                        }
                    } else {
                        if(el.url && is3DFile(el.url)){
                            el.block = MODEL_BLOCK["3D"]
                        } else {
                            el.block = MODEL_BLOCK['2D']
                        }
                    }
                }
    
                return el
            })
    
            onUpdateListProducts([...newListDecor], true)
        }
    }

    const onChangeName = (id, value) => {
        onSetAttributeForProductAndText(id, 'name', value)
    }

    const onChangeDescription = (id, value) => {
        onSetAttributeForProductAndText(id, 'description', value)
    }

    const onChangeMedia = (id, value) => {
        onSetAttributeForProductAndText(id, 'media', value)
    }

    const onChangeAvailableAnimation = (id, value) => {
        onSetAttributeForProductAndText(id, 'availableAnimation', value)
    }

    const onChangeGallery = (id, value) => {
        let newListDecor = _.cloneDeep(listProducts).map(el => {
            if(el.id === id){
                el.gallery = value

                if(!el.gallery.find(el => el.id === _.get(el, ['selectedGalleryId'], ''))){
                    _.set(el, ['selectedGalleryId'], _.get(el, ['gallery', 0, 'id'], ''))
                }
            }

            return el
        })

        onUpdateListProducts([...newListDecor], true)
    }

    const onChildrenTextAttributeChange = (childrenId, attribute, value) => {
        const text = listTexts.find(el => el.id === selectedObject)
        if(text){
            let newListTexts = _.cloneDeep(listTexts).map(el => {
                if(el.id === selectedObject && el.texts.find(o => o.id === childrenId)){
                    el.texts = el.texts.map(o => {
                        if(o.id === childrenId){
                            o[attribute] = value
                        }
                        return o
                    })
                }
    
                return el
            })
    
            onUpdateListTexts([...newListTexts], true)
        }
    }

    const playOpenMenuSound = () => {
        if(!theOpenMenuSound.current || !theCloseMenuSound.current){
            return
        }
        theOpenMenuSound.current.stop();
        theCloseMenuSound.current.stop();
        theOpenMenuSound.current.play();
    }

    const playCloseMenuSound = () => {
        if(!theOpenMenuSound.current || !theCloseMenuSound.current){
            return
        }
        theOpenMenuSound.current.stop();
        theCloseMenuSound.current.stop();
        theCloseMenuSound.current.play();
    }


    const handleSelectObject = (id) => {
        onSelectObject(id)

        if(id && theClickSound.current){
            theClickSound.current.stop();
            theClickSound.current.play();
        }
    }

    useImperativeHandle(ref, () => ({
        handleDragEnd: (e, el) => {
            handleDragEnd(e, el)
        },
        playWalkingSound: () => {
            if(theWalkSound.current && !theWalkSound.current.isPlaying){
                theWalkSound.current.play();
            }
        },
        stopWalkingSound: () => {
            if(theWalkSound.current && theWalkSound.current.isPlaying){
                theWalkSound.current.pause();
            }
        },
        playAddToCartSound: () => {
            if(theAddToCartSound.current){
                theAddToCartSound.current.stop();
                theAddToCartSound.current.play();
            }
        },
        getListProducts: () => {
            return listProducts
        },
        getListTexts: () => {
            return listTexts
        },
        playOpenMenuSound: () => {
            playOpenMenuSound()
        },
        playCloseMenuSound: () => {
            playCloseMenuSound()
        },
    }));

    const playMeshCollisionSound = () => {
        setIsAnyMeshCollision(true)
        if(theMeshCollisionSound.current && !theMeshCollisionSound.current.isPlaying){
            theMeshCollisionSound.current.stop();
            theMeshCollisionSound.current.play();
        }
    }
    const stopMeshCollisionSound = () => {
        setIsAnyMeshCollision(false)
        if(theMeshCollisionSound.current && theMeshCollisionSound.current.isPlaying){
            theMeshCollisionSound.current.stop();
        }
    }

    const onChangeMaterial = (materials) => {
        let materialsKeys = Object.keys(materials)
        let saveMaterials = {}
        if(materialsKeys && materialsKeys.length > 0){
            materialsKeys.forEach(el => {
                let atrKeys = Object.keys(materials[el])
                saveMaterials[el] = {}
                atrKeys.filter(k => EDITOR_MATERIAL_KEYS.find(o => o.key === k)).forEach(atrr => {
                    let atrInfo = EDITOR_MATERIAL_KEYS.find(o => o.key === atrr)
                    if(atrInfo.valueType === MATERIAL_VALUE_TYPES.COLOR){
                        saveMaterials[el][atrr] = {
                            type: atrInfo.valueType,
                            value: new Color(materials[el][atrr].r / 255, materials[el][atrr].g / 255, materials[el][atrr].b / 255).getHex(NoColorSpace)    
                        }
                    } else {
                        saveMaterials[el][atrr] = {
                            type: atrInfo.valueType,
                            value: materials[el][atrr]
                        }
                    }
                })
            })
        }

        const prod = listProducts.find(el => el.id === selectedObject)
        if(prod){
            let newListDecor = _.cloneDeep(listProducts).map(prod => {
                if(prod.id === selectedObject){
                    const selectedGalleryId = _.get(prod, ['selectedGalleryId'], '')
                    if(selectedGalleryId){
                        const selectedGallery = _.find(_.get(prod, ['gallery'], []), (el) => el.id === selectedGalleryId)
                        _.set(selectedGallery, ['materials'], saveMaterials)
                    }
                }
    
                return prod
            })
    
            onUpdateListProducts([...newListDecor], true)
        }
    }

    return <>
        <group userData={{isSound: true}}>
            <audio ref={theOpenMenuSound} args={[listener]} />
            <audio ref={theCloseMenuSound} args={[listener]} />
            <audio ref={theClickSound} args={[listener]} />
            <audio ref={theAddToCartSound} args={[listener]} />
            <audio ref={theWalkSound} args={[listener]}/>
            <audio ref={theMouseSound} args={[listener]}/>
            <audio ref={theMeshCollisionSound} args={[listener]}/>
        </group>
        <Selection>
            <EffectComposer multisampling={8} autoClear={false}>
                <Outline 
                    ref={outlinePassRef}
                    blendFunction={BlendFunction.SCREEN}
                    visibleEdgeColor={isAnyMeshCollision ? 0xFF0000 : 0x00F6FF} 
                    hiddenEdgeColor={isAnyMeshCollision ? 0xFF0000 : 0x00F6FF}
                    blur={true}
                    pulseSpeed={0.0}
                    edgeStrength={10} 
                    width={Resizer.AUTO_SIZE}
                    height={Resizer.AUTO_SIZE}
                    kernelSize={KernelSize.LARGE}
                    xRay={true}
                />
                {/* <Bloom intensity={0.1}/> */}
            </EffectComposer>
            {
                list3DItems && list3DItems.map((el) => (
                    <>
                        <Suspense fallback={null} key={el.id}>
                            <Product 
                                key={`Product-${el.id}`} 
                                item={el} 
                                onSelectObject={(id) => {handleSelectObject(id)}} 
                                cameraControl={cameraControl} 
                                onChangePosition={onChangePosition}
                                onAddToCart={onAddToCart}
                                snapPoints={snapPoints}
                                onMeshCollision={playMeshCollisionSound}
                                stopMeshCollision={stopMeshCollisionSound}
                                onShowMoreInfo={() => {onChangeIsShowModalMoreInfo(true)}}
                                onLoaded={onObjectLoaded}
                                onShowObjectDetail={() => {dispatch(setIsShowDrawerObjectDetail(!isShowDrawerObjectDetail))}}
                                onCopy={onCopy}
                                onPaste={() => {onPaste(true)}}
                                onDelete={() => {onDelete()}}
                                onLock={() => {onLock()}}
                                onDuplicate={onDuplicate}
                                onChangeMedia={onChangeMedia}
                            />
                        </Suspense>
                    </>
                ))
            }
            {
                list2DItems && list2DItems.map((el) => (
                    <Suspense fallback={null} key={el.id}>
                        <Picture 
                            key={`Picture-${el.id}`} 
                            item={el} 
                            onSelectObject={(id) => {handleSelectObject(id)}} 
                            cameraControl={cameraControl} 
                            onChangePosition={onChangePosition}
                            onChangeRotation={onChangeRotation}
                            onAddToCart={onAddToCart}
                            snapPoints={snapPoints}
                            onMeshCollision={playMeshCollisionSound}
                            stopMeshCollision={stopMeshCollisionSound}
                            onShowMoreInfo={() => {onChangeIsShowModalMoreInfo(true)}}
                            onLoaded={onObjectLoaded}
                            onShowObjectDetail={() => {dispatch(setIsShowDrawerObjectDetail(!isShowDrawerObjectDetail))}}
                            onCopy={onCopy}
                            onPaste={() => {onPaste(true)}}
                            onDelete={onDelete}
                            onLock={() => {onLock()}}
                            onDuplicate={onDuplicate}
                        />
                    </Suspense>
                ))
            }
            {
                isObjectsLoaded && listTexts && listTexts.map(el => (
                    <Suspense fallback={null} key={el.id}>
                        <GroupTextView 
                            item={el} 
                            key={`Text-${el.id}`} 
                            cameraControl={cameraControl} 
                            onChangePosition={onChangePosition}
                            snapPoints={snapPoints}
                            onChangeRotation={onChangeRotation}
                            onSelectObject={(id) => {handleSelectObject(id)}} 
                            onShowObjectDetail={() => {dispatch(setIsShowDrawerObjectDetail(!isShowDrawerObjectDetail))}}
                            onCopy={onCopy}
                            onPaste={() => {onPaste(true)}}
                            onDelete={onDelete}
                            onLock={() => {onLock()}}
                            onDuplicate={onDuplicate}
                        />
                    </Suspense>
                ))
            }

            {
                listPlaceholders && listPlaceholders.map(el => (
                    <Suspense fallback={null} key={el.id}>
                        <Placeholder 
                            item={el} 
                            key={`PlaceHolder-${el.id}`} 
                            onSelectObject={(id) => {handleSelectObject(id)}} 
                            cameraControl={cameraControl} 
                            onChangePosition={onChangePosition}
                            onChangeRotation={onChangeRotation}
                            snapPoints={snapPoints}
                            onMeshCollision={playMeshCollisionSound}
                            stopMeshCollision={stopMeshCollisionSound}
                            onShowObjectDetail={() => {dispatch(setIsShowDrawerObjectDetail(!isShowDrawerObjectDetail))}}
                            onCopy={onCopy}
                            onPaste={() => {onPaste(true)}}
                            onDelete={onDelete}
                            onLock={() => {onLock()}}
                            onDuplicate={onDuplicate}
                        />
                    </Suspense>
                ))
            }
            {!isPreviewMode &&
                <TransformControls ref={transformRef}>
                </TransformControls>
            }
        </Selection>

        <Html>
            {
                (!isPreviewMode && !isPublishModeLocation(location)) && <DrawerObjectDetail 
                    open={!!selectedObject && isShowDrawerObjectDetail}
                    onPlayOpenSound={() => {playOpenMenuSound()}}
                    onPlayCloseSound={() => {playCloseMenuSound()}}
                    onClose={() => {
                        dispatch(setIsShowDrawerObjectDetail(false))
                    }}
                    container={container.current}
                    listProducts={listProducts}
                    listTexts={listTexts}
                    listPlaceholders={listPlaceholders}
                    selectedObject={selectedObject}
                    treeData={treeData}
                    allProducts={allProducts}
                    onChangeScale={onChangeScale}
                    onChangeRotation={onChangeRotation}
                    onChangePosition={onChangePosition}
                    onChangeName={onChangeName}
                    onChangeDescription={onChangeDescription}
                    onChangeMedia={onChangeMedia}
                    onChangeAvailableAnimation={onChangeAvailableAnimation}
                    onChangeGallery={onChangeGallery}
                    scene={scene}
                    onChangeMaterial={onChangeMaterial}
                    onChildrenTextAttributeChange={onChildrenTextAttributeChange}
                    onChangeMaterial2D={onChangeMaterial2D}
                    onChangeSelectedGallery={onChangeSelectedGallery}
                    onChangeUniformScale={onChangeUniformScale}
                    onChangeAxesHelper={onChangeAxesHelper}
                    objectEditorMaterials={objectEditorMaterials}
                    dispatch={dispatch}
                />
            }
            {
                // Modal in here isShowModalMoreInfo, selectedProductDetail
                <MoreInfoModal 
                    open={isShowModalMoreInfo}
                    onClose={() => {onChangeIsShowModalMoreInfo(false)}}
                    productDetail={selectedProductDetail}
                    onAddToCart={onAddToCart}
                />
            }
        </Html>
    </>
})
export default ModelContainer;