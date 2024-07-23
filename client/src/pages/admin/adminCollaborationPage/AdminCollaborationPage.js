import { Col, Row } from "antd";
import "./styles.scss"
import AdminCollaborationTable from "../../../components/adminComponents/adminCollaborationTable/AdminCollaborationTable";

const AdminCollaborationPage = () => {
    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[30px] admin-collaboration-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-users-container-header">
                    <div className="left-side__template">
                        <div className="title">Collaboration</div>
                    </div>
                </div>
                <div className="mt-[18px]">
                    <AdminCollaborationTable />
                </div>
            </Col>
        </Row>
    </>
}
export default AdminCollaborationPage;