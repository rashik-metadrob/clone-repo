
import { Col, Layout, Row } from "antd";
import "./styles.scss"

import LogoImage from "../../assets/images/project/logo.svg"
import LogoImageLight from "../../assets/images/project/light-logo.png"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTheme, getUser, setUser } from "../../redux/appSlice";
import { getDefaultHomePage } from "../../utils/util";
import { removeAllUserData } from "../../utils/storage";
import { SOCIAL_TYPE } from "../../utils/constants";

const { Header } = Layout;
const HeaderNotFound = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(getUser)
    const theme = useSelector(getTheme)

    const onNavigateHomePage = () => {

        if(user?.socialType === SOCIAL_TYPE.FACEBOOK){
            window.FB.logout()
        }

        removeAllUserData()

        dispatch(setUser(null))

        navigate("/")
    }

    return <Header className="header-normal-container">
        <Row gutter={[0, 24]} className='header-project-content items-center'>
            <Col lg={12} md={12} sm={24} xs={24}>
                <img src={theme === 'light' ? LogoImageLight : LogoImage} alt="Logo" className="cursor-pointer" onClick={() => {onNavigateHomePage()}}/>
            </Col>
        </Row>
    </Header>
}
export default HeaderNotFound