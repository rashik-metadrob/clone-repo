import { Checkbox, Col, Input, Row, Select, Spin } from "antd";
import "./styles.scss"
import UsersTable from "../../../components/usersTable/UsersTable";
import DownArrowIcon from "../../../assets/icons/DownArrowIcon"
import SearchIcon from "../../../assets/images/layout/admin/search.svg"
import SearchSuffixIcon from "../../../assets/images/layout/admin/search-suffix.svg"
import ExitIcon from "../../../assets/images/drob-a/exit.svg"
import { useRef, useState } from "react";
import PlusIcon from "../../../assets/icons/PlusIcon";
import ExcelIcon from "../../../assets/icons/ExcelIcon";
import AdminSearchInput from "../adminSearchInput/AdminSearchInput";

const AdminUsers = () => {
    const [searchValue, setSearchValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isShowExceededStorageLimit, setIsShowExceededStorageLimit] = useState(false)
    const userTableRef = useRef()

    const onExportExcel = async () => {
        setIsLoading(true)
        await userTableRef.current.exportExcel()
        setIsLoading(false)
    }

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[30px] admin-users-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-users-container-header">
                    <div className="left-side__template">
                        <div className="title">User</div>
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
                        <div className="filter-container">
                            <button 
                                className={`shared-admin-toggle-btn ${isShowExceededStorageLimit ? 'active' : ''}`}
                                onClick={(e) => {setIsShowExceededStorageLimit(!isShowExceededStorageLimit)}}
                            >
                                Exceeding storage limits
                            </button>
                        </div>
                    </div>
                    <div className="right-side__template">
                        <div className="flex flex-col items-end gap-[16px]">
                            <Spin spinning={isLoading}>
                                <div className="assign-role-btn !ml-0" onClick={onExportExcel}>
                                    <span className="mr-[5px]">
                                        <ExcelIcon />
                                    </span>Export excel
                                </div>
                            </Spin>

                            <AdminSearchInput onSearch={(val) => {setSearchValue(val)}} />
                        </div>
                    </div>
                </div>
                <div className="mt-[18px]">
                    <UsersTable search={searchValue} ref={userTableRef} isShowExceededStorageLimit={isShowExceededStorageLimit}/>
                </div>
            </Col>
        </Row>
    </>
}
export default AdminUsers;