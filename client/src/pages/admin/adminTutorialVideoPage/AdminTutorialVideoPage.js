import { useNavigate } from "react-router-dom"
import "./styles.scss"
import { Col, Row } from "antd"
import PlusIcon from "../../../assets/icons/PlusIcon"
import UploadIcon from "../../../assets/icons/UploadIcon"
import { useRef } from "react"
import AdminTutorialVideoTable from "../../../components/adminComponents/adminTutorialVideoTable/AdminTutorialVideoTable"

const AdminTutorialVideoPage = () => {
    const tableRef = useRef()
    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[30px] admin-tutorial-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-container-header">
                    <div className="left-side__template">
                        <div className="title">Text</div>
                    </div>
                    <div className="right-side__template">
                        <div className="upload-btn" onClick={() => {tableRef.current.addNewVideo()}}>
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
                    <AdminTutorialVideoTable ref={tableRef}/>
                </div>
            </Col>
        </Row>
    </>
}
export default AdminTutorialVideoPage