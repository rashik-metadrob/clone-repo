import { Checkbox, Col, Input, Modal, Row, Select, Spin, notification } from "antd"
import ModalExitIcon from "../../../assets/images/project/modal-exit.svg"
import "./styles.scss"
import { useEffect, useRef, useState } from "react"
import UploadImage from "../../uploadImage/UploadImage"
import UploadImageIcon from "../../../assets/icons/UploadImage"
import _ from "lodash"
import UploadFile from "../../uploadFile/UploadFile"
import { uploadFile } from "../../../api/upload.api"
import hdriApi from "../../../api/hdri.api"
import { UPLOADS_FOLDER } from "../../../utils/constants"

const ModalAddEditHdri = ({
    title = "Edit hdri",
    open,
    onClose = () => {},
    item,
    onSuccess = () => {}
}) => {
    const uploadHDRIImageRef = useRef()
    const uploadHDRRef = useRef()
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(open && item){
            const newFormData = _.pick(item, ["name", "thumnail", "filePath", "size"]);
            setFormData(newFormData)
        }
    }, [open, item])

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    const handleSubmit = async () => {
        if(!formData.name){
            notification.warning({
                message: "HDRI name can't be null!"
            })
            return false
        }

        const itemId = item.id || item._id
        let hdrFile  = uploadHDRRef.current.getFile()
        if(!hdrFile && !formData.filePath){
            notification.warning({
                message: "HDR file can't be null!"
            })
            return false
        }
        let hdrImageFile = uploadHDRIImageRef.current.getFile()
        if(!hdrImageFile && !formData.thumnail){
            notification.warning({
                message: "HDR thumnail can't be null!"
            })
            return false
        }

        setLoading(true)

        let newHdriPath = formData.filePath
        let newHdriImagePath = formData.thumnail
        let newFileSize = formData.size

        if(hdrFile){
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
            newFileSize = hdrResult.size
        }

        if(hdrImageFile){
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
        }
        
        let hdriData = {
            ...formData,
            filePath: newHdriPath,
            thumnail: newHdriImagePath,
            size: newFileSize
        }

        if(item) {
            const hdri = await hdriApi.updateHdri(itemId, hdriData);
            if(hdri && hdri.id){
                notification.success({
                    message: "Update successfully!"
                })
                setLoading(false)
                onSuccess()
            } else {
                notification.success({
                    message: "Update failed!"
                })
                setLoading(false)
            }
        } else {
            const hdri = await hdriApi.createHdri(hdriData);
            if(hdri && hdri.id){
                notification.success({
                    message: "Create successfully!"
                })
                setLoading(false)
                onSuccess()
            } else {
                notification.success({
                    message: "Create failed!"
                })
                setLoading(false)
            }
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
            centered
            className="modal-admin-edit modal-edit-hdri"
            onCancel={() => {onClose()}}
        >
            <div className="modal-edit-hdri-content">
                <div className="title">
                    {title}
                </div>
                <Spin spinning={loading}>
                    <Row gutter={[22, 8]} className="mt-[16px]">
                        <Col lg={24} md={24} span={24}>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Input placeholder={'Name'} className="admin-form-input" value={formData?.name} onChange={(e) => {handleFormDataChange('name', e.target.value)}}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={24} md={24} span={24}>
                            <UploadImage 
                                ref={uploadHDRIImageRef}
                                title={"HDRI Thumnail"}
                                extraText=""
                                className="admin-image-uploader"
                                uploadImage={<UploadImageIcon />}
                                placeholderFileName={formData.thumnail}
                            />
                        </Col>
                        <Col lg={24} md={24} span={24}>
                            <UploadFile 
                                ref={uploadHDRRef} 
                                title="Upload HDRi file"
                                extraText=""
                                accept=".hdr"
                                className="admin-model-uploader"
                                placeholderFileName={formData?.filePath}
                            />
                        </Col>
                    </Row>
                </Spin>
                <div className="flex items-center justify-center mt-[18px]">
                    <div className="btn-save" onClick={handleSubmit}>
                        Save
                    </div>
                </div>
            </div>
        </Modal>
    </>
}
export default ModalAddEditHdri