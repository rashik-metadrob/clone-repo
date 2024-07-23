import { Checkbox, Col, Input, InputNumber, Row, Select, Spin, notification } from "antd"
import ArrowIcon from "../../../assets/images/products/arrow.svg"
import SaveIcon from "../../../assets/images/products/save.svg"
import "./styles.scss"
import { useEffect, useRef, useState } from "react"
import { createProduct, getListProductCurrencies, getListProductTypes } from "../../../api/product.api"
import UploadImage from "../../../components/uploadImage/UploadImage"
import UploadModel from "../../../components/uploadModel/UploadModel"
import TextArea from "antd/es/input/TextArea"
import { productCategoryApi } from "../../../api/productCategory.api"
import { uploadFile } from "../../../api/upload.api"
import { getStorageUserDetail } from "../../../utils/storage"
import { createProjectTemplate } from "../../../api/project.api"
import { CONTENT_TYPE, HDRI, PRODUCT_TYPES } from "../../../utils/constants"
import UploadFile from "../../../components/uploadFile/UploadFile"

// This file is deleted
const AdminUpload = () => {
    const currentUser = getStorageUserDetail()
    const [optionsProductTypes, setOptionsProductTypes] = useState([])
    const [formData, setFormData] = useState({})
    const [formDataTemplate, setFormDataTemplate] = useState({
        hdr: ""
    })
    const [loading, setLoading] = useState(false)

    const [uploadMode, setUploadMode] = useState("Template")

    const uploadModelRef = useRef()
    const uploadImageRef = useRef()

    const uploadHDRRef = useRef()
    const uploadTemplateModelRef = useRef()
    const uploadTemplateImageRef = useRef()

    const [listDecorativeCategories, setListDecorativeCategories] = useState([])
    const [optionsProductCurrencies, setOptionsProductCurrencies] = useState([])
    const [selectedProductCategory, setSelectedProductCategory] = useState()
    const [block, setBlock] = useState("3D")
    const [contentType, setContentType] = useState(CONTENT_TYPE.GENERAL)

    const [listHDRi, setListHDRi] = useState([
        {
            label: "Runtime",
            value: HDRI.FROM_SCENE
        }
    ])

    useEffect(() => {
        setFormDataTemplate({
            hdr: ""
        })
        setFormData({})
    }, [uploadMode])
    
    useEffect(() => {
        getListProductTypes().then(data => {
            setOptionsProductTypes(data.results)
        }).catch(err => {
        })

        getListProductCurrencies().then(data => {
            setOptionsProductCurrencies(data.results)
        }).catch(err => {

        })

        productCategoryApi.getListDecorativeCategories({limit: 1000, page: 1}).then(data => {
            setListDecorativeCategories(data)
        }).catch(err => {
            
        })
    }, [])

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    const handleFormDataTemplateChange = (type, value) => {
        setFormDataTemplate({
            ...formDataTemplate,
            [type]: value
        })
    }

    const handleChangeCategory = (id) => {
        if(uploadMode === "Product"){
            setSelectedProductCategory(id)
        }
    }

    const onSave = async () => {
        console.log("formData", formData, formDataTemplate)

        if(uploadMode === "Product"){
            if(
                formData.name === undefined
                || formData.description === undefined
            ){
                notification.warning({
                    message: "Data is invalid!"
                })
                return
            }

            if(!selectedProductCategory){
                notification.warning({
                    message: "Category isn't choosen!"
                })
                return
            }

            const modelFile = uploadModelRef.current.getFile()

            if(!modelFile){
                notification.warning({
                    message: "Model can't be null!"
                })
                return
            }

            const imageFile = uploadImageRef.current.getFile()

            if(!imageFile){
                notification.warning({
                    message: "Image can't be null!"
                })
                return
            }

            setLoading(true)

            const formModelData = new FormData();
            formModelData.append("file", modelFile);
            const modelResult = await uploadFile(formModelData)
            if(modelResult.status && modelResult.status !== 200){
                notification.error({
                    message: modelResult.data.message
                })
                setLoading(false)
                return
            }
            let modelFileName = modelResult.results

            const formImageData = new FormData();
            formImageData.append("file", imageFile);
            const modelImageResult = await uploadFile(formImageData, 1)
            if(modelImageResult.status && modelImageResult.status !== 200){
                notification.error({
                    message: modelImageResult.data.message
                })
                setLoading(false)
                return
            }
            let imageFileName = modelImageResult.results

            let productData = {
                ...formData,
                categoryId: selectedProductCategory,
                image: imageFileName,
                objectUrl: modelFileName,
                type: PRODUCT_TYPES.DECORATIVES,
                block: block,
                contentType: contentType
            }

            createProduct(productData).then((data) => {
                notification.success({
                    message: "Add product success!"
                })
                setLoading(false)
            }).catch(err => {
                notification.error({
                    message: err.response?.data?.message || "Add product fail!"
                })
                setLoading(false)
            })
        }

        if(uploadMode === "Template"){
            if(
                formDataTemplate.name === undefined
            ){
                notification.warning({
                    message: "Data is invalid!"
                })
                return
            }
            let hdrFile = null
            if(formDataTemplate.hdr === HDRI.CUSTOM){
                hdrFile = uploadHDRRef.current.getFile()
                if(!hdrFile){
                    notification.warning({
                        message: "HDR file can't be null!"
                    })
                    return
                }
            }

            const modelFile = uploadTemplateModelRef.current.getFile()
    
            if(!modelFile){
                notification.warning({
                    message: "Model can't be null!"
                })
                return
            }
    
            const imageFile = uploadTemplateImageRef.current.getFile()
    
            if(!imageFile){
                notification.warning({
                    message: "Image can't be null!"
                })
                return
            }
    
            setLoading(true)
    
            const formModelData = new FormData();
            formModelData.append("file", modelFile);
            const modelResult = await uploadFile(formModelData)
            if(modelResult.status && modelResult.status !== 200){
                notification.error({
                    message: modelResult.data.message
                })
                setLoading(false)
                return
            }
            let modelFileName = modelResult.results
    
            const formImageData = new FormData();
            formImageData.append("file", imageFile);
            const modelImageResult = await uploadFile(formImageData, 1)
            if(modelImageResult.status && modelImageResult.status !== 200){
                notification.error({
                    message: modelImageResult.data.message
                })
                setLoading(false)
                return
            }
            let imageFileName = modelImageResult.results

            let projectHdr = formDataTemplate.hdr;
            if(projectHdr === HDRI.CUSTOM && hdrFile){
                const formHdrData = new FormData();
                formHdrData.append("file", hdrFile);
                const hdrResult = await uploadFile(formHdrData)
                if(hdrResult.status && hdrResult.status !== 200){
                    notification.error({
                        message: hdrResult.data.message
                    })
                    setLoading(false)
                    return
                }
                projectHdr = hdrResult.results
            }
    
            let projectData = {
                ...formDataTemplate,
                listProducts: [],
                image: imageFileName,
                template: modelFileName,
                isLock: false,
                isBlank: false,
                type: "template",
                createdBy: currentUser.id,
                hdr: projectHdr,
                contentType: contentType
            }
    
            createProjectTemplate(projectData).then((data) => {
                setLoading(false)
                notification.success({
                    message: "Add template success!"
                })
            }).catch(err => {
                setLoading(false)
                notification.error({
                    message: err.response?.data?.message || "Add template fail!"
                })
            })
        }
    }

    return <>
        <div className="add-form-container">
            <div className="text-add-form !text-left px-[30px] !w-full">
                Upload
            </div>
            <Spin spinning={loading}>
                <Row gutter={[30, 30]} className="!ml-0 !mr-0 mt-[27px] add-form-form">
                    <Col lg={16} md={16} sm={24} xs={24}>
                        <Row gutter={[30, 30]}>
                            <Row gutter={[30, 30]} className="!ml-0 !mr-0 w-full">
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Select
                                        placeholder="Choose mode"
                                        className="form-select w-full"
                                        suffixIcon={<img src={ArrowIcon} alt="" />}
                                        value={uploadMode}
                                        options={[
                                            {
                                                label: "Template",
                                                value: "Template"
                                            },
                                            {
                                                label: "Product",
                                                value: "Product"
                                            }
                                        ]}
                                        onChange={(value) => {setUploadMode(value)}}
                                    />
                                </Col>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Select
                                        placeholder="Content Type"
                                        className="form-select w-full"
                                        suffixIcon={<img src={ArrowIcon} alt="" />}
                                        options={[
                                            {
                                                label: "General Content",
                                                value: CONTENT_TYPE.GENERAL
                                            },
                                            {
                                                label: "Special Content",
                                                value: CONTENT_TYPE.SPECIAL
                                            }
                                        ]}
                                        value={contentType}
                                        onChange={(e) => {setContentType(e)}}
                                    />
                                </Col>
                            </Row>
                            { uploadMode === "Product"
                                && <>
                                    <Row gutter={[30, 30]} className="!ml-0 !mr-0 w-full">
                                        <Col lg={8} md={12} sm={24} xs={24}>
                                            <Select
                                                placeholder="Type"
                                                value={block}
                                                onChange={(value) => {setBlock(value)}}
                                                className="form-select w-full"
                                                suffixIcon={<img src={ArrowIcon} alt="" />}
                                                options={[
                                                    {
                                                        label: "2D",
                                                        value: "2D"
                                                    },
                                                    {
                                                        label: "3D",
                                                        value: "3D"
                                                    }
                                                ]}
                                            />
                                        </Col>
                                        <Col lg={16} md={12} sm={24} xs={24}>
                                            <Input placeholder={'Decorative Title'} className="form-input" onChange={(e) => {handleFormDataChange('name', e.target.value)}}/>
                                        </Col>
                                    </Row>
                                    <Row gutter={[30, 30]} className="!ml-0 !mr-0 w-full">
                                        <Col lg={6} md={12} sm={24} xs={24}>
                                            <UploadImage 
                                                ref={uploadImageRef}
                                                title={"Thumnail"}
                                                extraText=""
                                            />
                                        </Col>
                                        <Col lg={18} md={12} sm={24} xs={24}>
                                            <UploadModel 
                                                ref={uploadModelRef}
                                                title={block === "2D" ? "Add Image" : "Add 3d model"}
                                                extraText={block === "2D" ? `Upload your decorative image (.png, .jpg)` : `Add 3d model of your decorative (upload in format .glb, .fbx, .obj)`}
                                                accept={block === "2D" ? ".jpg,.png" : ".glb,.fbx,.obj"}
                                            />
                                        </Col>
                                    </Row>
                                    <Col lg={24} md={24} sm={24} xs={24}>
                                        <div className="w-full mb-[25px] text-description">
                                            Description
                                        </div>
                                        <TextArea 
                                            className="form-input" 
                                            autoSize={{
                                                minRows: 6,
                                                maxRows: 6,
                                            }}
                                            onChange={(e) => {handleFormDataChange('description', e.target.value)}}
                                        />
                                    </Col>
                                </>
                            }
                            {   uploadMode === "Template"
                                && <>
                                    <Row gutter={[30, 30]} className="!ml-0 !mr-0">
                                        <Col lg={24} md={24} sm={24} xs={24}>
                                            <Input placeholder="Template Title" className="form-input" value={formDataTemplate.name} onChange={(e) => {handleFormDataTemplateChange('name', e.target.value)}}/>
                                        </Col>
                                        <Col lg={12} md={12} sm={24} xs={24}>
                                            <Input placeholder="Template Description" className="form-input" value={formDataTemplate.description} onChange={(e) => {handleFormDataTemplateChange('description', e.target.value)}}/>
                                        </Col>
                                        <Col lg={12} md={12} sm={24} xs={24}>
                                            <Select
                                                placeholder="Select HDRI"
                                                className="form-select w-full"
                                                suffixIcon={<img src={ArrowIcon} alt="" />}
                                                options={listHDRi}
                                                value={formDataTemplate.hdr}
                                                onChange={(e) => {handleFormDataTemplateChange('hdr', e)}}
                                            />
                                        </Col>
                                        <Row gutter={[30, 30]} className="!ml-0 !mr-0 w-full">
                                            <Col lg={8} md={12} sm={24} xs={24}>
                                                <UploadImage ref={uploadTemplateImageRef} extraText="Add image for your template"/>
                                            </Col>
                                            <Col lg={16} md={12} sm={24} xs={24}>
                                                <UploadModel ref={uploadTemplateModelRef} extraText="Add 3d model of your template (upload in format .glb, .fbx, .obj)"/>
                                            </Col>
                                        </Row>
                                        {formDataTemplate.hdr === HDRI.CUSTOM && <Col lg={24} md={24} sm={24} xs={24}>
                                            <UploadFile 
                                                ref={uploadHDRRef} 
                                                title="Upload HDRi file"
                                                extraText="Add HDRi file"
                                                accept=".hdr"
                                            />
                                        </Col>}
                                    </Row>
                                </>
                            }
                        </Row>
                        <Row gutter={[30, 30]} className="!ml-0 !mr-0 mt-[27px] justify-end pr-[30px]">
                            <button className="btn-save" onClick={onSave}>
                                <img src={SaveIcon} alt="" />
                                Save
                            </button>
                        </Row>
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24} className={`special-container ${uploadMode === "Product" ? '' : 'disabled'}`}>
                        <div className="text-special-category">
                            Special Category
                        </div>
                        <Row gutter={[24, 24]} className="mt-[26px]">
                            {
                                listDecorativeCategories.map((el, index) => {
                                    return <>
                                        <Col key={el.id} lg={12} md={12} sm={24} xs={24} className="flex justify-start">
                                            <Checkbox 
                                                className="shared-checkbox" 
                                                checked={!(uploadMode === "Template") && selectedProductCategory === el.id} 
                                                onClick={() => {handleChangeCategory(el.id)}}
                                            >
                                                {el.name}
                                            </Checkbox>
                                        </Col>
                                    </>
                                })
                            }
                        </Row>
                    </Col>
                </Row>
            </Spin>
        </div>
    </>
}
export default AdminUpload;