import { Input, Layout, Menu, theme } from 'antd';
import React from 'react';
import "./styles.scss"

import logOutIcon from "../../assets/images/layout/logout.svg"
import homeIcon from "../../assets/images/layout/admin/home.svg"
import planIcon from "../../assets/images/layout/admin/plan.svg"
import menuIcon from "../../assets/images/layout/menu.svg"
import SearchIcon from "../../assets/images/layout/search.svg"
import UploadIcon from "../../assets/images/layout/admin/upload.svg"
import UsersIcon from "../../assets/images/layout/admin/user.svg"
import ApiIcon from "../../assets/images/layout/admin/api.svg"
import MarketingIcon from "../../assets/images/layout/admin/marketing.svg"
import CollabIcon from "../../assets/images/layout/admin/collab.svg"

import { Outlet, useNavigate } from 'react-router-dom';
import { getStorageUserDetail, removeAllUserData } from '../../utils/storage';
import { DEFAULT_AVATAR, PERMISSIONS, SOCIAL_TYPE } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, setUser } from '../../redux/appSlice';
import { getCollapsed, setCollapsed } from '../../redux/navbarSlice';
import AdminHeader from '../../components/adminHeader/AdminHeader';
import AdminFooter from '../../components/adminComponents/adminFooter/AdminFooter';
import { getAssetsUrl } from '../../utils/util';
import routesConstant from '../../routes/routesConstant';
import usePermissions from '../../hook/usePermissions';

const { Sider, Content } = Layout;
const LayoutAdmin = ({children}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const collapsed= useSelector(getCollapsed)

    const userDetail = getStorageUserDetail()
    const user = useSelector(getUser)

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onClickMenu = (e) => {
        navigate(e.key)
        if(window.innerWidth < 768){
            dispatch(setCollapsed(true))
        }
    }

    const { requirePermissionOfSuperAdmin } = usePermissions()

    const onClickMenuInfo = (info) => {
        console.log("info", info)
        if(info.key === "logout"){
            if(userDetail?.socialType === SOCIAL_TYPE.FACEBOOK){
                window.FB.logout()
            }

            removeAllUserData()

            dispatch(setUser(null))

            navigate(routesConstant.adminLogin.path)
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
                            key: '/admin/home',
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={homeIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Home</span>
                                </div>,
                        },
                        {
                            key: '/admin/users',
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={UsersIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">User</span>
                                </div>,
                            hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_USERS),
                        },
                        {
                            key: '/admin/tickets',
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={UsersIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Ticket</span>
                                </div>,
                            hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_TICKETS),
                        },
                        {
                            key: routesConstant.adminRoleAndPermission.path,
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={UsersIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Role</span>
                                </div>,
                            hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_ROLES),
                        },
                        {
                            key: '/admin/api',
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={ApiIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">API</span>
                                </div>,
                            hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_APIS),
                        },
                        {
                            key: '/admin/store',
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={ApiIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Store</span>
                                </div>,
                            hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_STORES),
                        },
                        {
                            key: '/admin/upload',
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={UploadIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Upload</span>
                                </div>,
                            popupClassName: "admin-sub-menu-popup",
                            children: [
                                {
                                    key: '/admin/upload/template',
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">3D Template</span>
                                        </div>,
                                    hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_TEMPLATES),
                                },
                                {
                                    key: '/admin/upload/decorative',
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">Decorative</span>
                                        </div>,
                                    hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_DECORATIVES),
                                },
                                {
                                    key: '/admin/upload/animation',
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">Animation</span>
                                        </div>,
                                    hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_ANIMATIONS),
                                },
                                {
                                    key: '/admin/upload/hdri',
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">HDRI</span>
                                        </div>,
                                    hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_HDRIS),
                                },
                                {
                                    key: routesConstant.adminUploadText.path,
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">Text</span>
                                        </div>,
                                    hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_TEXTS),
                                },
                                {
                                    key: routesConstant.adminUploadTutorialVideo.path,
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">Tutorial Video</span>
                                        </div>,
                                    hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_TUTORIAL_VIDEOS),
                                },
                                {
                                    key: routesConstant.adminUploadPlaceholder.path,
                                    icon: null,
                                    label: <div className=''>
                                            <span className="title admin-sub-menu-title">Placeholder</span>
                                        </div>,
                                    hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_PLACEHOLDERS),
                                }
                            ].filter(el => !el.hidden)
                        },
                        {
                            key: '/admin/plan',
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={planIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Plan</span>
                                </div>,
                            hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_PLANS),
                        },
                        {
                            key: '/admin/marketing',
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={MarketingIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Marketing</span>
                                </div>,
                            hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_MARKETING),
                        },
                        {
                            key: '/admin/collaboration',
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={CollabIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Collaboration</span>
                                </div>,
                            hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_COLLABORATION),
                        },
                    ].filter(el => !el.hidden)
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
                            key: routesConstant.adminSetting.path,
                            icon: <div className='d-flex h-100 justify-content-center'>
                                    <img className='admin-sidebar-icon max-w-none' src={ApiIcon} alt="" />
                                </div>,
                            label: <div className=''>
                                    <span className="title">Settings</span>
                                </div>,
                            hidden: !requirePermissionOfSuperAdmin(PERMISSIONS.SUPER_ADMIN_MANAGE_SETTINGS),
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
                    ].filter(el => !el.hidden)
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

export default LayoutAdmin