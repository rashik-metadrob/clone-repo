import { Col, Row } from "antd";
import EditProduct from "../../components/editProduct/EditProduct";
const EditProductPage = () => {
    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[12px] mb-[120px]">
            <Col span={24}>
                <EditProduct footerClassname="footer-sticky"/>
            </Col>
        </Row>
    </>
}
export default EditProductPage;