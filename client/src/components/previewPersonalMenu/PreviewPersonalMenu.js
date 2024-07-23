import { Dropdown } from "antd"
import "./styles.scss"
import { useSelector } from "react-redux"
import { getUser, setUser } from "../../redux/appSlice"
import ArrowRightIcon from "../../assets/images/project/preview/arrow-right.svg"
import { useEffect, useState } from "react"
import DrawerOrder from "../drawerOrder/DrawerOrder"
import { getAssetsUrl, isPublishModeLocation } from "../../utils/util"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ADDRESS_TYPE, DEFAULT_AVATAR, SOCIAL_TYPE, USER_ROLE } from "../../utils/constants"
import { getIsViewerMode } from "../../redux/modelSlice"
import { removeAllUserData } from "../../utils/storage"
import { useAppDispatch } from "../../redux"
import orderApi from "../../api/order.api"
import _ from "lodash"
import routesConstant from "../../routes/routesConstant"
import DrawerAddress from "../drawerAddress/DrawerAddress"
import addressApi from "../../api/address.api"
import ModalEditAvatar from "../modalEditAvatar/ModalEditAvatar"
import { isMobile } from "react-device-detect"

const PreviewPersonalMenu = ({
    container,
}) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [isShowMenu, setIsShowMenu] = useState(false)
    const user = useSelector(getUser);
    const [isShowDrawerOrder, setIsShowDrawerOrder] = useState(false)
    const [isShowDrawerAddresses, setIsShowDrawerAddresses] = useState(false)
    const {id: projectId, editorRole} = useParams()
    const isViewerMode = useSelector(getIsViewerMode)
    const [totalOrders, setTotalOrders] = useState(0)
    const [totalAddresses, setTotalAddresses] = useState(0)
    const [isShowModalEditAvatar, setIsShowModalEditAvatar] = useState(false)

    useEffect(() => {
        getListOrders()
    }, [user?.id])

    useEffect(() => {
        if(!isShowDrawerAddresses){
            getAllDestinationAddress()
        }
    }, [isShowDrawerAddresses])

    const onLogout = () => {
        if(user?.socialType === SOCIAL_TYPE.FACEBOOK){
            window.FB.logout()
        }

        removeAllUserData()

        dispatch(setUser(null))

        navigate("/")
    }

    const getListOrders = () => {
        orderApi.getListOrders().then(rs => {
            setTotalOrders(_.get(rs, ['totalResults'], 0))
        }).catch(err => {

        })
    }

    const getAllDestinationAddress = () => {
        addressApi.getAllAddress({type: ADDRESS_TYPE.SHIPPING_ADDRESS}).then(rs => {
            setTotalAddresses(_.get(rs, ['length'], 0))
        }).catch(err => {
            
        })
    }

    const redirectToProfilePage = () => {
        if(user?.id){
            if(user?.role === USER_ROLE.RETAILERS){
                navigate(routesConstant.dashboardProfile.path)
            }else if(user?.role === USER_ROLE.CUSTOMER){
                navigate(routesConstant.customerProfile.path)
            }
        }
    }

    return <>
        <Dropdown
            menu={{
                items: []
            }}
            dropdownRender={() => (
                <div className="menu-preview-personal-content">
                    <div className="avatar-container">
                        <img 
                            src={user?.socialAvatar ? user.socialAvatar : getAssetsUrl(user?.avatar || DEFAULT_AVATAR)} 
                            alt="" 
                            className='rounded-[50%] w-[clamp(32px,6vh,64px)] h-[clamp(32px,6vh,64px)]'
                        />
                        <div className="name-container">
                            <div className="name">
                                {user?.name}
                            </div>
                            <div className="email">
                                {user?.email}
                            </div>
                        </div>
                    </div>
                    <div className="menu-container mt-[16px]">
                        <div className="menu-item" 
                        onClick={() => {
                                setIsShowModalEditAvatar(true)
                                setIsShowMenu(false)
                            }
                        }>
                            <div className="title-container">
                                <div className="title">
                                    Edit Avatar
                                </div>
                            </div>
                            <img src={ArrowRightIcon} alt="" />
                        </div>
                        {/* <div 
                            className="menu-item" 
                            onClick={() => {
                                    setIsShowDrawerOrder(true)
                                    setIsShowMenu(false)
                                }
                            }
                        >
                            <div className="title-container">
                                <div className="title">
                                    My orders
                                </div>
                                <div className="title-description mt-[8px]">
                                    Already have {totalOrders} orders
                                </div>
                            </div>
                            <img src={ArrowRightIcon} alt="" />
                        </div> */}
                        {isPublishModeLocation(location) && <div 
                            className="menu-item" 
                            onClick={() => {
                                    setIsShowDrawerAddresses(true)
                                    setIsShowMenu(false)
                                }
                            }
                        >
                            <div className="title-container">
                                <div className="title">
                                    Shipping addresses
                                </div>
                                <div className="title-description mt-[8px]">
                                    {totalAddresses} addresses
                                </div>
                            </div>
                            <img src={ArrowRightIcon} alt="" />
                        </div>}
                        <div className="menu-item" onClick={() => {onLogout()}}>
                            <div className="title-container">
                                <div className="text-logout">
                                    Log Out
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            placement="topRight"
            arrow={false}
            trigger="click"
            overlayClassName='menu-preview-personal-overlay'
            open={isShowMenu && !isViewerMode}
            onOpenChange={(value) => {setIsShowMenu(value)}}
        >
            <div className='btn'>
                <img 
                    src={user?.socialAvatar ? user.socialAvatar : getAssetsUrl(user?.avatar || DEFAULT_AVATAR)} 
                    alt="" 
                    className={`rounded-[50%] ${isMobile ? 'w-[48px] h-[48px]' : 'w-[clamp(32px,8vh,50px)] h-[clamp(32px,8vh,50px)]'}`}
                />
            </div>
        </Dropdown>

        <DrawerOrder 
            open={isShowDrawerOrder}
            onClose={() => {setIsShowDrawerOrder(false)}}
            container={container.current}
        />

        <DrawerAddress 
            open={isShowDrawerAddresses}
            onClose={() => {setIsShowDrawerAddresses(false)}}
            container={container.current}
        />

        <ModalEditAvatar
            open={isShowModalEditAvatar}
            onClose={() => {setIsShowModalEditAvatar(false)}}
            onSuccess={() => {setIsShowModalEditAvatar(false)}}
        />
    </>
}
export default PreviewPersonalMenu