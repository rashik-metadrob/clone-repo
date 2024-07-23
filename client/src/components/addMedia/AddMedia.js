import { Col, Input, Row, notification, Spin } from "antd";
import "./styles.scss"
import { useNavigate } from "react-router-dom";
import UploadModel from "../../components/uploadModel/UploadModel";
import { useEffect, useRef, useState } from "react";
import { createProduct } from "../../api/product.api";
import { uploadFile } from "../../api/upload.api";
import UploadImage from "../../components/uploadImage/UploadImage";
import SaveIcon from "../../assets/images/products/save.svg"
import { CONFIG_TEXT, MODEL_BLOCK, PRICING_PLAN_VALUE, ASSET_TYPES, UPLOADS_FOLDER } from "../../utils/constants";
import { getStorageUserDetail } from "../../utils/storage";
import { userApi } from "../../api/user.api";
import TagsInput from "../tagsInput/TagsInput";
import ArrowLeftIcon from "../../assets/images/products/arrow-left.svg"
import _ from "lodash";
import assetApi from "../../api/asset.api";
import { useAppDispatch } from "../../redux";
import { fetchUserStorageInfo } from "../../redux/userStorageSlice";

const { TextArea } = Input;
const AddMedia = ({
    onSuccess = () => {},
    onBack = () => {},
    isInModal = false,
    footerClassname=""
}) => {
    const [loading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({})
    const dispatch = useAppDispatch()

    const userDetail = getStorageUserDetail();

    const uploadModelRef = useRef()
    const uploadImageRef = useRef()

    const [uploadLimit, setUploadLimit] = useState({
        file2D: PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT,
        file3D: PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT,
        fileMedia: PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT,
    })

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
        console.log("modelFile", modelFile)
        if(!modelFile){
            notification.warning({
                message: "Model can't be null!"
            })
            return
        }

        const imageFile = uploadImageRef.current.getFile()
        console.log("imageFile", imageFile)
        if(!imageFile){
            notification.warning({
                message: "Image can't be null!"
            })
            return
        }

        setIsLoading(true)

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

        let assetData = {
            ...formData,
            thumnail: imageFileName,
            filePath: modelFileName,
            size: _.get(modelResult, 'size', 0),
            type: ASSET_TYPES.MEDIA
        }

        assetApi.createAsset(assetData).then(async (data) => {
            notification.success({
                message: "Add mesia success!"
            })
            dispatch(fetchUserStorageInfo())
            onSuccess()
            setIsLoading(false)
        }).catch(err => {
            setIsLoading(false)
            notification.error({
                message: err.response?.data?.message || "Add mesia fail!"
            })
        })
    }

    return <>
        <div className="add-media-container relative">
            {!isInModal && <div className="w-full flex items-center gap-[40px]">
                <button className="btn-back" onClick={() => {onBack()}}>
                    <img src={ArrowLeftIcon} alt="" />
                    Back
                </button>
                <div className="text-add-product">
                    Add Media
                </div>
            </div>}
            <Row gutter={[16, 16]} className={`!ml-0 !mr-0 add-product-form ${!isInModal ? 'mt-[27px]' : '!border-0 !p-0'}`}>
                <Row gutter={[16, 16]} className="!ml-0 !mr-0 w-full">
                    <Col lg={8} md={12} sm={24} xs={24}>
                        <TagsInput value={formData.tags} onChange={(value) => {handleFormDataChange('tags', value)}} className="retailer-tag-input"/>
                    </Col>
                    <Col lg={16} md={12} sm={24} xs={24}>
                        <Input placeholder="Name" value={formData.name} className="retailer-form-input" onChange={(e) => {handleFormDataChange('name', e.target.value)}}/>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} className="!ml-0 !mr-0 w-full">
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
                            title="Add Image & Video"
                            extraText="Add Media files (upload in format .mp4,.jpg,.png,.jpeg,.gif,.mp3,.wav)"
                            accept=".mp4,.jpg,.png,.jpeg,.gif,.mp3,.wav"
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
export default AddMedia;