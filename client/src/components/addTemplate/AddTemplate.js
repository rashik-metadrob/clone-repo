import { Col, Input, Row, Spin, notification } from "antd";
import "./styles.scss"
import ArrowLeftIcon from "../../assets/images/products/arrow-left.svg"
import SaveIcon from "../../assets/images/products/save.svg"
import { useNavigate } from "react-router-dom";
import UploadModel from "../../components/uploadModel/UploadModel";
import { useRef, useState } from "react";
import { uploadFile } from "../../api/upload.api";
import UploadImage from "../../components/uploadImage/UploadImage";
import { createProjectTemplate } from "../../api/project.api";
import { getStorageUserDetail } from "../../utils/storage";
import { UPLOADS_FOLDER } from "../../utils/constants";
const AddTemplate = ({
    onBack = () => {},
    onSuccess = () => {}
}) => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({})

    const uploadModelRef = useRef()
    const uploadImageRef = useRef()

    const currentUser = getStorageUserDetail();
    const [loading, setLoading] = useState(false)

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    const onSave = async () => {
        if(
            formData.name === undefined
        ){
            notification.warning({
                message: "Data is invalid!"
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
        const modelResult = await uploadFile(formModelData, 0, UPLOADS_FOLDER.TEMPLATE)
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
        const modelImageResult = await uploadFile(formImageData, 1, UPLOADS_FOLDER.TEMPLATE_THUMNAIL)
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
            listProducts: [],
            image: imageFileName,
            template: modelFileName,
            isLock: false,
            isBlank: false,
            type: "template",
            createdBy: currentUser.id
        }

        createProjectTemplate(productData).then((data) => {
            setLoading(false)
            notification.success({
                message: "Add template success!"
            })
            onSuccess()
        }).catch(err => {
            setLoading(false)
            notification.error({
                message: err.response?.data?.message || "Add template fail!"
            })
        })
    }

    return <>
        <div className="add-template-container">
            <div className="w-full flex items-center">
                <button className="btn-back" onClick={() => {onBack()}}>
                    <img src={ArrowLeftIcon} alt="" />
                    Back
                </button>
                <div className="text-add-product">
                    Add Template
                </div>
            </div>
            <Spin spinning={loading}>
                <Row gutter={[30, 30]} className="!ml-0 !mr-0 mt-[27px] add-product-form">
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <Input placeholder="Template Title" className="form-input" value={formData.name} onChange={(e) => {handleFormDataChange('name', e.target.value)}}/>
                    </Col>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <Input placeholder="Template Description" className="form-input" value={formData.description} onChange={(e) => {handleFormDataChange('description', e.target.value)}}/>
                    </Col>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <UploadImage ref={uploadImageRef} extraText="Add image for your template"/>
                    </Col>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <UploadModel ref={uploadModelRef} extraText="Add 3d model of your template (upload in format .glb, .fbx, .obj)"/>
                    </Col>
                </Row>
            </Spin>
            <Row gutter={[30, 30]} className="!ml-0 !mr-0 mt-[27px] justify-end pr-[30px]">
                <button className="btn-save-template" onClick={onSave} disabled={loading}>
                    <img src={SaveIcon} alt="" />
                    Save
                </button>
            </Row>
        </div>
    </>
}
export default AddTemplate;