import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { Col, Input, Row, Spin, notification } from "antd";
import UploadImage from "../../uploadImage/UploadImage";
import UploadImageIcon from "../../../assets/icons/UploadImage"
import { FORM_STATUS, FORM_STATUS_INFO, UPLOADS_FOLDER } from "../../../utils/constants";
import _ from "lodash"
import UploadFile from "../../uploadFile/UploadFile";
import { uploadFile } from "../../../api/upload.api";
import hdriApi from "../../../api/hdri.api";

const AdminUploadHdriForm = forwardRef(({

}, ref) => {
    const uploadHDRIImageRef = useRef()
    const uploadHDRRef = useRef()
    const [formStatus, setFormStatus] = useState(FORM_STATUS.NONE)
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)

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

        let hdrFile  = uploadHDRRef.current.getFile()
        if(!hdrFile){
            notification.warning({
                message: "HDR file can't be null!"
            })
            return false
        }
        let hdrImageFile = uploadHDRIImageRef.current.getFile()
        if(!hdrImageFile){
            notification.warning({
                message: "HDR thumnail can't be null!"
            })
            return false
        }

        setLoading(true)

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
        const newHdriPath = hdrResult.results
        const newFileSize = hdrResult.size

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
        const newHdriImagePath = hdrImageResult.results
        
        let hdriData = {
            name: formData.name,
            filePath: newHdriPath,
            thumnail: newHdriImagePath,
            size: newFileSize
        }

        const hdri = await hdriApi.createHdri(hdriData);
        if(hdri && hdri.id){
            setFormStatus(FORM_STATUS.SUCCESS)
            setLoading(false)
            return true
        } else {
            setFormStatus(FORM_STATUS.FAIL)
            setLoading(false)
            return false
        }
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
                <Col lg={12} md={12} span={24}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Input placeholder={'Name'} className="admin-form-input" value={formData?.name} onChange={(e) => {handleFormDataChange('name', e.target.value)}}/>
                        </Col>
                    </Row>
                </Col>
                <Col lg={4} md={12} span={24}>
                    <UploadImage 
                        ref={uploadHDRIImageRef}
                        title={"HDRI Thumnail"}
                        extraText=""
                        className="admin-image-uploader"
                        uploadImage={<UploadImageIcon />}
                    />
                </Col>
                <Col lg={8} md={24} span={24}>
                    <UploadFile 
                        ref={uploadHDRRef} 
                        title="Upload HDRi file"
                        extraText=""
                        accept=".hdr"
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
export default AdminUploadHdriForm;