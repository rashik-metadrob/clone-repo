import { Input, Layout, Menu, Row, theme } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
// import Header from '../../components/header/Header';
import "./styles.scss"

import logOutIcon from "../../assets/images/layout/logout.svg"
import homeIcon from "../../assets/images/layout/retailer/home.svg"
import productIcon from "../../assets/images/layout/retailer/product.svg"
import yourStoreIcon from "../../assets/images/layout/retailer/your-store.svg"
import menuIcon from "../../assets/images/layout/menu.svg"

import { Outlet, useNavigate } from 'react-router-dom';
import { getStorageUserDetail, removeAllUserData } from '../../utils/storage';
import { DASHBOARD_SIDEBAR_WIDTH, DASHBOARD_SIDEBAR_WIDTH_BREAKPOINT, DEFAULT_AVATAR, SOCIAL_TYPE, USER_ROLE } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, setUser } from '../../redux/appSlice';
import { setCollapsed } from "../../redux/navbarSlice";
import { getCollapsed } from "../../redux/navbarSlice";
import TutorialIcon from "../../assets/images/tutorial.png"

import { getAssetsUrl } from '../../utils/util';
import RetailerFooter from '../../components/retailerComponents/retailerFooter/RetailerFooter';
import routesConstant from '../../routes/routesConstant';
import EditProfileIcon from '../../assets/icons/EditProfileIcon';
import { userApi } from '../../api/user.api';
import _ from 'lodash';
import ModalPricingPlan from '../../components/modalPricingPlan/ModalPricingPlan';
import global from '../../redux/global';
import { useFormatNowToTime } from '../../hook/useFormatNowToTime';
import DrobARetailerHeader from '../../components/drobAComponents/drobARetailerHeader/DrobARetailerHeader';

const { Sider, Content } = Layout;
const LayoutRetailerDrobA = ({children}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const [collapsed, setCollapsed] = useState(true);
    const [windowWidth, setWindowWidth] = useState(0)

    const collapsed = useSelector(getCollapsed)

    const userDetail = getStorageUserDetail()
    const user = useSelector(getUser)

    const [planInfo, setPlanInfo] = useState({})
    const expiredTrialDate = useMemo(() => {
        return _.get(planInfo, ['subcriptionInfo', 'isTrial'], false) ? _.get(planInfo, ['subcriptionInfo', 'expiredDate'], null) : null
    },[planInfo])
    const {timeToNow, unit} = useFormatNowToTime(expiredTrialDate)
    const [isShowModalPricing, setIsShowModalPricing] = useState(false)

    useEffect(() => {
        setWindowWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        userApi.getActivePricingPlan().then(rs => {
            setPlanInfo(rs)
        })
    }, [user?.triedPlanIds])

    const handleResize = () => {
        setWindowWidth(window.innerWidth)
    }

    const onClickMenu = (e) => {
        navigate(e.key)
        if(window.innerWidth < DASHBOARD_SIDEBAR_WIDTH_BREAKPOINT){
            dispatch(setCollapsed(true))
        }
    }

    const onClickMenuInfo = (info) => {
        console.log("info", info)
        if(info.key === "logout"){
            if(userDetail?.socialType === SOCIAL_TYPE.FACEBOOK){
                window.FB.logout()
            }

            removeAllUserData()

            dispatch(setUser(null))

            navigate("/")
        }
    }

    const menuItems = [
        {
            key: '/dashboard/home',
            icon: <div className='d-flex h-100 justify-content-center'>
                    <img className='dashboard-retailer-sidebar-icon max-w-none w-[18px] max-h-[18px] xl:w-[22px] 2xl:max-h-[26px] xl:w-[22px] 2xl:max-h-[26px] max-w-none' src={homeIcon} alt="" />
                </div>,
            label: <div className='ml-[8px] flex justify-between'>
                    <span className="title">Home</span>
                </div>,
            roles: [USER_ROLE.ADMIN, USER_ROLE.RETAILERS],
        },
        {
            key: '/dashboard/products',
            icon: <div className='d-flex h-100 justify-content-center'>
                    <img className='dashboard-retailer-sidebar-icon max-w-none w-[18px] max-h-[18px] xl:w-[22px] 2xl:max-h-[26px] xl:w-[22px] 2xl:max-h-[26px] max-w-none' src={productIcon} alt="" />
                </div>,
            label: <div id="products" className='ml-[8px] flex justify-between'>
                    <span className="title">Upload</span>
                </div>,
            roles: [USER_ROLE.ADMIN, USER_ROLE.RETAILERS]
        },
        {
            key: '/dashboard/store',
            icon: <div className='d-flex h-100 justify-content-center'>
                    <img className='dashboard-retailer-sidebar-icon max-w-none w-[18px] max-h-[18px] xl:w-[22px] 2xl:max-h-[26px] xl:w-[22px] 2xl:max-h-[26px] max-w-none' src={yourStoreIcon} alt="" />
                </div>,
            label: <div className='ml-[8px] flex justify-between'>
                    <span className="title">Your Store</span>
                </div>,
            roles: [USER_ROLE.RETAILERS, USER_ROLE.ADMIN],
        },
    ]

    return <>
    <Layout>
        <Sider
            trigger={null} 
            theme="dark" 
            collapsible 
            collapsed={collapsed}
            collapsedWidth={windowWidth >= DASHBOARD_SIDEBAR_WIDTH_BREAKPOINT ? 80 : 0}
            width={windowWidth >= DASHBOARD_SIDEBAR_WIDTH_BREAKPOINT ? Math.max(DASHBOARD_SIDEBAR_WIDTH, 0.15 * windowWidth) : windowWidth}
            breakpoint={{
                xs: '480px',
                sm: '576px',
                md: '768px',
                lg: '992px',
                xl: '1200px',
                xxl: '1600px',
            }}
            style={{
                height: "100vh",
                zIndex: 100
            }}
            className={`dashboard-retailer-drobA-sidebar-wrapper ${collapsed ? 'collapsed' : ''} ${global.IS_DROB_A ? 'drob-a-side-layout' : ''}`}
        >
            <div className='dashboard-retailer-drobA-sidebar-container'>
                <div className="dashboard-sidebar-toggle">
                    <button id="navbutton" className="btn-toggle text-[#FFFFFF]" onClick={() => {dispatch(setCollapsed(!collapsed))}}>
                        <img src={menuIcon} alt="" />
                    </button>
                </div>
                <div className='avatar-info'>
                    {/* <img src={user?.avatar ? getAssetsUrl(user.avatar) : user?.socialAvatar ? user.socialAvatar : getAssetsUrl(DEFAULT_AVATAR)} alt="" className={!collapsed ? 'rounded-[12px] w-[84px] h-[84px]' : 'rounded-[12px] w-[52px] h-[52px]'}/> */}
                    <img 
                        src={user?.avatar ? getAssetsUrl(user.avatar) : user.socialAvatar ? user.socialAvatar : getAssetsUrl(DEFAULT_AVATAR)} 
                        alt="" 
                        className={!collapsed ? 'rounded-[16px] w-[84px] h-[84px]' : 'rounded-[50%] w-[32px] h-[32px]'}
                    />
                    {!collapsed && <>
                        <div className='flex gap-[12px] items-center w-full'>
                            
                            <div className='avatar-name'> 
                                {user?.name}
                            </div>
                            <div className='cursor-pointer avatar-action'  onClick={() => {navigate(routesConstant.dashboardProfile.path)}}>
                                <EditProfileIcon />
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            <div className='plane-name cursor-pointer' onClick={() => {setIsShowModalPricing(true)}}>
                                {_.get(planInfo, ['plan', 'name'], 'Free user') || 'Free user'}
                            </div>
                        </div>
                        {expiredTrialDate && <div className='text-time-remaining mt-[6px]'>
                            Trial Remaining : <span className='text-[var(--dark-blue-text)]'>{timeToNow} {unit}</span>
                        </div>}
                    </>}
                </div>
                <div
                    className={!collapsed ? 'flex flex-col justify-between mt-[16px] md:mt-[29px] flex-auto' : 'flex flex-col justify-between mt-[16px] md:mt-[29px] flex-auto' }
                    style={{
                        borderRight: "1px solid transparent",
                    }}
                >
                    <Menu
                        theme="dark"
                        mode="inline"
                        className="border-0 dashboard-sidebar-content"
                        onClick={onClickMenu}
                        items={menuItems.filter(el => el.roles.includes(userDetail?.role) && !el.hidden)}
                    />
                    <div>
                        {!collapsed && <div className='mt-[24px] px-[24px] tutorial-button-container'>
                            <div className='tutorial-button' onClick={() => {
                                if(window.innerWidth < DASHBOARD_SIDEBAR_WIDTH_BREAKPOINT){
                                    dispatch(setCollapsed(true))
                                }
                                navigate("/dashboard/tutorial")
                            }}>
                                <img src={TutorialIcon} alt="" className='w-[40px]'/>
                                <div className='tutorial-div-container'>
                                    <div className='text-title'>
                                        Tutorial
                                    </div>
                                    <div className='text-des'>
                                        Learn How to use Metadrob Dashboard Showroom Builder
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {collapsed && <div className='mt-[12px] px-[4px] cursor-pointer'>
                            <div className='tutorial-button-collapse'>
                                <img src={TutorialIcon} alt="" onClick={() => {navigate("/dashboard/tutorial")}}></img>
                            </div>
                        </div>}
                        <Menu
                            theme="dark"
                            mode="inline"
                            className="border-0 dashboard-sidebar-footer mt-[8px] mb-[24px]"
                            onClick={(info) => {
                                onClickMenuInfo(info)
                            }}
                            items={[
                                {
                                    key: 'logout',
                                    icon: <div className='d-flex h-100 justify-content-center'>
                                            <img className='dashboard-retailer-sidebar-icon max-w-none w-[18px] max-h-[18px] xl:w-[22px] 2xl:max-h-[26px] xl:w-[22px] 2xl:max-h-[26px]' src={logOutIcon} alt="" />
                                        </div>
                                    ,
                                    label: <div className='ml-[8px]'>
                                            <span className="title">Logout</span>
                                    </div>,
                                },
                            ]
                            }
                        />
                    </div>
                </div>
            </div>
      </Sider>
      <Layout className="site-layout h-[100vh]" id='siteLayout'>
        <DrobARetailerHeader />
        <Content
          style={{
            margin: 0,
            padding: 0,
            minHeight: 0,
            overflowY: "auto"
          }}
          className='site-layout-content'
        >
          <Outlet />
        </Content>
        <RetailerFooter />
      </Layout>
    </Layout>
    <ModalPricingPlan 
        open={isShowModalPricing}
        onClose={() => {setIsShowModalPricing(false)}}
        isPublishProject={true}
        isChangeToOrther={true}
    />
    </>
    ;
}

export default LayoutRetailerDrobA
