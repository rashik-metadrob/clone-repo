import { Col, Input, Modal, Row, Spin, notification } from 'antd'
import './styles.scss'
import { useRef, useState } from 'react'
import ModalExitIcon from "../../../assets/images/project/modal-exit.svg"
import UploadImageIcon from "../../../assets/icons/UploadImage"
import UploadModel from '../../uploadModel/UploadModel'
import { uploadFile } from '../../../api/upload.api'
import { ASSET_TYPES, UPLOADS_FOLDER } from '../../../utils/constants'
import assetApi from '../../../api/asset.api'
import _ from 'lodash'

const ModalUploadFont = ({
    open,
    onClose = () => {},
    onSuccess = () => {}
}) => {
    const uploadFontRef = useRef()
    const [formData, setFormData] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    const handleSubmit = async () => {
        let objectFile = uploadFontRef.current.getFile()
        if(!objectFile){
            notification.warning({
                message: "Font file can't be null!"
            })
            return
        }

        if(!formData?.name){
            notification.warning({
                message: "Asset name can't be null!"
            })
            return
        }

        setIsLoading(true)

        const formObjectData = new FormData();
        formObjectData.append("file", objectFile);
        const objectResult = await uploadFile(formObjectData, 0, UPLOADS_FOLDER.FONT)
        if(objectResult.status && objectResult.status !== 200){
            notification.error({
                message: objectResult.data.message
            })
            setIsLoading(false)
            return
        }

        const newAsset = await assetApi.createAsset({
            name: formData.name,
            filePath: objectResult.results,
            size: _.get(objectResult, 'size', 0),
            type: ASSET_TYPES.FONT
        })

        if(newAsset && newAsset.filePath){
            onSuccess(newAsset)
            setIsLoading(false)
        } else {
            notification.error({
                message: "Can't upload font!"
            })
            setIsLoading(false)
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
        className="modal-admin-edit modal-edit-decorative"
        onCancel={() => {onClose()}}
        title={null}
    > 
        <div className="modal-edit-decorative-content">
            <div className="title">
                Upload font
            </div>
            <Row gutter={[16, 16]} className="mt-[24px]">
                <Col span={24}>
                    <Input 
                        placeholder={'Font name'} 
                        value={formData?.name} 
                        className="admin-form-input" 
                        onChange={(e) => {handleFormDataChange( 'name', e.target.value)}}
                    />
                </Col>
                <Col span={24}>
                    <UploadModel 
                        ref={uploadFontRef}
                        placeholderFileName={formData?.filePath}
                        title={"Object"}
                        extraText={`Add your asset (upload in format .ttf)`}
                        className="admin-model-uploader"
                        accept=".ttf"
                    />
                </Col>
                <Col span={24} className="flex justify-end">
                    <Spin spinning={isLoading}>
                        <div className="flex items-center justify-center mt-[18px]">
                            <div className="btn-save" onClick={handleSubmit}>
                                Save
                            </div>
                        </div>
                    </Spin>
                </Col>
            </Row>
        </div>
    </Modal>
    </>
}
export default ModalUploadFont