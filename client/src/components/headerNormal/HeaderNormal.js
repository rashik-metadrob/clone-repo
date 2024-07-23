
import { Col, Layout, Row } from "antd";
import "./styles.scss"

import LogoImage from "../../assets/images/project/logo.svg"
import LogoImageLight from "../../assets/images/project/light-logo.png"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTheme } from "../../redux/appSlice";
import { getDefaultHomePage } from "../../utils/util";

const { Header } = Layout;
const HeaderNormal = () => {
    const navigate = useNavigate()

    const theme = useSelector(getTheme)

    return <Header className="header-normal-container">
        <Row gutter={[0, 24]} className='header-project-content items-center'>
            <Col lg={12} md={12} sm={24} xs={24}>
                <img src={theme === 'light' ? LogoImageLight : LogoImage} alt="Logo" className="cursor-pointer" onClick={() => {navigate(getDefaultHomePage())}}/>
            </Col>
        </Row>
    </Header>
}
export default HeaderNormal