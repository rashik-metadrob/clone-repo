import { Col, Row, Select } from "antd"
import "./styles.scss"
import UploadIcon from "../../../assets/icons/UploadIcon"
import PlusIcon from "../../../assets/icons/PlusIcon"
import DownArrowIcon from "../../../assets/icons/DownArrowIcon"
import { useLocation, useNavigate } from "react-router-dom"
import AdminAnimationTable from "../../../components/adminComponents/adminAnimationTable/AdminAnimationTable"
import { isShopifyAdminLocation } from "../../../utils/util"
import routesConstant from "../../../routes/routesConstant"

const AdminAnimationPage = () => {
    const navigate = useNavigate()
    const location = useLocation()

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[30px] admin-animation-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-container-header">
                    <div className="left-side__template">
                        <div className="title">Animation</div>
                        <div className="filter-container">
                            <span className="filter-title">Plan</span>
                            <Select
                                className="filter-select"
                                defaultValue="all"
                                options={[
                                    {
                                        value: 'all',
                                        label: 'All',
                                    },
                                ]}
                                suffixIcon={<DownArrowIcon/>}
                            />
                        </div>
                    </div>
                    <div className="right-side__template">
                        <div className="upload-btn" onClick={() => {
                            if(isShopifyAdminLocation(location)){
                                navigate(routesConstant.shopifyAdminUploadCreateAnimation.path)
                            } else {
                                navigate(routesConstant.adminUploadCreateAnimation.path)
                            }
                        }}>
                            <span style={{ marginRight: 22 }}>
                                <UploadIcon />
                            </span>Upload</div>
                        <div className="assign-role-btn">
                            <span style={{ marginRight: 22 }}>
                                <PlusIcon />
                            </span>Assign Role</div>
                    </div>
                </div>
                <div className="mt-[18px]">
                    <AdminAnimationTable />
                </div>
            </Col>
        </Row>
    </>
}

export default AdminAnimationPage;
