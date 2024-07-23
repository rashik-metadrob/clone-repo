import { Col, Input, InputNumber, Radio, Row, Select, Spin, notification } from "antd";
import "./styles.scss"

import ArrowLeftIcon from "../../assets/images/products/arrow-left.svg"

import { useNavigate, useParams } from "react-router-dom";
import UploadModel from "../uploadModel/UploadModel";
import { useEffect, useRef, useState } from "react";
import { uploadFile } from "../../api/upload.api";
import UploadImage from "../uploadImage/UploadImage";
import { PRICING_PLAN_VALUE, PRODUCT_TYPES, UPLOADS_FOLDER } from "../../utils/constants"
import SaveIcon from "../../assets/images/products/save.svg";
import _ from "lodash";
import TagsInput from "../tagsInput/TagsInput";
import assetApi from "../../api/asset.api";
import { userApi } from "../../api/user.api";


const EditMedia = ({
    footerClassname=""
}) => {
    const navigate = useNavigate()
    const [loading, setIsLoading] = useState(false)
    const {id: assetId} = useParams()
    const [formData, setFormData] = useState({})

    const uploadModelRef = useRef()
    const uploadImageRef = useRef()

    const [uploadLimit, setUploadLimit] = useState({
        file2D: PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT,
        file3D: PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT,
        fileMedia: PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT,
    })

    useEffect(() => {
        if(assetId){
            assetApi.getAssetById(assetId).then(rs => {
                const newFormData = _.pick(rs, ["thumnail", "filePath", "name", "type", "tags"]);
                
                setFormData(newFormData)
            })
        }
    }, [assetId])

    

    useEffect(() => {
        userApi.getUploadLimitSize().then(rs => {
            setUploadLimit({
                file2D: _.get(rs, ['file2D'], PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT),
                file3D: _.get(rs, ['file3D'], PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT),
                fileMedia: _.get(rs, ['fileMedia'], PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT),
            })
        }).catch(err => {
            // For viewer
        })
    }, [])

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
        const imageFile = uploadImageRef.current.getFile()

        setIsLoading(true)

        let assetData = {
            ...formData
        }

        if(modelFile){
            const formModelData = new FormData();
            formModelData.append("file", modelFile);
            const modelResult = await uploadFile(formModelData, 0, UPLOADS_FOLDER.MEDIA)
            if(modelResult.status && modelResult.status !== 200){
                notification.error({
                    message: modelResult.data.message
                })
                setIsLoading(false)
                return
            }
            let modelFileName = modelResult.results
            assetData.filePath = modelFileName
            assetData.size = _.get(modelResult, 'size', 0)
        }
        

        if(imageFile){
            const formImageData = new FormData();
            formImageData.append("file", imageFile);
            const modelImageResult = await uploadFile(formImageData, 1, UPLOADS_FOLDER.MEDIA_THUMNAIL)
            if(modelImageResult.status && modelImageResult.status !== 200){
                notification.error({
                    message: modelImageResult.data.message
                })
                setIsLoading(false)
                return
            }
            let imageFileName = modelImageResult.results
            assetData.thumnail = imageFileName
        }

        assetApi.updateAsset(assetId, assetData).then((data) => {
            notification.success({
                message: "Update media success!"
            })
            setIsLoading(false)
        }).catch(err => {
            setIsLoading(false)
            notification.error({
                message: err.response?.data?.message || "Update media fail!"
            })
        })
    }

    return <>
        <div className="edit-media-container relative">
            <div className="w-full flex items-center gap-[40px]">
                <button className="btn-back" onClick={() => {navigate("/dashboard/products")}}>
                    <img src={ArrowLeftIcon} alt="" />
                    Back
                </button>
                <div className="text-add-product">
                    Edit Media
                </div>
            </div>
            <Row gutter={[16, 16]} className="!ml-0 !mr-0 mt-[27px] add-product-form">
                <Row gutter={[16, 16]} className="!ml-0 !mr-0 w-full">
                    <Col lg={8} md={12} sm={24} xs={24}>
                        <TagsInput value={formData.tags} onChange={(value) => {handleFormDataChange('tags', value)}} className="retailer-tag-input"/>
                    </Col>
                    <Col lg={16} md={12} sm={24} xs={24}>
                        <Input placeholder="Media title" value={formData.name} className="retailer-form-input"  onChange={(e) => {handleFormDataChange('name', e.target.value)}}/>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} className="!ml-0 !mr-0 w-full">
                    <Col lg={6} md={12} sm={24} xs={24}>
                        <UploadImage 
                            ref={uploadImageRef} 
                            placeholderFileName={formData.thumnail}
                        />
                    </Col>
                    <Col lg={18} md={12} sm={24} xs={24}>
                        <UploadModel 
                            ref={uploadModelRef}
                            placeholderFileName={formData.filePath}
                            title="Add Image & Video"
                            extraText="Add Media files (upload in format .mp4,.jpg,.png,.jpeg,.gif)"
                            accept=".mp4,.jpg,.png,.jpeg,.gif"
                            uploadLimit={uploadLimit.fileMedia}
                        />
                    </Col>
                </Row>
            </Row>
            <Row gutter={[16, 16]} className={`!ml-0 !mr-0 py-[27px] justify-end pr-[30px] ${footerClassname}`}>
                <Spin spinning={loading}>
                    <button className="btn-save" onClick={onSave}>
                        <img src={SaveIcon} alt="" />
                        Save
                    </button>
                </Spin>
            </Row>
        </div>
    </>
}
export default EditMedia;