import { Input, Layout, Menu } from 'antd';
import React from 'react';

import logOutIcon from "../../assets/images/layout/logout.svg"
import homeIcon from "../../assets/images/layout/admin/home.svg"
import planIcon from "../../assets/images/layout/admin/plan.svg"
import menuIcon from "../../assets/images/layout/menu.svg"
import SearchIcon from "../../assets/images/layout/search.svg"
import UploadIcon from "../../assets/images/layout/admin/upload.svg"
import UsersIcon from "../../assets/images/layout/admin/user.svg"
import ApiIcon from "../../assets/images/layout/admin/api.svg"

import { Outlet, useNavigate } from 'react-router-dom';
import { getStorageUserDetail, removeAllUserData } from '../../utils/storage';
import { DEFAULT_AVATAR, SOCIAL_TYPE } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, setUser } from '../../redux/appSlice';
import { getCollapsed, setCollapsed } from '../../redux/navbarSlice';
import AdminHeader from '../../components/adminHeader/AdminHeader';
import AdminFooter from '../../components/adminComponents/adminFooter/AdminFooter';
import { getAssetsUrl } from '../../utils/util';
import routesConstant from '../../routes/routesConstant';

const { Sider, Content } = Layout;
const LayoutShopifyAdmin = ({children}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const collapsed= useSelector(getCollapsed)

    const userDetail = getStorageUserDetail()
    const user = useSelector(getUser)

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

            navigate(routesConstant.shopifyAdminLogin.path)
        } else {
            navigate(info.key)
        }
    }

    return (
    <Layout>
        <Sider 
            trigger={null} 
            theme="dark" 
            collapsible 
            collapsed={collapsed}
            collapsedWidth={window.innerWidth >= 768 ? 80 : 0}
            width={window.innerWidth >= 768 ? 283 : window.innerWidth}
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
            className={`admin-sidebar-container ${collapsed ? 'collapsed' : ''}`}
        >
            <div className="admin-sidebar-toggle">
                <button className="btn-toggle text-[#FFFFFF]" onClick={() => {dispatch(setCollapsed(!collapsed))}}>
                    <img src={menuIcon} alt="" />
                </button>
            </div>
            <div className='avatar-info'>
                <img src={user?.avatar ? getAssetsUrl(user.avatar) : user.socialAvatar ? user.socialAvatar : getAssetsUrl(DEFAULT_AVATAR)} alt="" className={!collapsed ? 'rounded-[50%] w-[32px] h-[32px]' : 'rounded-[50%] w-[32px] h-[32px]'}/>
                {!collapsed && <div className='avatar-name'>
                    {user?.name}
                </div>}
            </div>
            {!collapsed && window.innerWidth < 768 && <div className='px-[24px] mt-[7px] w-full'>
                    <Input placeholder="Search" className='header-search' prefix={<img src={SearchIcon} alt="" />} />
                </div>
            }
            <div 
                className={!collapsed ? 'flex flex-col justify-between mt-[16px]' : 'flex flex-col justify-between mt-[16px]' }
                style={{
                    borderRight: "1px solid transparent"
                }}
            >
                <Menu
                    theme="dark"
                    mode="inline"
                    className="border-0 admin-sidebar-content"
                    onClick={onClickMenu}
                    items={[
                        {
                            key: routesConstant.shopifyAdminHome.path,
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={homeIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Home</span>
                                </div>,
                        },
                        {
                            key: routesConstant.shopifyAdminUsers.path,
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={UsersIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">User</span>
                                </div>,
                        },
                        {
                            key: routesConstant.shopifyAdminStore.path,
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={ApiIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Store</span>
                                </div>,
                        },
                        {
                            key: routesConstant.shopifyAdminUpload.path,
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={UploadIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Upload</span>
                                </div>,
                            popupClassName: "admin-sub-menu-popup",
                            children: [
                                {
                                    key: routesConstant.shopifyAdminUploadTemplate.path,
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">3D Template</span>
                                        </div>,
                                },
                                {
                                    key: routesConstant.shopifyAdminUploadDecorative.path,
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">Decorative</span>
                                        </div>,
                                },
                                {
                                    key: routesConstant.shopifyAdminUploadAnimation.path,
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">Animation</span>
                                        </div>,
                                },
                                {
                                    key: routesConstant.shopifyAdminUploadHdri.path,
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">HDRI</span>
                                        </div>,
                                },
                                {
                                    key: routesConstant.shopifyAdminUploadText.path,
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">Text</span>
                                        </div>,
                                },
                                {
                                    key: routesConstant.shopifyAdminUploadTutorialVideo.path,
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">Tutorial Video</span>
                                        </div>,
                                },
                                {
                                    key: routesConstant.shopifyAdminUploadPlaceholder.path,
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">Placeholder</span>
                                        </div>,
                                }
                            ]
                        },
                        {
                            key: routesConstant.shopifyAdminPlan.path,
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={planIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Plan</span>
                                </div>,
                        },
                    ]
                }
                />
                <div className='divider mt-[45px]'>

                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    className="border-0 admin-sidebar-footer mt-[26px] mb-[24px]"
                    onClick={(info) => {
                        onClickMenuInfo(info)
                    }}
                    items={[
                        {
                            key: routesConstant.shopifyAdminSetting.path,
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={ApiIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Settings</span>
                                </div>,
                        },
                        {
                            key: 'logout',
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={logOutIcon} alt="" />
                                </div>
                            ,
                            label: <div className=''>
                                    <span className="title">Logout</span>
                            </div>,
                        },
                    ]
                }
                />
            </div>
        
      </Sider>
      <Layout className="site-layout-admin h-[100vh]" id='siteLayout'>
        <AdminHeader/>
        <Content
            className="admin-layout-content"
            style={{
                margin: 0,
                padding: 0,
                minHeight: 0,
                overflowY: "auto"
            }}
        >
          <Outlet />
        </Content>
        <AdminFooter />
      </Layout>
    </Layout>
  );
}

export default LayoutShopifyAdmin