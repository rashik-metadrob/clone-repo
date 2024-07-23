import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { Col, Input, Row, Select, Spin, notification } from "antd";
import UploadImage from "../../uploadImage/UploadImage";
import UploadImageIcon from "../../../assets/icons/UploadImage"
import UploadModel from "../../uploadModel/UploadModel";
import { FORM_STATUS, FORM_STATUS_INFO, MODEL_BLOCK, PRODUCT_TYPES, UPLOADS_FOLDER } from "../../../utils/constants";
import ArrowIcon from "../../../assets/images/products/arrow.svg"
import { uploadFile } from "../../../api/upload.api";
import { getStorageUserDetail } from "../../../utils/storage";
import _ from "lodash"
import { createProduct } from "../../../api/product.api";
import TagsInput from "../../tagsInput/TagsInput";

const AdminUploadAnimationForm = forwardRef(({

}, ref) => {
    const uploadTemplateImageRef = useRef()
    const uploadTemplateModelRef = useRef()
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const currentUser = getStorageUserDetail();

    const [formStatus, setFormStatus] = useState(FORM_STATUS.NONE)

    useImperativeHandle(ref, () => ({
        submit: async (el) => {
            // Hanlde upload and return true or false.
            return handleSubmit()
        },
        resetForm: () => {
            setFormStatus(FORM_STATUS.NONE)
            setFormData()
            setLoading(false)
        }
    }));

    // Return true or false
    const handleSubmit = async () => {
        if(
            formData.name === undefined
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

        setLoading(true)

        const formModelData = new FormData();
        formModelData.append("file", modelFile);
        const modelResult = await uploadFile(formModelData, 0, UPLOADS_FOLDER.ANIMATION)
        if(modelResult.status && modelResult.status !== 200){
            notification.error({
                message: modelResult.data.message
            })
            setLoading(false)

            setFormStatus(FORM_STATUS.UPLOAD_FAIL)
            return false
        }
        let modelFileName = modelResult.results

        const formImageData = new FormData();
        formImageData.append("file", imageFile);
        const modelImageResult = await uploadFile(formImageData, 1, UPLOADS_FOLDER.ANIMATION_THUMNAIL)
        if(modelImageResult.status && modelImageResult.status !== 200){
            notification.error({
                message: modelImageResult.data.message
            })
            setLoading(false)
            setFormStatus(FORM_STATUS.UPLOAD_FAIL)
            return false
        }
        let imageFileName = modelImageResult.results

        return false

        // let productData = {
        //     ...formData,
        //     image: imageFileName,
        //     objectUrl: modelFileName,
            // type: PRODUCT_TYPES.ANIMATION,
        //     block: MODEL_BLOCK["3D"]
        // }

        // const product = await createProduct(productData);
        // if(product && product.id){
        //     setFormStatus(FORM_STATUS.SUCCESS)
        //     setLoading(false)
        //     return true
        // } else {
        //     setFormStatus(FORM_STATUS.FAIL)
        //     setLoading(false)
        //     return false
        // }
    }

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    return <>
        <Spin spinning={loading}>
            <Row gutter={[22, 8]} className={`${_.get(FORM_STATUS_INFO, [formStatus, 'className'], 'upload-form-none')}`}>
                <Col lg={8} md={16} span={24}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Input placeholder={'Name'} className="admin-form-input" onChange={(e) => {handleFormDataChange('name', e.target.value)}}/>
                        </Col>
                        <Col span={24}>
                            <Select
                                placeholder="Select Plan"
                                className="admin-form-select w-full"
                                popupClassName="admin-form-select-popup"
                                showSearch
                                suffixIcon={<img src={ArrowIcon} alt="" />}
                                options={[
                                ]}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col lg={4} md={8} span={24}>
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
                        extraText={`Drag & drop your 3d model of Decorative (upload in format .Fbx .Glb .obj)`}
                        accept={".glb,.fbx,.obj"}
                        className="admin-model-uploader"
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
export default AdminUploadAnimationForm;