import { Input, Layout, Menu, Row, theme } from 'antd';
import React, { useEffect, useState } from 'react';
// import Header from '../../components/header/Header';
import "./styles.scss"

import logOutIcon from "../../assets/images/layout/logout.svg"
import homeIcon from "../../assets/images/layout/home.svg"
import orderIcon from "../../assets/images/layout/cart.svg"
import productIcon from "../../assets/images/layout/product.svg"
import customerIcon from "../../assets/images/layout/customer.svg"
import analyticIcon from "../../assets/images/layout/analytics.svg"
import marketingIcon from "../../assets/images/layout/marketing.svg"
import discountIcon from "../../assets/images/layout/discount.svg"
import supportIcon from "../../assets/images/layout/support.svg"
import roomIcon from "../../assets/images/layout/room.svg"
import pluginIcon from "../../assets/images/layout/plugin.svg"
import onlineStoreImg from "../../assets/images/layout/online-store.png"
import menuIcon from "../../assets/images/layout/menu.svg"
import SearchIcon from "../../assets/images/layout/search.svg"
import lockIcon from "../../assets/images/layout/lock.svg"

import avatarImg from "../../assets/images/layout/avatar.png"
import { Outlet, useNavigate } from 'react-router-dom';
import HeaderDashboard from '../../components/header/Header';
import { getStorageUserDetail, removeAllUserData } from '../../utils/storage';
import { DEFAULT_AVATAR, SOCIAL_TYPE, USER_ROLE } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, setUser } from '../../redux/appSlice';
import { setCollapsed } from "../../redux/navbarSlice";
import { getCollapsed } from "../../redux/navbarSlice";
import { getAssetsUrl } from '../../utils/util';
import routesConstant from '../../routes/routesConstant';

const { Sider, Content } = Layout;
const LayoutCustomer = ({children}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [windowWidth, setWindowWidth] = useState(0)

    const collapsed = useSelector(getCollapsed)

    const userDetail = getStorageUserDetail()
    const user = useSelector(getUser)

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    useEffect(() => {
        setWindowWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const handleResize = () => {
        setWindowWidth(window.innerWidth)
    }

    const onClickMenu = (e) => {
        navigate(e.key)
        if(window.innerWidth < 768){
            dispatch(setCollapsed(true))
        }
    }

    const onClickMenuInfo = (info) => {
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
    ]

    return <>
    <Layout>
        <Sider
            trigger={null} 
            theme="dark" 
            collapsible 
            collapsed={collapsed}
            collapsedWidth={windowWidth >= 768 ? 80 : 0}
            width={windowWidth >= 768 ? 340 : windowWidth}
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
            className="dashboard-sidebar-container"
        >
            <div className="dashboard-sidebar-toggle">
                <button id="navbutton" className="btn-toggle text-[#FFFFFF]" onClick={() => {dispatch(setCollapsed(!collapsed))}}>
                    <img src={menuIcon} alt="" />
                </button>
            </div>
            <div className='avatar-info'>
                <img src={user?.socialAvatar ? user.socialAvatar : getAssetsUrl(user.avatar || DEFAULT_AVATAR)} alt="" className={!collapsed ? 'rounded-[12px] w-[84px] h-[84px]' : 'rounded-[12px] w-[52px] h-[52px]'}/>
                {!collapsed && <div className='mt-[18px] avatar-name'>
                    {user?.name}
                </div>}
                {!collapsed && <div className='mt-[7px] avatar-edit-profile cursor-pointer' onClick={() => {navigate(routesConstant.customerProfile.path)}}>
                    Edit Profile
                </div>}
                {!collapsed && windowWidth <= 768 && <div className='px-[24px] mt-[7px] w-full'>
                        <Input placeholder="Search" className='header-search' prefix={<img src={SearchIcon} alt="" />} />
                    </div>
                }
            </div>
            <div
                className={!collapsed ? 'flex flex-col justify-between mt-[24px]' : 'flex flex-col justify-between mt-[24px]' }
                style={{
                    borderRight: "1px solid transparent"
                }}
            >
                <Menu
                    theme="dark"
                    mode="inline"
                    className="border-0 dashboard-sidebar-content"
                    onClick={onClickMenu}
                    items={menuItems.filter(el => el.roles.includes(userDetail?.role))}
                />
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
                                    <img className='dashboard-sidebar-icon max-w-none' src={logOutIcon} alt="" />
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

      </Sider>
      <Layout className="site-layout h-[100vh]" id='siteLayout'>
        <HeaderDashboard />
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
      </Layout>
    </Layout>
    </>
    ;
}

export default LayoutCustomer
