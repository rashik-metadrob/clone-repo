import { Col, Row, Select } from "antd"
import "./styles.scss"
import UploadIcon from "../../../assets/icons/UploadIcon"
import PlusIcon from "../../../assets/icons/PlusIcon"
import DownArrowIcon from "../../../assets/icons/DownArrowIcon"
import { useLocation, useNavigate } from "react-router-dom"
import AdminDecorativeTable from "../../../components/adminComponents/adminDecorativeTable/AdminDecorativeTable"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { productCategoryApi } from "../../../api/productCategory.api"
import { setListDecorativeCategories } from "../../../redux/sharedSlice"
import AdminSearchInput from "../adminSearchInput/AdminSearchInput"
import { isShopifyAdminLocation } from "../../../utils/util"
import routesConstant from "../../../routes/routesConstant"

const AdminDecorativePage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [searchValue, setSearchValue] = useState("")

    useEffect(() => {
        productCategoryApi.getListDecorativeCategories({limit: 1000, page: 1}).then(data => {
            dispatch(setListDecorativeCategories(data.map(el => {return {label: el.name, value: el.id}})))
        }).catch(err => {
        })
    }, [])

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[30px] admin-decorative-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-container-header">
                    <div className="left-side__template">
                        <div className="title">Decorative</div>
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
                                    if(isShopifyAdminLocation(location)){
                                        navigate(routesConstant.shopifyAdminUploadCreateDecorative.path)
                                    } else {
                                        navigate(routesConstant.adminUploadCreateDecorative.path)
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
                    <AdminDecorativeTable search={searchValue}/>
                </div>
            </Col>
        </Row>
    </>
}

export default AdminDecorativePage;
