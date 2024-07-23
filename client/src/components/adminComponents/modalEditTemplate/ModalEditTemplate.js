import { Checkbox, Col, Input, Modal, Row, Select, Spin, notification } from "antd"
import ModalExitIcon from "../../../assets/images/project/modal-exit.svg"
import "./styles.scss"
import ArrowIcon from "../../../assets/images/products/arrow.svg"
import { useEffect, useRef, useState } from "react"
import UploadImage from "../../uploadImage/UploadImage"
import UploadImageIcon from "../../../assets/icons/UploadImage"
import UploadModel from "../../uploadModel/UploadModel"
import pricingPlanApi from "../../../api/pricingPlan.api"
import _ from "lodash"
import { uploadFile } from "../../../api/upload.api"
import { updateProjectById } from "../../../api/project.api"
import { HDRI, UPLOADS_FOLDER } from "../../../utils/constants"
import UploadFile from "../../uploadFile/UploadFile"
import hdriApi from "../../../api/hdri.api"
import { getAssetsUrl } from "../../../utils/util"
import HdriDefaultThumnailImage from "../../../assets/images/admin/hdri-default-thumnail.png"
import TextArea from "antd/es/input/TextArea"
import TemplateLogsTable from "./components/templateLogsTable/TemplateLogsTable"

const ModalEditTemplate = ({
    open,
    onClose = () => {},
    item,
    onSuccess = () => {}
}) => {
    const uploadTemplateImageRef = useRef()
    const uploadHDRIImageRef = useRef()
    const uploadTemplateModelRef = useRef()
    const uploadHDRRef = useRef()
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const [planOptions, setPlanOptions] = useState([])

    const [hdriName, setHdriName] = useState("")
    const [isShowSelectPlan, setIsShowSelectPlan] = useState(false)
    const [isSelectAllPlan, setIsSelectAllPlan] = useState(false)

    const [isShowSelectHDRI, setIsShowSelectHDRI] = useState(false)
    const [listHDRi, setListHDRi] = useState([
        // {
        //     label: "Custom",
        //     value: HDRI.CUSTOM
        // },
        // {
        //     label: "Runtime",
        //     value: HDRI.FROM_SCENE
        // }
    ])

    useEffect(() => {
        pricingPlanApi.getPricingPlans().then(rs => {
            if(rs && rs.length > 0){
                setPlanOptions(rs.map(el => {
                    return {
                        value: el.id,
                        thumnail: el.thumnail ?? "",
                        label: el.name
                    }
                }))
            }
        })
    },[])

    useEffect(() => {
        loadListHdri(true)
    }, [])

    useEffect(() => {
        if(open && item){
            const newFormData = _.pick(item, ["image", "template", "name", "plans", "hdr", "description", "updateLogs"])
            newFormData.plans = newFormData?.plans ? _.filter(newFormData.plans.map(el => _.get(el, "id", null)), el => !_.isNull(el)) : []
            setFormData(newFormData)
        }
    }, [open, item])

    const loadListHdri = (isResetData = false) => {
        hdriApi.getAllHdri({ isOnlyNonDisable: true }).then(data => {
            if(data && data.length > 0){
                const newList = [
                    ...data.map(el => {
                        return {
                            label: el.name,
                            thumnail: el.thumnail ?? "",
                            value: el.id
                        }
                    }),
                    // {
                    //     label: "Custom",
                    //     value: HDRI.CUSTOM
                    // },
                    // {
                    //     label: "Runtime",
                    //     value: HDRI.FROM_SCENE
                    // }
                ]
                if(newList.length > 0 && isResetData){
                    setFormData((prevState) => {
                        return {
                            ...prevState,
                            hdr: newList[0].value
                        }
                    })
                }

                setListHDRi(newList)
            }
        })
    }

    const onHDRIChange = (value) => {
        setIsShowSelectHDRI(false)
        handleFormDataChange('hdr', value)
    }

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    const handleSubmit = async () => {
        const itemId = item.id || item._id

        if(!itemId){
            notification.warning({message: "Id can't be found!"})
            return
        }

        if(
            formData.name === undefined
        ){
            notification.warning({message: "Name can't not be null!"})
            return
        }

        let hdrFile = null
        if(formData.hdr === HDRI.CUSTOM){
            hdrFile = uploadHDRRef.current.getFile()
            if(!hdrFile){
                notification.warning({
                    message: "HDR file can't be null!"
                })
                return false
            }
        }
        let hdrImageFile = null
        if(formData.hdr === HDRI.CUSTOM){
            hdrImageFile = uploadHDRIImageRef.current.getFile()
            if(!hdrImageFile){
                notification.warning({
                    message: "HDR thumnail can't be null!"
                })
                return false
            }
        }

        const modelFile = uploadTemplateModelRef.current.getFile()
        const imageFile = uploadTemplateImageRef.current.getFile()

        setLoading(true)

        let modelFileName = formData.template
        if(modelFile){
            const formModelData = new FormData();
            formModelData.append("file", modelFile);
            const modelResult = await uploadFile(formModelData, 0, UPLOADS_FOLDER.TEMPLATE)
            if(modelResult.status && modelResult.status !== 200){
                notification.error({
                    message: modelResult.data.message
                })
                setLoading(false)
                return
            } else {
                if(
                    !_.get(modelResult, ['data', 'cameraAndSpawnPointInfo', 'isHasCamera'], false)
                    && !_.get(modelResult, ['data', 'cameraAndSpawnPointInfo', 'isHasSpawnPoint'], false)
                ) {
                    notification.warning({
                        message: `File ${modelFile.name} doesn't have cameras and spawn points.`
                    })
                } else if(!_.get(modelResult, ['data', 'cameraAndSpawnPointInfo', 'isHasCamera'], false)) {
                    notification.warning({
                        message: `File ${modelFile.name} doesn't have cameras.`
                    })
                } else if(!_.get(modelResult, ['data', 'cameraAndSpawnPointInfo', 'isHasSpawnPoint'], false)) {
                    notification.warning({
                        message: `File ${modelFile.name} doesn't have spawn points.`
                    })
                }
            }
            modelFileName = modelResult.results
        }
        
        let imageFileName = formData.image
        if(imageFile){
            const formImageData = new FormData();
            formImageData.append("file", imageFile);
            const modelImageResult = await uploadFile(formImageData, 1, UPLOADS_FOLDER.TEMPLATE_THUMNAIL)
            if(modelImageResult.status && modelImageResult.status !== 200){
                notification.error({
                    message: modelImageResult.data.message
                })
                setLoading(false)
                return
            }
            imageFileName = modelImageResult.results
        }

        let hdr = formData.hdr
        let newHdriPath = ""
        let newHdriImagePath = ""
        if(hdr === HDRI.CUSTOM && hdrFile && hdrImageFile){
            if(!hdriName || !hdriName.trim()){
                notification.error({
                    message: "Hdri name can't be null!"
                })
                setLoading(false)
                return false
            }

            const formHdrData = new FormData();
            formHdrData.append("file", hdrFile);
            const hdrResult = await uploadFile(formHdrData, 0, UPLOADS_FOLDER.HDRI)
            if(hdrResult.status && hdrResult.status !== 200){
                notification.error({
                    message: hdrResult.data.message
                })
                setLoading(false)
                return false
            }
            newHdriPath = hdrResult.results

            const formHdrImageData = new FormData();
            formHdrImageData.append("file", hdrImageFile);
            const hdrImageResult = await uploadFile(formHdrImageData, 1, UPLOADS_FOLDER.HDRI_THUMNAILS)
            if(hdrImageResult.status && hdrImageResult.status !== 200){
                notification.error({
                    message: hdrImageResult.data.message
                })
                setLoading(false)
                return false
            }
            newHdriImagePath = hdrImageResult.results

            const newHdri = await hdriApi.createHdri({
                name: hdriName,
                thumnail: newHdriImagePath,
                filePath: newHdriPath,
                size: hdrImageResult.size
            })

            if(newHdri && newHdri.id){
                hdr = newHdri.id
                loadListHdri()
            } else {
                notification.error({
                    message: "Can't create new hdri!"
                })
                setLoading(false)
                return false
            }
        }
        

        let projectData = {
            ...formData,
            image: imageFileName,
            template: modelFileName,
            hdr: hdr,

            shouldSaveLog: true,
        }

        if(projectData.updateLogs){
            delete projectData.updateLogs
        }

        const project = await updateProjectById(itemId, projectData);
        if(project && project.id){
            notification.success({
                message: "Update successfully!"
            })
            setLoading(false)
            onSuccess()
        } else {
            notification.success({
                message: "Update failed!"
            })
            setLoading(false)
        }
    }

    const onSelectAllPlanChange = (value) => {
        setIsSelectAllPlan(value)
        if(value){
            handleFormDataChange('plans', planOptions.map(el => el.value))
        } else {
            handleFormDataChange('plans', [])
        }
    }

    const onSelectPlan = (value, checked) => {
        if(checked && (!formData.plans || !formData.plans.includes(value))){
            handleFormDataChange('plans', [...(formData.plans || []), value])
        }

        if(!checked && formData.plans && formData.plans.includes(value)){
            handleFormDataChange('plans', formData.plans.filter(el => el !== value))
        }
    }

    return <>
        <Modal
            open={open}
            width={794}
            footer={null}
            closeIcon={<img src={ModalExitIcon} alt="" />}
            destroyOnClose={true}
            closable={true}
            centered
            className="modal-admin-edit modal-edit-decorative"
            onCancel={() => {onClose()}}
        >
            <div className="modal-edit-decorative-content">
                <div className="title">
                    Edit Template
                </div>
                <Spin spinning={loading}>
                    <Row gutter={[22, 8]} className="mt-[16px]">
                        <Col span={24}>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Input placeholder={'Name'} className="admin-form-input" value={formData?.name} onChange={(e) => {handleFormDataChange('name', e.target.value)}}/>
                                </Col>
                                <Col span={24}>
                                    <Select
                                        mode="multiple"
                                        placeholder="Select Plan"
                                        className="admin-form-select w-full"
                                        popupClassName="admin-form-select-popup-plans"
                                        showSearch
                                        suffixIcon={<img src={ArrowIcon} alt="" />}
                                        value={formData?.plans}
                                        options={planOptions}
                                        open={isShowSelectPlan}
                                        onDropdownVisibleChange={(value) => {setIsShowSelectPlan(value)}}
                                        onDeselect={(value) => {onSelectPlan(value, false)}}
                                        dropdownRender={() => (
                                            <>
                                                <div className="popup-content">
                                                    <div className="item">
                                                        <Checkbox checked={isSelectAllPlan} onChange={(e) => {onSelectAllPlanChange(e.target.checked)}}>
                                                            <span className="text">All Plans</span>
                                                        </Checkbox>
                                                    </div>
                                                    {
                                                        planOptions && planOptions.map(el => <>
                                                            <div className="item" key={el.value}>
                                                                <Checkbox checked={formData.plans && formData.plans.includes(el.value)} onChange={(e) => {onSelectPlan(el.value, e.target.checked)}}>
                                                                    <span className="text">{el.label}</span>
                                                                </Checkbox>
                                                            </div>
                                                        </>)
                                                    }
                                                </div>
                                            </>
                                        )}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row gutter={[16, 16]}>
                                <Col xl={8} lg={8} span={24}>
                                    <Select
                                        placeholder="Select HDRI"
                                        className="admin-form-select w-full"
                                        popupClassName="admin-form-select-popup-with-image"
                                        dropdownRender={() => (
                                            <>
                                                <div className="popup-content">
                                                    <div className="item" onClick={(e) => {onHDRIChange(HDRI.CUSTOM)}}>
                                                        <span>
                                                            Upload HDRI
                                                        </span>
                                                    </div>
                                                    <div className="item" onClick={(e) => {onHDRIChange(HDRI.FROM_SCENE)}}>
                                                        <span>
                                                            HDRI Runtime
                                                        </span>
                                                    </div>
                                                    <div className="item-divider"></div>
                                                    {
                                                        listHDRi.map(el => (
                                                            <div className="item" onClick={(e) => {onHDRIChange(el.value)}}>
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
                                        options={
                                            listHDRi.concat([{
                                                label: "Custom",
                                                value: HDRI.CUSTOM
                                            },
                                            {
                                                label: "Runtime",
                                                value: HDRI.FROM_SCENE
                                            }])
                                        }
                                        value={formData.hdr}
                                        open={isShowSelectHDRI}
                                        onDropdownVisibleChange={(open) => {setIsShowSelectHDRI(open)}}
                                    />
                                </Col>
                                {formData.hdr === HDRI.CUSTOM && <>
                                    <Col xl={16} lg={16} span={24}>
                                        <Row gutter={[16, 16]}>
                                            <Col span={24}>
                                                <Input 
                                                    placeholder={'Hdri name'} 
                                                    value={hdriName} 
                                                    className="admin-form-input" 
                                                    onChange={(e) => {setHdriName(e.target.value)}}
                                                />
                                            </Col>
                                            <Col span={24}>
                                                <UploadImage 
                                                    ref={uploadHDRIImageRef}
                                                    title={"HDRI Thumnail"}
                                                    extraText=""
                                                    className="admin-image-uploader"
                                                    uploadImage={<UploadImageIcon />}
                                                />
                                            </Col>
                                            <Col span={24}>
                                                <UploadFile 
                                                    ref={uploadHDRRef} 
                                                    title="Upload HDRi file"
                                                    extraText=""
                                                    accept=".hdr"
                                                    className="admin-model-uploader"
                                                    placeholderFileName={formData?.hdr !== "custom" ? formData?.hdr : ""}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </>}
                            </Row>
                        </Col>
                        <Col lg={8} md={8} span={24}>
                            <UploadImage 
                                ref={uploadTemplateImageRef}
                                title={"Thumnail"}
                                extraText=""
                                className="admin-image-uploader"
                                placeholderFileName={formData?.image}
                                uploadImage={<UploadImageIcon />}
                            />
                        </Col>
                        <Col lg={16} md={16} span={24}>
                            <UploadModel 
                                ref={uploadTemplateModelRef}
                                title={"Add 3d model"}
                                extraText={`Drag & drop your 3d model of Decorative (upload in format .Fbx .Glb .obj)`}
                                accept={".glb,.fbx,.obj"}
                                placeholderFileName={formData?.template}
                                className="admin-model-uploader"
                            />
                        </Col>
                        <Col span={24}>
                            <TextArea 
                                placeholder={'Description'} 
                                className="admin-form-input" 
                                rows={4} 
                                maxLength={600}
                                value={formData.description}
                                onChange={(e) => {handleFormDataChange('description', e.target.value)}}
                            />
                        </Col>
                        <Col span={24}>
                            <TemplateLogsTable logs={_.get(formData, ['updateLogs'], [])} />
                        </Col>
                    </Row>
                </Spin>
                <div className="flex items-center justify-center mt-[18px]">
                    <div className="btn-save" onClick={handleSubmit}>
                        Save
                    </div>
                </div>
            </div>
        </Modal>
    </>
}
export default ModalEditTemplate