import { Col, Row } from "antd";
import EditMedia from "../../components/editMedia/EditMedia";
const EditMediaPage = () => {
    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[12px] mb-[120px]">
            <Col span={24}>
                <EditMedia footerClassname="footer-sticky"/>
            </Col>
        </Row>
    </>
}
export default EditMediaPage;