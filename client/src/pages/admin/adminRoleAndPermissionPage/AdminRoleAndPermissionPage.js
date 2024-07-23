import { Col, Row, Tabs } from "antd"
import AdminSearchInput from "../adminSearchInput/AdminSearchInput"
import { useRef, useState } from "react"
import AdminRoleAndPermissionForTable from "../../../components/adminComponents/adminRoleAndPermissionForTable/AdminRoleAndPermissionForTable"
import UploadIcon from "../../../assets/icons/UploadIcon"
import PlusIcon from "../../../assets/icons/PlusIcon"
import './styles.scss'

const AdminRoleAndPermissionPage = () => {
    const [searchValue, setSearchValue] = useState("")
    const tableRetailerRef = useRef()
    const tableAdminRef = useRef()
    const [activeKey, setActiveKey] = useState("1")

    const items = [
        {
            key: "1",
            label: `Retailer`,
            children: <>
                <AdminRoleAndPermissionForTable search={searchValue} ref={tableRetailerRef} key={'retailer'}/>
            </>,
        },
        {
            key: "2",
            label: `Super Admin`,
            children: <>
                <AdminRoleAndPermissionForTable search={searchValue} ref={tableAdminRef} isSuperAdminRole={true} key={'super-admin'}/>
            </>,
        },
    ]

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[30px] admin-store-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-container-header">
                    <div className="left-side__template">
                        <div className="title">Roles and Permissions</div>
                    </div>
                    <div className="right-side__template">
                        <div className="flex flex-col items-end gap-[16px]">
                            <div className="flex flex-nowrap">
                                <div className="upload-btn" onClick={() => {
                                    if(activeKey === '1') {
                                        tableRetailerRef.current.addNewRole()
                                    } else {
                                        tableAdminRef.current.addNewRole()
                                    }
                                }}>
                                    <span style={{ marginRight: 22 }}>
                                        <PlusIcon color="#FFFFFF"/>
                                    </span>
                                    Add
                                </div>
                            </div>
                            <AdminSearchInput onSearch={(val) => {setSearchValue(val)}} />
                        </div>
                    </div>
                </div>
                <div className="mt-[18px]">
                    <Tabs
                        className="role-and-permissions-tabs h-full"
                        activeKey={activeKey}
                        onChange={(key) => {setActiveKey(key.toString())}}
                    >
                        {items.map((tab) => {
                            const { key, label, children } = tab;
                            return (
                                <Tabs.TabPane
                                key={key}
                                tab={label}
                                >
                                    {children}
                                </Tabs.TabPane>
                            );
                        })}
                    </Tabs>
                </div>
            </Col>
        </Row>
    </>
}

export default AdminRoleAndPermissionPage