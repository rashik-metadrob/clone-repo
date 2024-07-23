import "./styles.scss"
import {isMobile} from 'react-device-detect';
import NavigateIcon from "../../../../assets/images/project/navigate.svg"
import LogoImage from "../../../../assets/images/project/logo.svg"
import ThreeDotIcon from "../../../../assets/images/project/three-dot.svg"
import InviteIcon from "../../../../assets/images/project/invite.svg"
import InstructionIcon from "../../../../assets/images/project/instruction.svg"
import { Dropdown, Input } from "antd";
import PersonalControl from "../../../personalControl/PersonalControl";
import MovingGuide from "../../../movingGuide/MovingGuide";
import { useEffect, useMemo, useState } from "react";
import ArrowRightIcon from "../../../../assets/images/project/preview/arrow-right.svg"
import ModalSetting from "../../../modalSetting/ModalSetting";
import ModalCustomerGuide from "../../../modalCustomerGuide/ModalCustomerGuide";
import ModalReportIssue from "../../../modalReportIssue/ModalReportIssue";
import DrawerInvite from "../../../drawerInvite/DrawerInvite";
import { useSelector } from "react-redux";
import { getUser, setUser } from "../../../../redux/appSlice";
import PreviewPersonalMenu from "../../../previewPersonalMenu/PreviewPersonalMenu";
import PreviewChat from "../../../previewChat/PreviewChat";
import PreviewNavigate from "../../../previewNavigate/PreviewNavigate";
import { useNavigate, useParams } from "react-router-dom";
import { PRODUCT_TYPES, SOCIAL_TYPE, USER_ROLE, APP_EVENTS } from "../../../../utils/constants";
import { getCanBeJoinMultiplePlayer, getIsPreviewModel, getIsStoreHasWhiteLabel, getIsViewerMode, getListCameras, getListProducts, getSelectedObject } from "../../../../redux/modelSlice";
import { removeAllUserData } from "../../../../utils/storage";
import { useAppDispatch } from "../../../../redux";
import SearchIcon from "../../../../assets/images/project/search-product.svg"
import _ from "lodash";
import { isPublishModeLocation } from "../../../../utils/util";
import { useLocation } from 'react-router-dom';

import MoreOptionIcon from "../../../../assets/images/mobile/more-option.svg"
import RequireFullScreenIcon from "../../../../assets/images/mobile/require-full-screen.svg"
import OutFullScreenIcon from "../../../../assets/images/mobile/out-full-screen.svg"
import MobileSearchProductIcon from "../../../../assets/images/mobile/search-product.svg"
import { getIsShowWallPreviewNavigate, setIsShowWallPreviewNavigate } from "../../../../redux/uiSlice";
import KeepRunningSetting from "../../../personalControl/components/keepRunningSetting/KeepRunningSetting";
import MobileNavigateIcon from "../../../../assets/images/mobile/navigate.svg"
import MetadrobProfileIcon from "../../../../assets/images/project/metadrob-profile-logo.svg"

const PreviewControl = ({
    container,
    onSelectWall = () => {},
    onPlayOpenMenuSound = () => {},
    onPlayCloseMenuSound = () => {},
}) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const isPreviewMode = useSelector(getIsPreviewModel)
    const listProducts = useSelector(getListProducts)
    const selectedObject = useSelector(getSelectedObject)
    const [searchValue, setSearchValue] = useState('')
    const [isShowDrawerInvite, setIsShowDrawerInvite] = useState(false)
    const [isShowModalReportIssue, setIsShowModalReportIssue] = useState(false)
    const [isShowModalSetting, setIsShowModalSetting] = useState(false)
    const [isShowModalCustomerGuide, setIsShowModalCustomerGuide] = useState(false)
    const [isShowMovingGuide, setIsShowMovingGuide] = useState(false)
    const isShowWallPreviewNavigate = useSelector(getIsShowWallPreviewNavigate)
    const listCameras = useSelector(getListCameras)
    const isStoreHasWhiteLabel = useSelector(getIsStoreHasWhiteLabel)
    const canBeJoinMultiplePlayer = useSelector(getCanBeJoinMultiplePlayer)
    const isViewerMode = useSelector(getIsViewerMode)
    const user = useSelector(getUser)
    const [isPortraitMode, setIsPortraitMode] = useState(window.innerHeight > window.innerWidth)
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isShowInput, setIsShowInput] = useState(false)

    const filterProducts = useMemo(() => {
        if(searchValue){
            return listProducts.filter(el => _.get(el, ['type']) === PRODUCT_TYPES.PRODUCTS).filter(el => {
                const name = _.get(el, ['name'])
                if(name && name.toLowerCase().includes(searchValue.toLowerCase())) {
                    return true
                } else {
                    return false
                }
            })
        } else {
            return []
        }
    }, [searchValue, listProducts])

    useEffect(() => {
        function onFullscreenChange() {
          setIsFullscreen(Boolean(document.fullscreenElement));
        }
              
        document.addEventListener('fullscreenchange', onFullscreenChange);
      
        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange)
            dispatch(setIsShowWallPreviewNavigate(false))
        }
    }, []);
    

    useEffect(() => {
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const handleResize = () => {
    setIsPortraitMode(window.innerHeight > window.innerWidth)
    }

    const handleLogout = () => {
        if(user?.socialType === SOCIAL_TYPE.FACEBOOK){
            window.FB.logout()
        }

        removeAllUserData()

        dispatch(setUser(null))

        navigate("/")
    }

    const items = [
        {
          key: 'navigate',
          label: (
            <div className='menu-preview-items'>
                Navigate
                <img src={ArrowRightIcon} alt="" />
            </div>
          ),
          hidden: !isMobile || (listCameras && listCameras.length === 0)
        },
        // NO FUNCTIONAL
        // {
        //   key: 'invite',
        //   label: (
        //     <div className='menu-preview-items'>
        //         Invite
        //         <img src={ArrowRightIcon} alt="" />
        //     </div>
        //   ),
        //   hidden: !isMobile
        // },
        // NO FUNCTIONAL
        // {
        //     key: 'settings',
        //     label: (
        //         <div className='menu-preview-items'>
        //             Settings
        //             <img src={ArrowRightIcon} alt="" />
        //         </div>
        //     )
        // },
        {
            key: 'guide',
            label: (
                <div className='menu-preview-items'>
                    Guide
                    <img src={ArrowRightIcon} alt="" />
                </div>
            )
        },
        {
            key: 'report',
            label: (
                <div className='menu-preview-items'>
                    Report issue
                    <img src={ArrowRightIcon} alt="" />
                </div>
            )
        },
        {
            key: 'fullScreen',
            label: (
                <div className='menu-preview-items'>
                    Full Screen
                </div>
            )
        },
        // Required remove logout button
        // {
        //     key: 'Log out',
        //     label: (
        //         <div className='menu-preview-items' onClick={() => {handleLogout()}}>
        //             Log out
        //         </div>
        //     ),
        //     hidden: isViewerMode
        // }
    ];

    const onMenuClick = (info) => {
        if(info.key === "settings"){
            setIsShowModalSetting(true)
        } else if(info.key === "guide"){
            setIsShowModalCustomerGuide(true)
        } else if(info.key === "report"){
            setIsShowModalReportIssue(true)
        } else if(info.key === "invite"){
            setIsShowDrawerInvite(true)
        } else if(info.key === "navigate"){
            dispatch(setIsShowWallPreviewNavigate(true))
        } else if(info.key === "fullScreen"){
            onToggleFullScreen()
        }
    }

    const onToggleFullScreen = () => {
        if(document.fullscreenElement){
            document.exitFullscreen()
        } else {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
    
            if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            }
            
            if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        }
    }

    const onFocusToObject = (id) => {
        dispatchEvent(new CustomEvent(APP_EVENTS.FOCUS_TO_PUBLISH_OBJECT, {detail: {id}}))
    }

    return <>
        {
            isPreviewMode
            && isMobile
            && <>
                <div className={`navigate-and-run-container ${isMobile ? 'mobile' : 'desktop'} ${isPortraitMode ? "portrait" : "landscape"}`}>
                    {
                        isPublishModeLocation(location) && <>
                            <div className={`setting mb-[7px]`} onClick={() => {
                                dispatch(setIsShowWallPreviewNavigate(!isShowWallPreviewNavigate))
                            }}>
                                <img src={MobileNavigateIcon} alt='room' className='!w-[26px] !h-[26px] object-contain' />
                            </div>
                            <div>
                                <KeepRunningSetting />
                            </div>
                        </>
                    }
                </div>
            </>
        }
        {isPreviewMode && 
            <>
                <div className="top-preview-control-wrapper">
                    {!isMobile && listCameras && listCameras.length > 0 && 
                        <div className="top-preview-control-item">
                            <div className='btn-navigate' onClick={() => {dispatch(setIsShowWallPreviewNavigate(!isShowWallPreviewNavigate))}}>
                                <img src={MobileNavigateIcon} alt="" className="btn-navigate-image"/>
                                Navigate
                            </div>
                        </div>
                    }
                    <div className={`logo-container ${isMobile ? 'left' : 'center'} top-preview-control-item`}>
                        <img src={LogoImage} alt="" className="h-[clamp(20px,3.7vh,40px)]"/>
                        {
                            !isStoreHasWhiteLabel &&
                            <div className="flex flex-nowrap gap-[3px] items-center ">
                                <span className="whitespace-nowrap font-inter font-[400] text-[12px] leading-[14px] text-[#FFF]">
                                    Powered by
                                </span>
                                <img src={LogoImage} alt="" className="h-[10px]" />
                            </div>
                        }
                    </div>
                    <div className={`invite-container top-preview-control-item flex ${isMobile ? '!gap-[15px]' : '!gap-[10px]'} ${isMobile ? 'mobile' : 'desktop'} ${isPortraitMode ? "portrait" : "landscape"}`}>
                        <Dropdown
                            menu={{
                                items: items.filter(el => !el.hidden),
                                onClick: (info) => {
                                    onMenuClick(info)
                                }
                            }}
                            placement="bottomLeft"
                            arrow={false}
                            trigger="click"
                            overlayClassName='menu-preview-overlay'
                        >
                            <div>
                                {!isMobile && <img src={ThreeDotIcon} alt="" className='cursor-pointer w-[clamp(30px,7vh,50px)] h-[clamp(30px,7vh,50px)]'/>}
                                {isMobile && <img src={MoreOptionIcon} alt="" className='cursor-pointer'/>}
                            </div>
                        </Dropdown>

                        {isMobile && <img src={isFullscreen ? OutFullScreenIcon : RequireFullScreenIcon} alt="" className='cursor-pointer' onClick={() => {onToggleFullScreen()}}/>}

                        {/* Search */}
                        { isPreviewMode && <Dropdown
                            menu={{
                                items: [],
                            }}
                            placement="bottomLeft"
                            arrow={false}
                            trigger="click"
                            overlayClassName={`search-publish-product-result-overlay ${isMobile ? 'mobile' : 'desktop'} ${isPortraitMode ? "portrait" : "landscape"}`}
                            dropdownRender={props => {
                                return <>
                                <div className="search-publish-product-result-container">
                                        {
                                            filterProducts.map(el => (
                                                <div className={`item ${selectedObject === el.id ? 'active' : ''}`} key={el.id} onClick={() => {onFocusToObject(el.id)}}>
                                                    {_.get(el, ['name'])}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </>
                            }}
                        >
                            <Input
                                placeholder="Search product by name"
                                className={`input-search-publish-product ${isShowInput ? 'show-full-input' : ''} ${isMobile ? 'mobile' : 'desktop'} ${isPortraitMode ? "portrait" : "landscape"}`}
                                suffix={<img src={isMobile ? MobileSearchProductIcon : SearchIcon} alt="" onClick={() => {setIsShowInput(!isShowInput)}}/>}
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value)
                                }}
                            />
                        </Dropdown>}
                    </div>
                </div>
                {
                    user && <div className='bottom-right-container'>
                        {/* Hidden */}
                        {/* {canBeJoinMultiplePlayer && <PreviewChat />} */}
                        <PreviewPersonalMenu container={container}/>
                    </div>
                }
                {/* Show metadrob icon when user not login */}
                {
                    !user && <div className='bottom-right-container'>
                        <div className='btn !bg-[transparent]'>
                            <img 
                                src={MetadrobProfileIcon} 
                                alt="" 
                                className={`rounded-[50%] ${isMobile ? 'w-[48px] h-[48px]' : 'w-[clamp(32px,8vh,50px)] h-[clamp(32px,8vh,50px)]'}`}
                            />
                        </div>
                    </div>
                }
                <PreviewNavigate 
                    isShow={isShowWallPreviewNavigate}
                    setIsShow={(value) => {dispatch(setIsShowWallPreviewNavigate(value))}}
                    onSelectWall={onSelectWall}
                />
            </>
        }
        {
            isPreviewMode && 
            <PersonalControl 
                container={container} 
                onPlayOpenMenuSound={onPlayOpenMenuSound}
                onPlayCloseMenuSound={onPlayCloseMenuSound}
            />
        }

        <ModalSetting 
            open={isShowModalSetting}
            onClose={() => {setIsShowModalSetting(false)}}
        />
        <ModalCustomerGuide
            open={isShowModalCustomerGuide}
            onClose={() => {setIsShowModalCustomerGuide(false)}}
        />
        <ModalReportIssue
            open={isShowModalReportIssue}
            onClose={() => {setIsShowModalReportIssue(false)}}
        />
        <DrawerInvite
            open={isShowDrawerInvite}
            onClose={() => {setIsShowDrawerInvite(false)}}
            container={container}
        />

        {isPreviewMode && !isMobile && <div className='moving-guide-button-container'>
            <img src={InstructionIcon} alt="" className='cursor-pointer' onClick={() => {setIsShowMovingGuide(!isShowMovingGuide)}}/>
        </div>}
        <MovingGuide isShow={isShowMovingGuide} />
    </>
}

export default PreviewControl;