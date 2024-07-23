import { Col, Input, Layout, Menu, Row, Tooltip, theme } from 'antd';
import "./styles.scss"

import menuIcon from "../../../assets/images/drob-a/menu.svg"
import exitIcon from "../../../assets/images/drob-a/exit.svg"
import {useDispatch, useSelector} from "react-redux"
import { getSearchText, setSearchText } from '../../../redux/dashboardSlice';
import { setCollapsed } from "../../../redux/navbarSlice";
import { getCollapsed } from "../../../redux/navbarSlice";
import LOGO from "../../../assets/images/LOGO.svg";
import { getTheme, setTheme } from '../../../redux/appSlice';
import RetailerHeaderCapacity from '../../retailerComponents/retailerHeaderCapacity/RetailerHeaderCapacity';
import { useTranslation } from 'react-i18next';

const { Header } = Layout;

const DrobARetailerHeader = () => {
    const dispatch = useDispatch()
    const searchText = useSelector(getSearchText)
    const collapsed = useSelector(getCollapsed)
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
    <Header className={`dashboard-droba-retailer-header ${window.innerWidth < 768 ? 'h-[96px] pt-[9px]' : 'h-auto pt-[29px]'}`}>
        <Row className='header-content items-center flex-nowrap justify-between h-full'>
            {window.innerWidth < 768 &&  <Col className='flex items-center'>
                <button className="btn-toggle" onClick={() => {dispatch(setCollapsed(!collapsed))}}>
                    <img src={collapsed ? menuIcon : exitIcon} alt="" />
                </button>
            </Col>}
            <Col>
                <div  className='text-welcome'>
                    {t('global.welcome_to_your')}
                </div>
                <div className='header-name mt-0 md:mt-[5px]'>
                    <div className='flex items-center gap-[8px] text-[30px] leading-[36px] md:text-[41px] md:leading-[50px]'>
                        <img src={LOGO} alt="" className='h-[32px] md:h-[44px]'/>
                        {t('global.board')}
                    </div>
                </div>
            </Col>
            <Col>
                <div className='header-action'>
                    <div className='w-full max-w-[278px]'>
                        <RetailerHeaderCapacity />
                    </div>
                    <label className='checkbox-dark-mode'>
                        <input type="checkbox" checked={!(theme === 'light')} onChange={(e) => {onThemeChange(e)}}/>
                        <span className='check'></span>
                    </label>
                    {/* <div id="thirdId" className='relative cursor-pointer'>
                        <img src={bellIcon} alt="" className='w-[26.6px] h-[26.6px] notification-icon'/>
                    </div> */}
                </div>
            </Col>
        </Row>
    </Header>
    </>
}
export default DrobARetailerHeader;