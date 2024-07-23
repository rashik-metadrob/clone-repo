import { Drawer, Input, Space } from "antd";
import "./styles.scss"

import ExitIcon from "../../assets/images/project/exit.svg"
import TransformCollapse from "./components/transformCollapse/TransformCollapse";
import DescriptionCollapse from "./components/descriptionCollapse/DescriptionCollapse";
import Model3DCollapse from "./components/model3DCollapse/Model3DCollapse";
import SoundCollapse from "./components/soundCollapse/SoundCollapse";
import MediaCollapse from "./components/mediaCollapse/MediaCollapse";
import ColorCollapse from "./components/colorCollapse/ColorCollapse";
import MaterialsCollapse from "./components/materialsCollapse/MaterialsCollapse";
import TextCollapse from "./components/textCollapse/TextCollapse";
import AnimationCollapse from "./components/animationCollapse/AnimationCollapse";
import PluginCollapse from "./components/pluginCollapse/PluginCollapse";
import { useEffect, useState } from "react";
import { AVAILABLE_ANIMATION, EDITOR_MATERIAL_KEYS_2D_DEFAULT_VALUE, MODEL_BLOCK, OBJECT_DETAIL_TYPE, PRODUCT_TYPES, TREE_DATA_NODE_TYPE } from "../../utils/constants";
import _ from "lodash";
import GalleryCollapse from "./components/galleryCollapse/GalleryCollapse";
import MaterialCollapse from "./components/materialCollapse/MaterialCollapse";
import Material2DCollapse from "./components/material2DCollapse/Material2DCollapse";
import { uuidv4 } from "../../utils/util";
import { findNodeOfTreeData } from "../../utils/treeData.util";
import SelectPlaceholderProductCollapse from "./components/selectPlaceholderProductCollapse/SelectPlaceholderProductCollapse";

const DrawerObjectDetail = ({
    open,
    onClose = () => {},
    container,
    listProducts,
    listPlaceholders,
    allProducts,
    listTexts,
    selectedObject,
    treeData,
    onChangeScale = () => {},
    onChangeRotation = () => {},
    onChangePosition = () => {},
    onChangeAxesHelper = () => {},
    onChangeName = () => {},
    onChangeDescription = () => {},
    onChangeMedia = () => {},
    onChangeAvailableAnimation = () => {},
    onChangeGallery = () => {},
    onChangeMaterial = () => {},
    onChangeMaterial2D = () => {},
    onChildrenTextAttributeChange = () => {},
    onChangeSelectedGallery = () => {},
    onChangeUniformScale = () => {},
    onPlayOpenSound = () => {},
    onPlayCloseSound = () => {},
    scene,
    objectEditorMaterials,
    dispatch,
}) => {
    const [objectType, setObjectType] = useState();
    const [objectDetail, setObjectDetail] = useState();

    const [position, setPosition] = useState([0, 0, 0])
    const [rotation, setRotation] = useState([0, 0, 0])
    const [scale, setScale] = useState([1, 1, 1])
    const [uniformScale, setUniformScale] = useState(0)
    const [media, setMedia] = useState()
    const [availableAnimation, setAvailableAnimation] = useState(AVAILABLE_ANIMATION.PLAY_NEVER)
    const [gallery, setGallery] = useState([])
    const [textChildren, setTextChildren] = useState([])
    const [is2D, setIs2D] = useState(false);
    const [materialConfigs, setMaterialConfigs] = useState({})
    const [savedElementMaterials, setSavedElementMaterials] = useState({})
    
    useEffect(() => {
        if(open){
            onPlayOpenSound()
        } else {
            onPlayCloseSound()
        }
    }, [open])

    useEffect(() => {
        if(!objectType || !objectDetail){
            return
        }

        if(
            objectType === OBJECT_DETAIL_TYPE.PRODUCT 
            || objectType === OBJECT_DETAIL_TYPE.DECORATIVE_WITH_MOLD 
            || objectType === OBJECT_DETAIL_TYPE.OTHER
        ){
            setPosition([objectDetail.position.x, objectDetail.position.y, objectDetail.position.z])
            setRotation([radiantToDegree(objectDetail.rotation.x), radiantToDegree(objectDetail.rotation.y), radiantToDegree(objectDetail.rotation.z)])
            setScale([objectDetail?.scale?.x || 1, objectDetail?.scale?.y || 1, objectDetail?.scale?.z || 1])
            setUniformScale(_.get(objectDetail, ['uniformScale'], 0))
            if(objectDetail.media){
                setMedia(objectDetail.media)
            } else {
                setMedia()
            }

            if(objectDetail.gallery){
                setGallery(objectDetail.gallery.map(el => {
                    if(!el.id){
                        el.id = uuidv4()
                    }
                    return el
                }))
            } else {
                setGallery()
            }
        } else if(objectType === OBJECT_DETAIL_TYPE.TEXT){
            setPosition([objectDetail.position.x, objectDetail.position.y, objectDetail.position.z])
            setRotation([radiantToDegree(objectDetail.rotation.x), radiantToDegree(objectDetail.rotation.y), radiantToDegree(objectDetail.rotation.z)])
            setScale([objectDetail?.scale?.x || 1, objectDetail?.scale?.y || 1, objectDetail?.scale?.z || 1])
            setUniformScale(_.get(objectDetail, ['uniformScale'], 0))
            setTextChildren(_.get(objectDetail, 'texts', []))
        } else if(objectType === OBJECT_DETAIL_TYPE.PLACEHOLDER){
            setPosition([objectDetail.position.x, objectDetail.position.y, objectDetail.position.z])
            setRotation([radiantToDegree(objectDetail.rotation.x), radiantToDegree(objectDetail.rotation.y), radiantToDegree(objectDetail.rotation.z)])
            setScale([objectDetail?.scale?.x || 1, objectDetail?.scale?.y || 1, objectDetail?.scale?.z || 1])
            setUniformScale(_.get(objectDetail, ['uniformScale'], 0))
        } else if(objectType === OBJECT_DETAIL_TYPE.FOLDER) {
            setPosition([objectDetail.position.x, objectDetail.position.y, objectDetail.position.z])
            setRotation([radiantToDegree(objectDetail.rotation.x), radiantToDegree(objectDetail.rotation.y), radiantToDegree(objectDetail.rotation.z)])
            setScale([objectDetail?.scale?.x || 1, objectDetail?.scale?.y || 1, objectDetail?.scale?.z || 1])
            setUniformScale(_.get(objectDetail, ['uniformScale'], 0))

            // Default
            setMedia()
            setGallery([])
            setTextChildren([])
        } else {
            setPosition([0, 0, 0])
            setRotation([0, 0, 0])
            setScale([1, 1, 1])
            setMedia()
            setGallery([])
            setTextChildren([])
            setUniformScale(0)
        }

        if(objectType === OBJECT_DETAIL_TYPE.PRODUCT || objectType === OBJECT_DETAIL_TYPE.OTHER || objectType === OBJECT_DETAIL_TYPE.TEXT ){
            setAvailableAnimation(objectDetail?.availableAnimation || AVAILABLE_ANIMATION.PLAY_NEVER)
        } else {
            setAvailableAnimation(AVAILABLE_ANIMATION.PLAY_NEVER)
        }


        if(objectDetail.block === MODEL_BLOCK["2D"]) {
            setIs2D(true)
            let savedMaterialConfigs = EDITOR_MATERIAL_KEYS_2D_DEFAULT_VALUE
            const selectedGalleryId = _.get(objectDetail, ['selectedGalleryId'], '')
            if(selectedGalleryId){
                const selectedGallery = _.find(_.get(objectDetail, ['gallery'], []), (el) => el.id === selectedGalleryId)
                savedMaterialConfigs = _.get(selectedGallery, ['materialConfigs'], EDITOR_MATERIAL_KEYS_2D_DEFAULT_VALUE)
            }
            setMaterialConfigs(savedMaterialConfigs)
            setSavedElementMaterials({})
        }
        else {
            setIs2D(false)
            setMaterialConfigs(EDITOR_MATERIAL_KEYS_2D_DEFAULT_VALUE)

            const selectedGalleryId = _.get(objectDetail, ['selectedGalleryId'], '')
            let savedMaterials = {}
            if(selectedGalleryId){
                const selectedGallery = _.find(_.get(objectDetail, ['gallery'], []), (el) => el.id === selectedGalleryId)
                savedMaterials = _.get(selectedGallery, ['materials'], {})
            }
            setSavedElementMaterials(savedMaterials)
        }

    }, [objectDetail, objectType])

    useEffect(() => {
        if(!selectedObject){
            setObjectType()
            setObjectDetail()

            return
        }
        let prod = listProducts.find(el => el.id === selectedObject)
        let text = listTexts.find(el => el.id === selectedObject)
        let placeholder = listPlaceholders.find(el => el.id === selectedObject)
        let node = findNodeOfTreeData(treeData, selectedObject)
        if(prod){
            if(prod?.type === PRODUCT_TYPES.PRODUCTS){
                setObjectType(OBJECT_DETAIL_TYPE.PRODUCT)
            }
            if(prod?.type === PRODUCT_TYPES.DECORATIVES){
                setObjectType(OBJECT_DETAIL_TYPE.DECORATIVE_WITH_MOLD)
            }
            if(prod?.type === PRODUCT_TYPES.ELEMENT){
                setObjectType(OBJECT_DETAIL_TYPE.OTHER)
            }
            setObjectDetail(_.cloneDeep(prod))
        } else if(text) {
            setObjectType(OBJECT_DETAIL_TYPE.TEXT)
            setObjectDetail(_.cloneDeep(text))
        } else if(placeholder) {
            setObjectType(OBJECT_DETAIL_TYPE.PLACEHOLDER)
            setObjectDetail(_.cloneDeep(placeholder))
        } else if(node && _.get(node, ['nodeType']) === TREE_DATA_NODE_TYPE.FOLDER) {
            setObjectType(OBJECT_DETAIL_TYPE.FOLDER)
            setObjectDetail(_.cloneDeep(node))
        } else {
            setObjectType()
            setObjectDetail()
        }
    }, [selectedObject, listProducts, listTexts, treeData, listPlaceholders])

    const onScaleChange = (value) => {
        if(
            (
                objectType === OBJECT_DETAIL_TYPE.PRODUCT 
                || objectType === OBJECT_DETAIL_TYPE.DECORATIVE_WITH_MOLD 
                || objectType === OBJECT_DETAIL_TYPE.OTHER
                || objectType === OBJECT_DETAIL_TYPE.TEXT
                || objectType === OBJECT_DETAIL_TYPE.FOLDER
                || objectType === OBJECT_DETAIL_TYPE.PLACEHOLDER
            ) && selectedObject
        ){
            onChangeScale(selectedObject, {
                x: value[0],
                y: value[1],
                z: value[2]
            })
        }
    }

    const onRotationChange = (newRotation) => {
        if(
            (
                objectType === OBJECT_DETAIL_TYPE.PRODUCT 
                || objectType === OBJECT_DETAIL_TYPE.DECORATIVE_WITH_MOLD 
                || objectType === OBJECT_DETAIL_TYPE.OTHER
                || objectType === OBJECT_DETAIL_TYPE.TEXT
                || objectType === OBJECT_DETAIL_TYPE.FOLDER
                || objectType === OBJECT_DETAIL_TYPE.PLACEHOLDER
            ) 
            && selectedObject
        ){
            onChangeRotation(selectedObject, {
                x: degreeToRadiant(newRotation[0]),
                y: degreeToRadiant(newRotation[1]),
                z: degreeToRadiant(newRotation[2])
            })
        }
    }

    const onPositionChange = (newPos) => {
        if(
            (
                objectType === OBJECT_DETAIL_TYPE.PRODUCT 
                || objectType === OBJECT_DETAIL_TYPE.DECORATIVE_WITH_MOLD 
                || objectType === OBJECT_DETAIL_TYPE.OTHER
                || objectType === OBJECT_DETAIL_TYPE.TEXT
                || objectType === OBJECT_DETAIL_TYPE.FOLDER
                || objectType === OBJECT_DETAIL_TYPE.PLACEHOLDER
            ) && selectedObject
        ){
            onChangePosition(selectedObject, {
                x: newPos[0],
                y: newPos[1],
                z: newPos[2]
            })
        }
    }

    const onUniformScaleChange = (value) => {
        if(
            (
                objectType === OBJECT_DETAIL_TYPE.PRODUCT 
                || objectType === OBJECT_DETAIL_TYPE.DECORATIVE_WITH_MOLD 
                || objectType === OBJECT_DETAIL_TYPE.OTHER
                || objectType === OBJECT_DETAIL_TYPE.TEXT
                || objectType === OBJECT_DETAIL_TYPE.FOLDER
                || objectType === OBJECT_DETAIL_TYPE.PLACEHOLDER
            ) && selectedObject
        ){
            onChangeUniformScale(selectedObject, value)
        }
    }

    const onSelectMedia = (newMedia) => {
        if((objectType === OBJECT_DETAIL_TYPE.DECORATIVE_WITH_MOLD) && selectedObject){
            onChangeMedia(selectedObject, newMedia)
        }
    }

    const onAvailableAnimationChange = (value) => {
        if((objectType === OBJECT_DETAIL_TYPE.PRODUCT  || objectType === OBJECT_DETAIL_TYPE.OTHER || objectType === OBJECT_DETAIL_TYPE.TEXT) && selectedObject){
            onChangeAvailableAnimation(selectedObject, value)
        }
    }

    const radiantToDegree = (value) => {
        return (value / Math.PI * 180);
    }

    const degreeToRadiant = (value) => {
        return +(value / 180) * Math.PI;
    }

    return <>
        <Drawer
            title={null}
            placement="right"
            closable={false}
            onClose={() => {onClose()}}
            open={open}
            getContainer={() => container}
            destroyOnClose={true}
            className="drawer-object-detail"
            width={513}
            mask={false}
        >
            <div className="drawer-object-detail-container">
                <div className="drawer-title-container">
                    <div className="title">
                        Object Details
                    </div>
                    <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                        <img src={ExitIcon} alt="" />
                        <div className="text-close">Close</div>
                    </div>
                </div>
                <div className="drawer-content-wrap">
                    <div className="drawer-content-container">
                        { objectType !== OBJECT_DETAIL_TYPE.TEXT && <div className="object-name-container">
                            <Input 
                                type="text" 
                                value={objectDetail?.name} 
                                className="input-name"
                                disabled={objectType !== OBJECT_DETAIL_TYPE.PRODUCT}
                                onChange={(e) => {onChangeName(selectedObject, e.target.value)}}
                            />
                        </div>}
                        <Space direction="vertical" size="middle" className="mt-[15px] w-full">
                            {(
                                objectType === OBJECT_DETAIL_TYPE.PRODUCT 
                                || objectType === OBJECT_DETAIL_TYPE.DECORATIVE_WITH_MOLD 
                                || objectType === OBJECT_DETAIL_TYPE.OTHER
                                || objectType === OBJECT_DETAIL_TYPE.TEXT
                                || objectType === OBJECT_DETAIL_TYPE.FOLDER
                                || objectType === OBJECT_DETAIL_TYPE.PLACEHOLDER
                            ) && <TransformCollapse 
                                position={position}
                                rotation={rotation}
                                scale={scale}
                                uniformScale={uniformScale}
                                objectDetail={objectDetail}
                                onScaleChange={onScaleChange}
                                onRotationChange={onRotationChange}
                                onPositionChange={onPositionChange}
                                onUniformScaleChange={onUniformScaleChange}
                                onChangeAxesHelper={onChangeAxesHelper}
                            />}
                            {
                                objectType === OBJECT_DETAIL_TYPE.PLACEHOLDER && 
                                <>
                                    <SelectPlaceholderProductCollapse 
                                        objectDetail={objectDetail}
                                        allProducts={allProducts}
                                        dispatch={dispatch}
                                    />
                                </>
                            }
                            {
                                textChildren && textChildren.map((el, index) => (
                                    <TextCollapse 
                                        key={el.id} 
                                        item={el} 
                                        index={index}
                                        onChildrenTextAttributeChange={onChildrenTextAttributeChange}
                                    />
                                ))
                            }
                            {/* {objectType === OBJECT_DETAIL_TYPE.OTHER && <SoundCollapse />} */}
                            {objectType === OBJECT_DETAIL_TYPE.PRODUCT && <DescriptionCollapse objectDetail={objectDetail} onDescriptionChange={(value) => {onChangeDescription(selectedObject, value)}}/>}
                            {
                            (
                                objectType === OBJECT_DETAIL_TYPE.PRODUCT 
                                || objectType === OBJECT_DETAIL_TYPE.DECORATIVE_WITH_MOLD 
                                || objectType === OBJECT_DETAIL_TYPE.OTHER
                            ) ? (is2D ?
                                <Material2DCollapse materialConfigs={materialConfigs} onMaterialChange={(value) => onChangeMaterial2D(selectedObject, value)} /> :
                                <MaterialCollapse 
                                    scene={scene} 
                                    savedElementMaterials={savedElementMaterials} 
                                    selectedObject={selectedObject} 
                                    onMaterialChange={onChangeMaterial} 
                                    objectDetail={objectDetail}
                                    objectEditorMaterials={objectEditorMaterials}
                                    dispatch={dispatch}
                                />)
                                : <></>
                            }
                            {objectType === OBJECT_DETAIL_TYPE.PRODUCT && 
                            <GalleryCollapse 
                                selectedObject={selectedObject} 
                                objectDetail={objectDetail}
                                gallery={gallery} 
                                onSelectedGalleryChange={(value) => {onChangeSelectedGallery(selectedObject, value)}}
                                onGalleryChange={(value) => {onChangeGallery(selectedObject, value)}}
                            />}
                            {(objectType === OBJECT_DETAIL_TYPE.DECORATIVE_WITH_MOLD || objectType === OBJECT_DETAIL_TYPE.PRODUCT || objectType === OBJECT_DETAIL_TYPE.OTHER || objectType === OBJECT_DETAIL_TYPE.TEXT) && 
                            <AnimationCollapse 
                                availableAnimation={availableAnimation}
                                onChangeAvailableAnimation={onAvailableAnimationChange}
                            />}
                            {/* {objectType === OBJECT_DETAIL_TYPE.PRODUCT && <PluginCollapse />} */}
                            {/* <TextCollapse />
                            <Model3DCollapse /> */}

                            {objectType === OBJECT_DETAIL_TYPE.DECORATIVE_WITH_MOLD && <MediaCollapse onSelectMedia={(el) => {onSelectMedia(el)}} media={media} objectEditorMaterials={objectEditorMaterials}/>}
                            {/* {objectType === OBJECT_DETAIL_TYPE.DECORATIVE_WITH_MOLD && <SoundCollapse />} */}
                            
                            {/* <ColorCollapse />
                            <MaterialsCollapse /> */}
                        </Space>
                    </div>
                </div>
            </div>
        </Drawer>
    </>
}

export default DrawerObjectDetail;