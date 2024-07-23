import { Col, Input, Layout, Menu, Row, Tooltip, theme } from 'antd';
import "./styles.scss"

import SearchIcon from "../../assets/images/layout/search.svg"
import bellIcon from "../../assets/images/layout/bell.svg"
import menuIcon from "../../assets/images/layout/menu.svg"
import {useDispatch, useSelector} from "react-redux"
import { getSearchText, setSearchText } from '../../redux/dashboardSlice';
import { setCollapsed } from "../../redux/navbarSlice";
import { getCollapsed } from "../../redux/navbarSlice";
import LOGO from "../../assets/images/LOGO.svg";
import { getTheme, setTheme } from '../../redux/appSlice';
import { useTranslation } from 'react-i18next';

const { Header } = Layout;

const HeaderDashboard = () => {
    const dispatch = useDispatch()
    const searchText = useSelector(getSearchText)
    const collapsed=useSelector(getCollapsed)
    const theme = useSelector(getTheme)
    const {t} = useTranslation()

    const onThemeChange = (e) => {
        if(e.target.checked){
            dispatch(setTheme('dark'))
        } else {
            dispatch(setTheme('light'))
        }
    }

    return <>
    <Header className='dashboard-header'>
        <div   className='text-welcome'>
            {t('global.welcome_to_your')}
        </div>
        <Row className='header-content items-center flex-wrap'>
            <Col lg={12} md={12} sm={24} xs={24}>
                <div className='header-name'>
                    <div className='flex items-center gap-[8px]'>
                        <img src={LOGO} alt="" className='h-[40px]'/>
                        {t('global.board')}
                    </div>
                    {window.innerWidth < 768 && <button className="btn-toggle" onClick={() => {dispatch(setCollapsed(!collapsed))}}>
                        <img src={menuIcon} alt="" />
                    </button>}
                </div>
            </Col>
            <Col lg={12} md={12} sm={0} xs={0}>
                <div className='header-action'>
                    {/* <Input
                        placeholder="Search"
                        className='header-search'
                        prefix={<img src={SearchIcon} alt="" />}
                        value={searchText}
                        onChange={(e) => {
                            dispatch(setSearchText(e.target.value))
                        }}
                    /> */}
                    {/* <Tooltip placement="bottom" title={"Coming soon"}>
                        <div id="thirdId" className='relative cursor-pointer'>
                            <img src={bellIcon} alt="" />
                            <div className='infomation-num'>
                                0
                            </div>
                        </div>
                    </Tooltip> */}
                    <label className='checkbox-dark-mode'>
                        <input type="checkbox" checked={!(theme === 'light')} onChange={(e) => {onThemeChange(e)}}/>
                        <span className='check'></span>
                    </label>
                </div>
            </Col>
        </Row>
    </Header>
    </>
}

export default HeaderDashboard;
