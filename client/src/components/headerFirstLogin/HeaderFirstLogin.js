
import { Col, Layout, Row } from "antd";

import LOGO from "../../assets/images/LOGO.svg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTheme } from "../../redux/appSlice";
import { getDefaultHomePage } from "../../utils/util";

const { Header } = Layout;
const HeaderFirstLogin = () => {
    const navigate = useNavigate()
    return <Header className="header-first-login-container h-[80px] ps-[54px] pe-[54px] bg-[#FFF]">
        <Row gutter={[0, 24]} className='items-center h-full'>
            <Col lg={12} md={12} sm={24} xs={24}>
                <img src={LOGO} alt="Logo" className="cursor-pointer h-[44px]" onClick={() => {navigate(getDefaultHomePage())}}/>
            </Col>
        </Row>
    </Header>
}
export default HeaderFirstLogin