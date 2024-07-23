import { Col, Row, Select } from "antd"
import "./styles.scss"
import UploadIcon from "../../../assets/icons/UploadIcon"
import PlusIcon from "../../../assets/icons/PlusIcon"
import { useLocation, useNavigate } from "react-router-dom"
import AdminDecorativeTable from "../../../components/adminComponents/adminDecorativeTable/AdminDecorativeTable"
import AdminHdriTable from "../../../components/adminComponents/adminHdriTable/AdminHdriTable"
import AdminSearchInput from "../adminSearchInput/AdminSearchInput"
import { useState } from "react"
import { isShopifyAdminLocation } from "../../../utils/util"
import routesConstant from "../../../routes/routesConstant"

const AdminHdriPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchValue, setSearchValue] = useState("")

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[30px] admin-decorative-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-container-header">
                    <div className="left-side__template">
                        <div className="title">HDRI</div>
                    </div>
                    <div className="right-side__template">
                        <div className="flex flex-col items-end gap-[16px]">
                            <div className="flex flex-nowrap">
                                <div className="upload-btn" onClick={() => {
                                    if(isShopifyAdminLocation(location)) {
                                        navigate(routesConstant.shopifyAdminUploadCreateHdri.path)
                                    } else {
                                        navigate(routesConstant.adminUploadCreateHdri.path)
                                    }
                                }}>
                                    <span style={{ marginRight: 22 }}>
                                        <UploadIcon />
                                    </span>
                                    Upload
                                </div>
                                <div className="assign-role-btn">
                                    <span style={{ marginRight: 22 }}>
                                        <PlusIcon />
                                    </span>Assign Role
                                </div>
                            </div>
                            <AdminSearchInput onSearch={(val) => {setSearchValue(val)}} />
                        </div>
                    </div>
                </div>
                <div className="mt-[18px]">
                    <AdminHdriTable search={searchValue}/>
                </div>
            </Col>
        </Row>
    </>
}

export default AdminHdriPage;
