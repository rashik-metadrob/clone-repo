import { useNavigate } from "react-router-dom";
import AddTemplate from "../../../components/addTemplate/AddTemplate";
import { Col, Row } from "antd";
import AddBanner from "../../../components/addBanner/AddBanner";

const AddBannerPage = () => {
    const navigate = useNavigate()

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[12px] add-template-container mb-[120px]">
            <Col lg={17} md={24} sm={24} xs={24}>
                <AddBanner onBack={() => {navigate("/dashboard/store")}}/>
            </Col>
        </Row>
    </>
}
export default AddBannerPage;