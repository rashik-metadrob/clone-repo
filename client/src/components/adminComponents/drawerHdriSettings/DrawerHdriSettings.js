import { Checkbox, Col, Drawer, Input, InputNumber, Row, Select, Slider, Spin, notification } from "antd"
import ExitIcon from "../../../assets/images/project/exit.svg"
import './styles.scss'
import { AVAILABLE_ANIMATION, HDRI, RENDERER_CONFIG, UPLOADS_FOLDER } from "../../../utils/constants"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getIsAttachSelectedHdriToBackground, getSelectedHdriOfAdminTemplate, getTemplateAvailableAnimation, getTemplateToneMappingExposure, setIsAttachSelectedHdriToBackground, setSelectedHdriOfAdminTemplate, setSelectedMaterial, setTemplateAvailableAnimation, setTemplateToneMappingExposure } from "../../../redux/modelSlice"
import { useAppDispatch } from "../../../redux"
import { uploadFile } from "../../../api/upload.api"
import hdriApi from "../../../api/hdri.api"
import { getProjectById, updateProjectById } from "../../../api/project.api"
import { useParams } from "react-router-dom"
import _ from "lodash"
import { getAssetsUrl } from "../../../utils/util"
import HdriDefaultThumnailImage from "../../../assets/images/admin/hdri-default-thumnail.png"
import ArrowIcon from "../../../assets/images/products/arrow.svg"
import UploadImage from "../../uploadImage/UploadImage"
import UploadImageIcon from "../../../assets/icons/UploadImage"
import UploadFile from "../../uploadFile/UploadFile"
import ResetEditorIcon from "../../../assets/images/project/reset-editor.svg"
import ModalAddEditHdri from "../modalAddEditHdri/ModalAddEditHdri"

const DrawerHdriSettings = ({
    open,
    onClose = () => {}
}) => {
    const dispatch = useAppDispatch()
    const uploadHDRIImageRef = useRef()
    const [hdriName, setHdriName] = useState("")
    const uploadHDRRef = useRef()
    const [isLoading, setIsLoading] = useState(false)
    const isAttachSelectedHdriToBackground = useSelector(getIsAttachSelectedHdriToBackground)
    const templateToneMappingExposure = useSelector(getTemplateToneMappingExposure)
    const [isShowModalAdd , setIsShowModalAdd] = useState(false)
    const timeoutRef = useRef()
    const [hdri, setHdri] = useState()
    const [isShowSelectHDRI, setIsShowSelectHDRI] = useState(false)
    const [listHDRi, setListHDRi] = useState([])
    const {id: projectId} = useParams()
    const selectedHdriOfAdminTemplate = useSelector(getSelectedHdriOfAdminTemplate)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        getProjectById(projectId).then(data => {
            if(data.hdr){
                setHdri(data.hdr)
                dispatch(setSelectedHdriOfAdminTemplate(data.hdr))
            } else {
                setHdri("")
                dispatch(setSelectedHdriOfAdminTemplate(""))
            }
            dispatch(setTemplateToneMappingExposure(_.get(data, 'templateToneMappingExposure', RENDERER_CONFIG.TONE_MAPPING_EXPOSURE)))

            dispatch(setIsAttachSelectedHdriToBackground(!!data?.isAttachHdriToBackground))
            dispatch(setTemplateAvailableAnimation(_.get(data, ['templateAvailableAnimation'], AVAILABLE_ANIMATION.PLAY_NEVER)))
        }).catch(err => {
            setHdri("")
            dispatch(setSelectedHdriOfAdminTemplate(""))
        })
        loadListHdri()
    }, [projectId])

    const onHdriChange = (value) => {
        setIsShowSelectHDRI(false)
        setHdri(value)
        if(value !== HDRI.CUSTOM){
            dispatch(setSelectedHdriOfAdminTemplate(value))
        }
    }

    const onAttachBackgroundChange = (value) => {
        dispatch(setIsAttachSelectedHdriToBackground(value))
    }

    const onToneExposureChange = (value) => {
        dispatch(setTemplateToneMappingExposure(value))
    }

    const loadListHdri = () => {
        hdriApi.getAllHdri({ isOnlyNonDisable: true }).then(data => {
            if(data && data.length > 0){
                const newList = [
                    ...data.map(el => {
                        return {
                            label: el.name,
                            thumnail: el.thumnail ?? "",
                            value: el.id
                        }
                    })
                ]

                setListHDRi(newList)
            }
        })
    }

    const onSaveHdriSetting = () => {
        const data = {
            hdr: selectedHdriOfAdminTemplate,
            isAttachHdriToBackground: isAttachSelectedHdriToBackground,
            templateToneMappingExposure: templateToneMappingExposure
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

    return <>
        <Drawer
            title={null}
            placement="right"
            closable={false}
            onClose={() => {onClose()}}
            open={open}
            className="drawer-hdri-settings"
            width={513}
            mask={false}
        >
            <div className="drawer-hdri-settings-container">
                <div className="drawer-title-container">
                    <div className="title">
                        HDRI Settings
                    </div>
                    <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                        <img src={ExitIcon} alt="" />
                        <div className="text-close">Close</div>
                    </div>
                </div>
                <div className="drawer-content-wrap pb-[20px]">
                    <div className="drawer-content-container">
                        <div>
                            <Select
                                placeholder="Select HDRI"
                                className="admin-form-select w-full !h-[30px]"
                                popupClassName="admin-form-select-popup-with-image"
                                dropdownRender={() => (
                                    <>
                                        <div className="popup-content">
                                            {/* <div className="item" onClick={(e) => {onHdriChange(HDRI.CUSTOM)}}>
                                                <span>
                                                    Upload HDRI
                                                </span>
                                            </div>
                                            <div className="item" onClick={(e) => {onHdriChange(HDRI.FROM_SCENE)}}>
                                                <span>
                                                    HDRI Runtime
                                                </span>
                                            </div> */}
                                            {/* <div className="item-divider"></div> */}
                                            {
                                                listHDRi.map(el => (
                                                    <div className="item" onClick={(e) => {onHdriChange(el.value)}}>
                                                        <div className="image-container">
                                                            <img src={el.thumnail ? getAssetsUrl(el.thumnail) : HdriDefaultThumnailImage} alt="" className="w-[89px] h-[64px]"/>
                                                        </div>
                                                        <span>
                                                            {el.label}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </>
                                )}
                                suffixIcon={<img src={ArrowIcon} alt="" />}
                                options={listHDRi}
                                value={hdri}
                                open={isShowSelectHDRI}
                                onDropdownVisibleChange={(open) => {setIsShowSelectHDRI(open)}}
                            />
                        </div>
                        {
                            hdri && <>
                                <div className="hdri-setting mt-[8px]">
                                    <img src={_.get(listHDRi.find(el => el.value === hdri), ['thumnail'], null) ? getAssetsUrl(_.get(listHDRi.find(el => el.value === hdri), ['thumnail'], null)) : HdriDefaultThumnailImage} alt="" className="w-full mb-[10px]"/>
                                    <button className="btn-upload-new-hdri" onClick={() => {setIsShowModalAdd(true)}}>
                                        + Upload New
                                    </button>
                                </div>
                            </>
                        }
                        <div className="hdri-setting mt-[20px]">
                            <Row gutter={[16, 16]}>
                                <Col span={8} className="text-left">
                                    Hdri visibility
                                </Col>
                                <Col span={16}>
                                    <div className="flex justify-center items-center">
                                        <Checkbox 
                                            className="admin-material-checkbox"
                                            checked={isAttachSelectedHdriToBackground}
                                            onChange={(value) => {onAttachBackgroundChange(value.target.checked)}}
                                        />
                                    </div>
                                </Col>
                                <Col span={8} className="text-left">
                                    Intensity
                                </Col>
                                <Col span={16}>
                                    <div className="flex gap-[12px] flex-nowrap">
                                        <Slider
                                            min={0}
                                            max={10}
                                            step={0.1}
                                            className="w-full admin-form-slider"
                                            value={templateToneMappingExposure}
                                            onChange={(value) => {onToneExposureChange(value)}}
                                        />
                                        <InputNumber
                                            min={0}
                                            max={10}
                                            step={0.1}
                                            className="w-[100px] admin-form-input"
                                            value={templateToneMappingExposure}
                                            onChange={(value) => {onToneExposureChange(value)}}
                                        />
                                        <img src={ResetEditorIcon} alt="" className="cursor-pointer" onClick={() => {onToneExposureChange(1)}}/>
                                    </div>
                                </Col>
                                <Col span={8}></Col>
                                <Col span={16} className="flex justify-end">
                                    <Spin spinning={isLoading}>
                                        <button className="btn-upload-hdri" onClick={() => {onSaveHdriSetting()}}>
                                            Save
                                        </button>
                                    </Spin>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
        <ModalAddEditHdri 
            title="Add hdri"
            open={isShowModalAdd}
            onClose={() => {setIsShowModalAdd(false)}}
            item={null}
            onSuccess={() => {
                setIsShowModalAdd(false)
                loadListHdri()
            }}
        />
    </>
}
export default DrawerHdriSettings