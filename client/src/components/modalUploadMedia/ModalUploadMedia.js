import { Col, Input, Modal, Row, Spin, notification } from "antd"
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"
import "./styles.scss"
import { useEffect, useMemo, useRef, useState } from "react"
import UploadImage from "../uploadImage/UploadImage"
import UploadImageIcon from "../../assets/icons/UploadImage"
import { userApi } from "../../api/user.api"
import { ASSET_TYPES, MODEL_BLOCK, UPLOADS_FOLDER } from "../../utils/constants"
import _ from "lodash"
import SaveIcon from "../../assets/images/products/save.svg"
import UploadModel from "../uploadModel/UploadModel"
import { uploadFile } from "../../api/upload.api"
import assetApi from "../../api/asset.api"

const ModalUploadMedia = ({
    open,
    onClose = () => {},
    onSuccess = () => {}
}) => {
    const uploadImageRef = useRef()
    const uploadModelRef = useRef()
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(open){
            setFormData({})
        }
    }, [open])

    const onSave = async () => {
        let imageFile = uploadImageRef.current.getFile()
            if(!imageFile){
                notification.warning({
                    message: "Thumnail can't be null!"
                })
                return
            }
    
            let objectFile = uploadModelRef.current.getFile()
            if(!objectFile){
                notification.warning({
                    message: "Media file can't be null!"
                })
                return
            }
    
            if(!formData?.name){
                notification.warning({
                    message: "Media title can't be null!"
                })
                return
            }
    
            setLoading(true)
    
            const formImageThumnailData = new FormData();
            formImageThumnailData.append("file", imageFile);
            const imageThumnailResult = await uploadFile(formImageThumnailData, 1, UPLOADS_FOLDER.ASSET_THUMNAIL)
            if(imageThumnailResult.status && imageThumnailResult.status !== 200){
                notification.error({
                    message: imageThumnailResult.data.message
                })
                setLoading(false)
                return
            }
    
            const formObjectData = new FormData();
            formObjectData.append("file", objectFile);
            const objectResult = await uploadFile(formObjectData, 0, UPLOADS_FOLDER.MEDIA)
            if(objectResult.status && objectResult.status !== 200){
                notification.error({
                    message: objectResult.data.message
                })
                setLoading(false)
                return
            }
    
            const newAsset = await assetApi.createAsset({
                name: formData.name,
                thumnail: imageThumnailResult.results,
                filePath: objectResult.results,
                size: _.get(objectResult, 'size', 0),
                type: ASSET_TYPES.MEDIA
            })
    
            if(newAsset && newAsset.filePath){
                notification.success({
                    message: "Upload media successfully!"
                })
                onSuccess(newAsset)
                setLoading(false)
            } else {
                notification.error({
                    message: "Can't upload media!"
                })
                setLoading(false)
            }
    }

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }
    
    return <Modal
        open={open}
        width={794}
        footer={null}
        closeIcon={<img src={ModalExitIcon} alt="" />}
        destroyOnClose={true}
        closable={true}
        className="modal-upload-media"
        onCancel={() => {onClose()}}
        title={`Upload media`}
    > 
        <Row gutter={[16, 16]} className="mt-[24px]">
            <Col span={24}>
                <Input 
                    placeholder={'Media title'} 
                    value={formData?.name} 
                    className="admin-form-input" 
                    onChange={(e) => {handleFormDataChange( 'name', e.target.value)}}
                />
            </Col>
            <Col span={24}>
                <UploadImage 
                    ref={uploadImageRef}
                    placeholderFileName={formData?.thumnail}
                    title={"Thumnail"}
                    extraText=""
                    className="admin-image-uploader"
                    uploadImage={<UploadImageIcon />}
                />
            </Col>
            <Col span={24}>
                <UploadModel 
                    ref={uploadModelRef}
                    placeholderFileName={formData?.filePath}
                    title={"Media"}
                    extraText={`Add your media (upload in format .mp4)`}
                    className="admin-model-uploader"
                    accept=".mp4"
                />
            </Col>
            <Col span={24} className="flex justify-end">
                <Spin spinning={loading}>
                    <button className="btn-save" onClick={onSave}>
                        <img src={SaveIcon} alt="" />
                        Save
                    </button>
                </Spin>
            </Col>
        </Row>
    </Modal>
}

export default ModalUploadMedia