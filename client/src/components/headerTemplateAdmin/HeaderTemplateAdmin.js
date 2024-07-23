
import { Col, Layout, Row, Spin, notification } from "antd";
import "./styles.scss"

import LogoImage from "../../assets/images/project/logo.svg"
import LogoImageLight from "../../assets/images/project/light-logo.png"
import { useSelector } from "react-redux";
import { getTheme, getUser } from "../../redux/appSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { getEditorMaterials, getIsAttachSelectedHdriToBackground, getSelectedHdriOfAdminTemplate, getTemplateAvailableAnimation, getTemplateToneMappingExposure } from "../../redux/modelSlice";
import { EDITOR_MATERIAL_KEYS, EDIT_TEMPLATE_MODE, MATERIAL_VALUE_TYPES, PROJECT_MODE, PROJECT_TYPE } from "../../utils/constants";
import { Color, NoColorSpace } from "three";
import { createProjectTemplate, getProjectById, updateProjectById } from "../../api/project.api";
import ModalProjectName from "../modalProjectName/ModalProjectName";
import { useState } from "react";
import { isShopifyAdminLocation } from "../../utils/util";
import routesConstant from "../../routes/routesConstant";

const { Header } = Layout;
const HeaderTemplateAdmin = () => {
    const location = useLocation()
    const [isModalProjectNameOpen, setIsModalProjectNameOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const {id: projectId, editTemplateMode} = useParams()
    const user = useSelector(getUser)
    const navigate = useNavigate()
    const theme = useSelector(getTheme)
    const editorMaterials = useSelector(getEditorMaterials)
    const templateToneMappingExposure = useSelector(getTemplateToneMappingExposure)
    const isAttachSelectedHdriToBackground = useSelector(getIsAttachSelectedHdriToBackground)
    const selectedHdriOfAdminTemplate = useSelector(getSelectedHdriOfAdminTemplate)
    const templateAvailableAnimation = useSelector(getTemplateAvailableAnimation)

    const onSaveMaterial = () => {
        if(projectId){
            const saveMaterials = createSavedMaterials()

            const data = {
                materials: saveMaterials,
                hdr: selectedHdriOfAdminTemplate,
                isAttachHdriToBackground: isAttachSelectedHdriToBackground,
                templateToneMappingExposure: templateToneMappingExposure,
                templateAvailableAnimation: templateAvailableAnimation
            }

            updateProjectById(projectId, data).then(rs => {
                notification.success({
                    message: "Save success!"
                })
            }).catch(err => {
                notification.error({
                    message: "Save fail!"
                })
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

    const handleSaveAsTemplate = (templateName) => {
        if(!templateName){
            notification.warning({
                message: "Project name is required!"
            })
            return
        }
        setIsModalProjectNameOpen(false)
        setLoading(true)

        const saveMaterials = createSavedMaterials()
        getProjectById(projectId).then(project => {
            let data = {
                ...project,
                name: templateName,
                listProducts: [],
                listTexts: [],
                mode: PROJECT_MODE.UNSAVED,
                type: PROJECT_TYPE.TEMPLATE,
                isBlank: false,
                isLock: false,
                createdBy: user?.id,
                materials: saveMaterials,
                hdr: selectedHdriOfAdminTemplate,
                isAttachHdriToBackground: isAttachSelectedHdriToBackground,
                templateToneMappingExposure: templateToneMappingExposure,
                shouldNotCompress: true,
            }
            delete data.createdAt
            delete data.updatedAt

            createProjectTemplate(data).then(data => {
                if(data.id){
                    notification.success({
                        message: "Template created successfully!"
                    })
                }
                setLoading(false)
            }).catch(err => {
                notification.error({
                    message: "Failed to create template!"
                })
                setLoading(false)
            })
        }).catch(err => {
            notification.error({
                message: "Failed to create template!"
            })
            setLoading(false)
        })
    }

    return <>
    <Header className="header-project-container">
        <Row gutter={[0, 24]} className='header-project-content items-center'>
            <Col lg={12} md={12} sm={24} xs={24}>
                <img src={theme === 'light' ? LogoImageLight : LogoImage} alt="Logo" className="cursor-pointer max-h-[40px]" onClick={() => {
                    if(isShopifyAdminLocation(location)) {
                        navigate(routesConstant.shopifyAdmin.path)
                    } else {
                        navigate(routesConstant.admin.path)
                    }
                }}/>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24} className="flex justify-end gap-[26px]">
                {editTemplateMode === EDIT_TEMPLATE_MODE.EDIT_TEMPLATE && <button className="btn-preview" onClick={() => {onSaveMaterial()}}>
                    Save
                </button>}
                {editTemplateMode === EDIT_TEMPLATE_MODE.CLONE_TEMPLATE && <Spin spinning={loading}>
                    <button className="btn-preview" onClick={() => {setIsModalProjectNameOpen(true)}}>
                        Save
                    </button>
                </Spin>}
            </Col>
        </Row>
    </Header>
    <ModalProjectName
        open={isModalProjectNameOpen}
        onClose={() => {setIsModalProjectNameOpen(false)}}
        onOk={(value) => {handleSaveAsTemplate(value)}}
        title="Template name"
        placeholder="Enter TEMPLATE NAME"
    />
    </>
}
export default HeaderTemplateAdmin