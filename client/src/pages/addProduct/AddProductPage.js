import { Col, Row } from "antd";
import AddProduct from "../../components/addProduct/AddProduct";
import { useNavigate } from "react-router-dom";
import { PRODUCT_TAB_TYPES, PRODUCT_TYPES } from "../../utils/constants";
import { useSelector } from "react-redux";
import { getProductTabType } from "../../redux/uiSlice";
import AddMedia from "../../components/addMedia/AddMedia";
import global from "../../redux/global";
import DrobAAddProduct from "../../components/drobAComponents/drobAAddProduct/DrobAAddProduct";
const AddProductPage = () => {
    const navigate = useNavigate()
    const productTabType = useSelector(getProductTabType)
    return <>
        <Row gutter={[26, 26]} className={`!ml-0 !mr-0 pt-[12px] ${!global.IS_DROB_A ? 'mb-[120px]' : ''}`} style={{background: global.IS_DROB_A ? "var(--droba-add-product-background)" : "transparent"}}>
            <Col span={24}>
                {productTabType === PRODUCT_TAB_TYPES.PRODUCTS && !global.IS_DROB_A && <AddProduct 
                    onBack={() => {navigate("/dashboard/products")}}
                    type={PRODUCT_TYPES.PRODUCTS}
                    footerClassname="footer-sticky z-[2]"
                />}
                {productTabType === PRODUCT_TAB_TYPES.PRODUCTS && global.IS_DROB_A && <DrobAAddProduct 
                    onBack={() => {navigate("/dashboard/products")}}
                    type={PRODUCT_TYPES.PRODUCTS}
                    footerClassname="footer-sticky z-[2]"
                />}
                {productTabType === PRODUCT_TAB_TYPES.ELEMENT && <AddProduct 
                    onBack={() => {navigate("/dashboard/products")}}
                    type={PRODUCT_TYPES.ELEMENT}
                    footerClassname="footer-sticky z-[2]"
                />}
                {productTabType === PRODUCT_TAB_TYPES.MEDIA && <AddMedia 
                    onBack={() => {navigate("/dashboard/products")}}
                    footerClassname="footer-sticky z-[2]"
                />}
            </Col>
        </Row>
    </>
}
export default AddProductPage;