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

const ModalUploadMusic = ({
    open,
    onClose = () => {},
    onSuccess = () => {}
}) => {
    const uploadModelRef = useRef()
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(open) {
            setFormData({})
        }
    }, [open])

    const onSave = async () => {
        let objectFile = uploadModelRef.current.getFile()
        if(!objectFile){
            notification.warning({
                message: "Audio file can't be null!"
            })
            return
        }

        if(!formData?.name){
            notification.warning({
                message: "Audio title can't be null!"
            })
            return
        }

        setLoading(true)

        const formObjectData = new FormData();
        formObjectData.append("file", objectFile);
        const objectResult = await uploadFile(formObjectData, 0, UPLOADS_FOLDER.AUDIO)
        if(objectResult.status && objectResult.status !== 200){
            notification.error({
                message: objectResult.data.message
            })
            setLoading(false)
            return
        }

        const newAsset = await assetApi.createAsset({
            name: formData.name,
            filePath: objectResult.results,
            size: _.get(objectResult, 'size', 0),
            type: ASSET_TYPES.MUSIC
        })

        if(newAsset && newAsset.filePath){
            notification.success({
                message: "Upload audio successfully!"
            })
            onSuccess(newAsset)
            setLoading(false)
        } else {
            notification.error({
                message: "Can't create new asset!"
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
        className="modal-upload-music"
        onCancel={() => {onClose()}}
        title={`Upload media`}
    > 
        <Row gutter={[16, 16]} className="mt-[24px]">
            <Col span={24}>
                <Input 
                    placeholder={'Audio title'} 
                    value={formData?.name} 
                    className="admin-form-input" 
                    onChange={(e) => {handleFormDataChange( 'name', e.target.value)}}
                />
            </Col>
            <Col span={24}>
                <UploadModel 
                    ref={uploadModelRef}
                    placeholderFileName={formData?.filePath}
                    title={"Audio"}
                    extraText={`Add your audio (upload in format .mp3,.wav)`}
                    className="admin-model-uploader"
                    accept=".mp3,.wav"
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

export default ModalUploadMusic