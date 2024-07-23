import { Col, Row, Spin, notification } from "antd";
import "./styles.scss"
import CanvasContainerAdmin from "../../../components/canvasContainerAdmin/CanvasContainerAdmin";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEditorMaterials, getIsAttachSelectedHdriToBackground, getSelectedHdriOfAdminTemplate, getSetSelectedMaterial, getTemplateAvailableAnimation, getTemplateToneMappingExposure, setSelectedMaterial } from "../../../redux/modelSlice";
import AutosavingIcon from "../../../assets/images/project/auto.svg"
import DrawerAdminTemplateObjectDetail from "../../../components/adminComponents/drawerAdminTemplateObjectDetail/DrawerAdminTemplateObjectDetail";
import DrawerHdriSettings from "../../../components/adminComponents/drawerHdriSettings/DrawerHdriSettings";
import { EDITOR_MATERIAL_KEYS, MATERIAL_VALUE_TYPES } from "../../../utils/constants";
import { Color, NoColorSpace } from "three";
import { useParams } from "react-router-dom";
import { updateProjectById } from "../../../api/project.api";

const EditModelTemplate = () => {
    const dispatch = useDispatch()
    const materialsEditorRef = useRef()
    const canvasContainerRef = useRef()
    const {id: projectId} = useParams()
    const [isShowDrawerHdri, setIsShowDrawerHdri] = useState(false)
    const selectedMaterial = useSelector(getSetSelectedMaterial)
    const [isShowAutoSaving, setIsShowAutoSaving] = useState(false)
    const [canPickObject, setCanPickObject] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const editorMaterials = useSelector(getEditorMaterials)
    const templateToneMappingExposure = useSelector(getTemplateToneMappingExposure)
    const isAttachSelectedHdriToBackground = useSelector(getIsAttachSelectedHdriToBackground)
    const selectedHdriOfAdminTemplate = useSelector(getSelectedHdriOfAdminTemplate)
    const templateAvailableAnimation = useSelector(getTemplateAvailableAnimation)

    useEffect(() => {
        onSelectMaterial(selectedMaterial)
    }, [selectedMaterial])
    
    const onLoadMaterials = (materials) => {
        if(materialsEditorRef.current) {
            materialsEditorRef.current.loadMaterials(materials)
        }
    }

    const onSelectMaterial = (materialName) => {
        canvasContainerRef.current.highlightMaterial(materialName)
    }

    const onSelectedMaterialChange = (value) => {
        dispatch(setSelectedMaterial(value))
    }

    const onSaveChanges = () => {
        if(projectId){
            const saveMaterials = createSavedMaterials()

            const data = {
                materials: saveMaterials,
                hdr: selectedHdriOfAdminTemplate,
                isAttachHdriToBackground: isAttachSelectedHdriToBackground,
                templateToneMappingExposure: templateToneMappingExposure,
                templateAvailableAnimation: templateAvailableAnimation
            }

            setIsSaving(true)
            updateProjectById(projectId, data).then(rs => {
                notification.success({
                    message: "Save success!"
                })
                setIsSaving(false)
            }).catch(err => {
                notification.error({
                    message: "Save fail!"
                })
                setIsSaving(false)
            })
        }
    }

    const createSavedMaterials = () => {
        let saveMaterials = {}
        let materialsKeys = Object.keys(editorMaterials)
        if(materialsKeys && materialsKeys.length > 0){
            materialsKeys.forEach(el => {
                let atrKeys = Object.keys(editorMaterials[el])
                saveMaterials[el] = {}
                atrKeys.filter(k => EDITOR_MATERIAL_KEYS.find(o => o.key === k)).forEach(atrr => {
                    let atrInfo = EDITOR_MATERIAL_KEYS.find(o => o.key === atrr)
                    if(atrInfo.valueType === MATERIAL_VALUE_TYPES.COLOR){
                        saveMaterials[el][atrr] = {
                            type: atrInfo.valueType,
                            value: new Color(editorMaterials[el][atrr].r / 255, editorMaterials[el][atrr].g / 255, editorMaterials[el][atrr].b / 255).getHex(NoColorSpace)    
                        }
                    } else if(atrInfo.valueType === MATERIAL_VALUE_TYPES.TEXTURE){
                        saveMaterials[el][atrr] = {
                            type: atrInfo.valueType,
                            value: null    
                        }
                    } else {
                        saveMaterials[el][atrr] = {
                            type: atrInfo.valueType,
                            value: editorMaterials[el][atrr]
                        }
                    }
                })
            })  
        }
        
        return saveMaterials
    }

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 h-full edit-model-template-container bg-[#F3F3F3]">
            <Col lg={24} md={24} sm={24} xs={24} className="!p-0 h-full">
                {isShowAutoSaving && <div className='autosaving-text'>
                    <img src={AutosavingIcon} alt="" className='autosaving-animation'/>
                    Autosaving
                </div>}
                <div className="edit-model-button-container">
                    <button className={`btn-setting ${isShowDrawerHdri ? 'enable' : ''}`} onClick={() => {
                        setIsShowDrawerHdri(!isShowDrawerHdri)
                        setCanPickObject(false)
                    }}>
                        HDRI Setting
                    </button>
                    <button className={`btn-setting ${canPickObject ? 'enable' : ''}`} onClick={() => {setCanPickObject(!canPickObject)}}>
                        Pick material
                    </button>
                    <Spin spinning={isSaving}>
                        <button className="btn-setting btn-white" onChange={() => {onSaveChanges()}}>
                            Save changes
                        </button>
                    </Spin>
                </div>
                <CanvasContainerAdmin 
                    onLoadMaterials={(m) => {onLoadMaterials(m)}} ref={canvasContainerRef}
                    setCanPickObject={setCanPickObject}
                    setIsShowDrawerHdri={setIsShowDrawerHdri}
                    canPickObject={canPickObject}
                />
            </Col>
            <DrawerAdminTemplateObjectDetail
                open={!!selectedMaterial && !isShowDrawerHdri}
                onClose={() => {
                    dispatch(setSelectedMaterial(null))
                }}
                ref={materialsEditorRef}
                onSelectedMaterialChange={(value) => {onSelectedMaterialChange(value)}}
            />
            <DrawerHdriSettings
                open={isShowDrawerHdri}
                onClose={() => {setIsShowDrawerHdri(false)}}
            />
        </Row>
    </>
}
export default EditModelTemplate;