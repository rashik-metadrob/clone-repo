import { Col, Row, notification } from "antd";
import "./styles.scss"
import UploadIcon from "../../../assets/icons/UploadIcon";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowLeftBack from "../../../assets/icons/ArrowLeftBack";
import { useRef, useState } from "react";
import AddUploadIcon from "../../../assets/icons/AddUpload";
import AdminUploadAnimationForm from "../../../components/adminComponents/adminUploadAnimationForm/AdminUploadAnimationForm";
import { isShopifyAdminLocation } from "../../../utils/util";
import routesConstant from "../../../routes/routesConstant";

const AdminUploadAnimationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [numOfUploadForm, setNumOfUploadForm] = useState(1)
    const uploadRefs = useRef([])

    const pad = (d) => {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    const onUploadAnimation = async () => {
    }

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[38px] px-[31px] admin-upload-animation-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-container-header">
                    <div className="left-side__template">
                        <button className="btn-back" onClick={() => {
                            if(isShopifyAdminLocation(location)) {
                                navigate(routesConstant.shopifyAdminUploadAnimation.path)
                            } else {
                                navigate(routesConstant.adminUploadAnimation.path)
                            }
                        }}>
                            <ArrowLeftBack />
                            Back
                        </button>
                        <div className="title">Animation</div>
                    </div>
                    <div className="right-side__template">
                        <div className="upload-btn disabled" onClick={() => {}}>
                            <span style={{ marginRight: 22 }}>
                                <UploadIcon />
                            </span>Upload
                        </div>
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
                                        <AdminUploadAnimationForm  
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
export default AdminUploadAnimationPage;