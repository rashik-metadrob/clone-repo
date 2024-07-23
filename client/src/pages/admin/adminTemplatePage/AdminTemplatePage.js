import { Col, Input, Row, Select } from "antd"
import "./styles.scss"
import { useLocation, useNavigate } from "react-router-dom"
import TemplateTable from "../../../components/templateTable/TemplateTable"
import DownArrowIcon from "../../../assets/icons/DownArrowIcon"
import PlusIcon from "../../../assets/icons/PlusIcon"
import UploadIcon from "../../../assets/icons/UploadIcon"
import SearchIcon from "../../../assets/images/layout/admin/search.svg"
import SearchSuffixIcon from "../../../assets/images/layout/admin/search-suffix.svg"
import { useState } from "react"
import ExitIcon from "../../../assets/images/drob-a/exit.svg"
import AdminSearchInput from "../adminSearchInput/AdminSearchInput"
import { isShopifyAdminLocation } from "../../../utils/util"
import routesConstant from "../../../routes/routesConstant"

const AdminTemplatePage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchValue, setSearchValue] = useState("")

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[30px] admin-template-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-container-header">
                    <div className="left-side__template">
                        <div className="title">3D Template</div>
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
                        <div className="flex flex-col items-end gap-[16px]">
                            <div className="flex flex-nowrap">
                                <div className="upload-btn" onClick={() => {
                                    if(isShopifyAdminLocation(location)) {
                                        navigate(routesConstant.shopifyAdminUploadCreateTemplate.path)
                                    } else {
                                        navigate(routesConstant.adminUploadCreateTemplate.path)
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

                            <AdminSearchInput onSearch={(val) => {setSearchValue(val)}} />
                        </div>
                    </div>
                </div>
                <div className="mt-[18px]">
                    <TemplateTable search={searchValue}/>
                </div>
            </Col>
        </Row>
    </>
}
export default AdminTemplatePage