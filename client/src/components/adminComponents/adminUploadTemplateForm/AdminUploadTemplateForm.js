import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Checkbox, Col, Input, Row, Select, Spin, notification } from "antd";
import UploadImage from "../../uploadImage/UploadImage";
import UploadImageIcon from "../../../assets/icons/UploadImage"
import UploadModel from "../../uploadModel/UploadModel";
import { FORM_STATUS, FORM_STATUS_INFO, HDRI, PROJECT_TYPE, UPLOADS_FOLDER } from "../../../utils/constants";
import ArrowIcon from "../../../assets/images/products/arrow.svg"
import { uploadFile } from "../../../api/upload.api";
import { getStorageUserDetail } from "../../../utils/storage";
import { createProjectTemplate } from "../../../api/project.api";
import _ from "lodash"
import pricingPlanApi from "../../../api/pricingPlan.api";
import UploadFile from "../../uploadFile/UploadFile";
import hdriApi from "../../../api/hdri.api";
import TextArea from "antd/es/input/TextArea";
import HdriDefaultThumnailImage from "../../../assets/images/admin/hdri-default-thumnail.png"
import { getAssetsUrl } from "../../../utils/util";

const AdminUploadTemplateForm = forwardRef(({

}, ref) => {
    const uploadTemplateImageRef = useRef()
    const uploadHDRIImageRef = useRef()
    const uploadTemplateModelRef = useRef()
    const uploadHDRRef = useRef()
    const [formDataTemplate, setFormDataTemplate] = useState({
    })
    const [loading, setLoading] = useState(false)
    const currentUser = getStorageUserDetail();

    const [hdriName, setHdriName] = useState("")

    const [formStatus, setFormStatus] = useState(FORM_STATUS.NONE)
    const [planOptions, setPlanOptions] = useState([])
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
        loadListHdri(true)
    }, [])

    useImperativeHandle(ref, () => ({
        submit: async (el) => {
            // Hanlde upload and return true or false.
            return handleSubmit()
        },
        resetForm: () => {
            setFormStatus(FORM_STATUS.NONE)
            setFormDataTemplate({})
            loadListHdri()
            setLoading(false)
        }
    }));

    useEffect(() => {
        pricingPlanApi.getPricingPlans().then(rs => {
            if(rs && rs.length > 0){
                setPlanOptions(rs.map(el => {
                    return {
                        value: el.id,
                        label: el.name
                    }
                }))
            }
        })
    },[])

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
                    setFormDataTemplate((prevState) => {
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

    // Return true or false
    const handleSubmit = async () => {
        if(
            formDataTemplate.name === undefined
        ){
            setFormStatus(FORM_STATUS.DATA_INVALID)
            return false
        }

        const modelFile = uploadTemplateModelRef.current.getFile()

        if(!modelFile){
            setFormStatus(FORM_STATUS.DATA_INVALID)
            return false
        }

        const imageFile = uploadTemplateImageRef.current.getFile()

        if(!imageFile){
            setFormStatus(FORM_STATUS.DATA_INVALID)
            return false
        }

        let hdrFile = null
        if(formDataTemplate.hdr === HDRI.CUSTOM){
            hdrFile = uploadHDRRef.current.getFile()
            if(!hdrFile){
                notification.warning({
                    message: "HDR file can't be null!"
                })
                setFormStatus(FORM_STATUS.DATA_INVALID)
                return false
            }
        }
        let hdrImageFile = null
        if(formDataTemplate.hdr === HDRI.CUSTOM){
            hdrImageFile = uploadHDRIImageRef.current.getFile()
            if(!hdrImageFile){
                notification.warning({
                    message: "HDR thumnail can't be null!"
                })
                setFormStatus(FORM_STATUS.DATA_INVALID)
                return false
            }
        }

        setLoading(true)

        const formModelData = new FormData();
        formModelData.append("file", modelFile);
        console.log('modelFile', modelFile)
        const modelResult = await uploadFile(formModelData, 0, UPLOADS_FOLDER.TEMPLATE)
        if(modelResult.status && modelResult.status !== 200){
            notification.error({
                message: modelResult.data.message
            })
            setLoading(false)
            setFormStatus(FORM_STATUS.UPLOAD_FAIL)
            return false
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
        let modelFileName = modelResult.results

        const formImageData = new FormData();
        formImageData.append("file", imageFile);
        const modelImageResult = await uploadFile(formImageData, 1, UPLOADS_FOLDER.TEMPLATE_THUMNAIL)
        if(modelImageResult.status && modelImageResult.status !== 200){
            notification.error({
                message: modelImageResult.data.message
            })
            setLoading(false)
            setFormStatus(FORM_STATUS.UPLOAD_FAIL)
            return false
        }
        let imageFileName = modelImageResult.results

        let hdr = formDataTemplate.hdr
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
            ...formDataTemplate,
            listProducts: [],
            image: imageFileName,
            template: modelFileName,
            isLock: false,
            isBlank: false,
            type: PROJECT_TYPE.TEMPLATE,
            createdBy: currentUser.id,
            hdr: hdr
        }

        const project = await createProjectTemplate(projectData);

        if(project && project.id){
            setFormStatus(FORM_STATUS.SUCCESS)
            setLoading(false)
            return true
        } else {
            setFormStatus(FORM_STATUS.FAIL)
            setLoading(false)
            return false
        }
    }

    const onHDRIChange = (value) => {
        setIsShowSelectHDRI(false)
        handleFormDataTemplateChange('hdr', value)
    }

    const handleFormDataTemplateChange = (type, value) => {
        setFormDataTemplate({
            ...formDataTemplate,
            [type]: value
        })
    }

    const onSelectAllPlanChange = (value) => {
        setIsSelectAllPlan(value)
        if(value){
            handleFormDataTemplateChange('plans', planOptions.map(el => el.value))
        } else {
            handleFormDataTemplateChange('plans', [])
        }
    }

    const onSelectPlan = (value, checked) => {
        if(checked && (!formDataTemplate.plans || !formDataTemplate.plans.includes(value))){
            handleFormDataTemplateChange('plans', [...(formDataTemplate.plans || []), value])
        }

        if(!checked && formDataTemplate.plans && formDataTemplate.plans.includes(value)){
            handleFormDataTemplateChange('plans', formDataTemplate.plans.filter(el => el !== value))
        }
    }

    return <>
        <Spin spinning={loading}>
            <Row gutter={[22, 16]} className={`${_.get(FORM_STATUS_INFO, [formStatus, 'className'], 'upload-form-none')}`}>
                <Col lg={8} md={12} span={24}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Input placeholder={'Name'} className="admin-form-input" onChange={(e) => {handleFormDataTemplateChange('name', e.target.value)}}/>
                        </Col>
                        <Col span={24}>
                            <Select
                                mode="multiple"
                                placeholder="Select Plan"
                                className="admin-form-select w-full"
                                popupClassName="admin-form-select-popup-plans"
                                showSearch
                                suffixIcon={<img src={ArrowIcon} alt="" />}
                                value={formDataTemplate.plans}
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
                                                        <Checkbox checked={formDataTemplate.plans && formDataTemplate.plans.includes(el.value)} onChange={(e) => {onSelectPlan(el.value, e.target.checked)}}>
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
                <Col lg={4} md={12} span={24}>
                    <UploadImage 
                        ref={uploadTemplateImageRef}
                        title={"Thumnail"}
                        extraText=""
                        className="admin-image-uploader"
                        uploadImage={<UploadImageIcon />}
                    />
                </Col>
                <Col lg={12} md={24} span={24}>
                    <UploadModel 
                        ref={uploadTemplateModelRef}
                        title={"Add 3d model"}
                        extraText={`Drag & drop your 3d model of Showroom (upload in format .Fbx .Glb .obj)`}
                        accept={".glb,.fbx,.obj"}
                        className="admin-model-uploader"
                    />
                </Col>
                <Col lg={8} md={12} span={24}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
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
                                value={formDataTemplate.hdr}
                                open={isShowSelectHDRI}
                                onDropdownVisibleChange={(open) => {setIsShowSelectHDRI(open)}}
                            />
                        </Col>
                        {formDataTemplate.hdr === HDRI.CUSTOM && <>
                            <Col span={24}>
                                <Row gutter={[16, 16]}>
                                    <Col lg={24} md={24} sm={24} xs={24}>
                                        <Input placeholder={'Hdri name'} value={hdriName} className="admin-form-input" onChange={(e) => {setHdriName(e.target.value)}}/>
                                    </Col>
                                    <Col lg={24} md={24} sm={24} xs={24}>
                                        <UploadImage 
                                            ref={uploadHDRIImageRef}
                                            title={"HDRI Thumnail"}
                                            extraText=""
                                            className="admin-image-uploader"
                                            uploadImage={<UploadImageIcon />}
                                        />
                                    </Col>
                                    <Col lg={24} md={24} sm={24} xs={24}>
                                        <UploadFile 
                                            ref={uploadHDRRef} 
                                            title="Upload HDRi file"
                                            extraText=""
                                            accept=".hdr"
                                            className="admin-model-uploader"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            </>
                        }
                    </Row>
                </Col>
                <Col lg={16} md={12} span={24}>
                    <TextArea 
                        placeholder={'Description'} 
                        className="admin-form-input" 
                        rows={4} 
                        maxLength={600} 
                        value={formDataTemplate.description}
                        onChange={(e) => {handleFormDataTemplateChange('description', e.target.value)}}
                    />
                </Col>
                {formStatus !== FORM_STATUS.NONE && <Col span={24}>
                    <div className="form-status-text">
                        {_.get(FORM_STATUS_INFO, [formStatus, 'text'], '')}
                    </div>
                </Col>}
            </Row>
        </Spin>
    </>
})
export default AdminUploadTemplateForm;