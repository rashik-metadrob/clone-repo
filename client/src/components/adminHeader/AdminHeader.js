import { Col, Input, Layout, Menu, Row, Tooltip, theme } from 'antd';
import "./styles.scss"

import SearchIcon from "../../assets/images/layout/admin/search.svg"
import bellIcon from "../../assets/images/layout/admin/bell.svg"
import menuIcon from "../../assets/images/layout/menu.svg"
import SearchSuffixIcon from "../../assets/images/layout/admin/search-suffix.svg"
import {useDispatch, useSelector} from "react-redux"
import { getSearchText, setSearchText } from '../../redux/dashboardSlice';
import { setCollapsed } from "../../redux/navbarSlice";
import { getCollapsed } from "../../redux/navbarSlice";
import LOGO from "../../assets/images/layout/admin/logo.svg";
import { getTheme, setTheme } from '../../redux/appSlice';
import AdminSelectLanguage from '../adminComponents/adminSelectLanguage/AdminSelectLanguage';
import { useTranslation } from 'react-i18next';

const { Header } = Layout;

const AdminHeader = () => {
    const dispatch = useDispatch()
    const searchText = useSelector(getSearchText)
    const collapsed = useSelector(getCollapsed)
    const theme = useSelector(getTheme)
    const { t } = useTranslation();

    return <>
    <Header className='dashboard-admin-header'>
        <Row className='header-content items-center flex-wrap'>
            <Col lg={18} md={12} sm={24} xs={24}>
                <div className='header-name'>
                    <div className='flex items-center gap-[8px]'>
                        <img src={LOGO} alt="" className='h-[37px] w-[37px]'/>
                        {t('global.board')}
                    </div>
                    {window.innerWidth < 768 && <button className="btn-toggle" onClick={() => {dispatch(setCollapsed(!collapsed))}}>
                        <img src={menuIcon} alt="" />
                    </button>}
                </div>
            </Col>
            <Col lg={6} md={12} sm={0} xs={0}>
                <div className='header-action !justify-end'>
                    {/* <Input
                        placeholder="Search"
                        className='header-search'
                        prefix={<img src={SearchIcon} alt="" />}
                        value={searchText}
                        onChange={(e) => {
                            dispatch(setSearchText(e.target.value))
                        }}
                        suffix={
                            <img src={SearchSuffixIcon} alt="Search" />
                        }
                    /> */}
                    <div className='w-[32px] flex items-center'>
                        <AdminSelectLanguage />
                    </div>
                    <div id="thirdId" className='relative cursor-pointer'>
                        <img src={bellIcon} alt="" />
                    </div>
                </div>
            </Col>
        </Row>
    </Header>
    </>
}
export default AdminHeader;