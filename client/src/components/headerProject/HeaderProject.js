import { Col, Layout, Row } from "antd";
import "./styles.scss"

import LogoImage from "../../assets/images/project/logo.svg"
import LogoImageLight from "../../assets/images/project/light-logo.png"
import { useSelector } from "react-redux";
import { getIsHiddenPreview, getTheme } from "../../redux/appSlice";
import _ from "lodash"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { getStorageUserDetail, getStorageToken } from "../../utils/storage";
import { useEffect, useState } from "react";
import { getProjectById } from "../../api/project.api";
import { PROJECT_MODE } from "../../utils/constants";
import ModalPublishProject from "../modalPublishProject/ModalPublishProject";
import { getDefaultHomePage, isPublishModeLocation } from "../../utils/util";

const { Header } = Layout;
const HeaderProject = () => {
    // const dispatch = useDispatch()
    // const cart = useSelector(getCart)
    const navigate = useNavigate()

    // const [isShowPaymentModal, setIsShowPaymentModal] = useState(false)
    // const [isShowCartTooltip, setIsShowCartTooltip] = useState(false)

    const {id: projectId} = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [projectData, setProjectData] = useState({})

    const theme = useSelector(getTheme)
    let location = useLocation();

    useEffect(() => {
        if(projectId){
            getProjectById(projectId).then(data => {
                setProjectData(data)
            }).catch(err => {
    
            })
        }
        
    }, [projectId])

    useEffect(() => {
        // HANDLE PROJECT ISN'T PUBLISH
        if(isPublishModeLocation(location) && projectData.mode && projectData.mode !== PROJECT_MODE.PUBLISH){
            navigate("/404")
        }
    }, [location, projectData])

    return <>
    <Header className="header-project-container">
        <Row gutter={[0, 24]} className='header-project-content items-center'>
            <Col lg={12} md={12} sm={24} xs={24}>
                <img src={theme === 'light' ? LogoImageLight : LogoImage} alt="Logo" className="cursor-pointer max-h-[40px]" onClick={() => {getDefaultHomePage()}}/>
            </Col>

            <ModalPublishProject
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                projectId={projectId}
            />
        </Row>
    </Header>
    </>
}
export default HeaderProject