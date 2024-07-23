import { Col, Row, Spin, notification } from "antd";
import "./styles.scss"
import UploadIcon from "../../../assets/icons/UploadIcon";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowLeftBack from "../../../assets/icons/ArrowLeftBack";
import { useRef, useState } from "react";
import AdminUploadTemplateForm from "../../../components/adminComponents/adminUploadTemplateForm/AdminUploadTemplateForm";
import AddUploadIcon from "../../../assets/icons/AddUpload";
import { isShopifyAdminLocation } from "../../../utils/util";
import routesConstant from "../../../routes/routesConstant";

const AdminUploadTemplatePage = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const [numOfUploadForm, setNumOfUploadForm] = useState(1)
    const uploadRefs = useRef([])
    const [loading, setIsLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)

    const pad = (d) => {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    const onUploadTemplate = async () => {
        setIsLoading(true)
        let listSubmitStatus = [];
        for(let i = 0; i < numOfUploadForm; i++){
            const status = uploadRefs.current[i] ? await uploadRefs.current[i].submit() : false;
            listSubmitStatus.push(status) 
        }

        if(listSubmitStatus.filter(el => !!el).length === numOfUploadForm){
            notification.success({
                message: "Upload successfully!"
            })
            setIsDisabled(true)
            setTimeout(() => {
                onBack()
            }, 1000)
        } else if(listSubmitStatus.filter(el => !!el).length > 0) {
            notification.success({
                message: `Upload successfully ${listSubmitStatus.filter(el => !!el).length} templates, upload failed ${numOfUploadForm - listSubmitStatus.filter(el => !!el).length} templates!`
            })
            setIsDisabled(true)
            setTimeout(() => {
                onBack()
            }, 1000)
        } else {
            notification.error({
                message: "Upload failed!"
            })
        }

        setIsLoading(false)
    }

    const onBack = () => {
        if(isShopifyAdminLocation(location)) {
            navigate(routesConstant.shopifyAdminUploadTemplate.path)
        } else {
            navigate(routesConstant.adminUploadTemplate.path)
        }
    }

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[38px] px-[31px] admin-upload-template-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-container-header">
                    <div className="left-side__template">
                        <button className="btn-back" onClick={() => {onBack()}}>
                            <ArrowLeftBack />
                            Back
                        </button>
                        <div className="title">3D Template</div>
                    </div>
                    <div className="right-side__template">
                        <Spin spinning={loading}>
                            <button disabled={isDisabled} className="upload-btn" onClick={() => {onUploadTemplate()}}>
                                <span style={{ marginRight: 22 }}>
                                    <UploadIcon />
                                </span>Upload
                            </button>
                        </Spin>
                    </div>
                </div>
                <div className="mt-[26px] uploads-list">
                    
                        {
                            new Array(numOfUploadForm).fill(null).map((el, index) => (
                                <div key={`upload-${index}`} className="flex gap-[8px]">
                                    <div className="upload-no mt-[14px]">
                                        {pad(index + 1)}.
                                    </div>
                                    <div className="upload-container flex-auto">
                                        <AdminUploadTemplateForm  
                                            ref={(element) => {uploadRefs.current[index] = element}} 
                                        />
                                    </div>
                                </div>
                            ))
                        }
                    
                </div>
                <div className="add-upload mt-[87px]">
                    <div className="add-upload-image" onClick={() => {setNumOfUploadForm(numOfUploadForm + 1)}}>
                        <AddUploadIcon />
                    </div>
                </div>
            </Col>
        </Row>
    </>
}
export default AdminUploadTemplatePage;