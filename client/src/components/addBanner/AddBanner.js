import { Col, Input, Row, Spin, notification } from "antd";
import "./styles.scss"
import ArrowLeftIcon from "../../assets/images/products/arrow-left.svg"
import SaveIcon from "../../assets/images/products/save.svg"
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { uploadFile } from "../../api/upload.api";
import UploadImage from "../uploadImage/UploadImage";
import { getStorageUserDetail } from "../../utils/storage";
import { CONFIG_TYPE, UPLOADS_FOLDER } from "../../utils/constants";
import { getConfigByType, uniqueConfig } from "../../api/config.api";
const AddBanner = ({
    onBack = () => {},
    onSuccess = () => {}
}) => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({})
    const uploadImageRef = useRef()

    const currentUser = getStorageUserDetail();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getConfigByType(CONFIG_TYPE.BANNER).then(rs => {
            if(rs?.content){
                setFormData(rs.content)
            }
        }).catch(err => {

        })
    },[])

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    const onSave = async () => {
        if(
            formData.title === undefined
        ){
            notification.warning({
                message: "Data is invalid!"
            })
            return
        }

        const imageFile = uploadImageRef.current.getFile()
        let imageFileName = formData.image;
        if(!imageFile && !formData.image){
            notification.warning({
                message: "Image can't be null!"
            })
            return
        } else {
            if(imageFile){
                setLoading(true)

                const formImageData = new FormData();
                formImageData.append("file", imageFile);
                const modelImageResult = await uploadFile(formImageData, 0, UPLOADS_FOLDER.BANNER)
                if(modelImageResult.status && modelImageResult.status !== 200){
                    notification.error({
                        message: modelImageResult.data.message
                    })
                    setLoading(false)
                    return
                }
                imageFileName = modelImageResult.results
            }
        }
        

        let configData = {
            content: {
                ...formData,
                image: imageFileName,
            },
            createdBy: currentUser.id,
            type: CONFIG_TYPE.BANNER
        }

        uniqueConfig(configData).then((data) => {
            setLoading(false)
            notification.success({
                message: "Config success!"
            })
            onSuccess()
        }).catch(err => {
            setLoading(false)
            notification.error({
                message: err.response?.data?.message || "Config fail!"
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
                    Config Banner
                </div>
            </div>
            <Spin spinning={loading}>
                <Row gutter={[30, 30]} className="!ml-0 !mr-0 mt-[27px] add-product-form">
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <Input placeholder="Title" className="form-input" value={formData.title} onChange={(e) => {handleFormDataChange('title', e.target.value)}}/>
                    </Col>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <Input placeholder="Description" className="form-input" value={formData.description} onChange={(e) => {handleFormDataChange('description', e.target.value)}}/>
                    </Col>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <Input placeholder="Button Title" className="form-input" value={formData.buttonTitle} onChange={(e) => {handleFormDataChange('buttonTitle', e.target.value)}}/>
                    </Col>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <UploadImage ref={uploadImageRef} extraText="Add image for your banner" placeholderFileName={formData.image}/>
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
export default AddBanner;