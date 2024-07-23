import "./styles.scss"
import BrandIcon from "../../../../assets/images/project/sidebar/brand.svg"
import TextIcon from "../../../../assets/images/project/sidebar/text.svg"
import ProductIcon from "../../../../assets/images/project/sidebar/product.svg"
import DressIcon from "../../../../assets/images/project/sidebar/dress.svg"
import UploadIcon from "../../../../assets/images/project/sidebar/upload.svg"
import LogoutIcon from "../../../../assets/images/project/sidebar/logout.svg"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import DrawerProducts from '../../../drawerProducts/DrawerProducts';
import DrawerDecoratives from '../../../drawerDecoratives/DrawerDecoratives';
import DrawerTheme from '../../../drawerTheme/DrawerTheme';
import { useEffect, useRef, useState } from "react"
import { Tooltip } from "antd"
import DrawerText from "../../../drawerText/DrawerText"
import DrawerUpload from "../../../drawerUpload/DrawerUpload"
import { PRODUCT_TYPES, USER_ROLE } from "../../../../utils/constants"
import ModalUploadMultipleType from "../../../modalUploadMultipleType/ModalUploadMultipleType"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentMenu, setCurrentMenu } from "../../../../redux/navbarSlice"
import global from "../../../../redux/global"
import routesConstant from "../../../../routes/routesConstant"
import ObjectListIcon from "../../../../assets/images/project/object-list.svg"
import ObjectListArrowRightIcon from "../../../../assets/images/project/object-list-arrow-right.svg"
import DrawerObjectList from "../../../drawerObjectList/DrawerObjectList"
import { getIsPreviewModel, getIsViewerMode } from "../../../../redux/modelSlice"
import {isMobile} from 'react-device-detect';
import { isPublishModeLocation } from "../../../../utils/util"

const EditorSidebar = ({
    loadingPercent,
    isRoomLoaded,
    container,
    handleDragEnd,
    onPlayOpenMenuSound = () => {},
    onPlayCloseMenuSound = () => {}
}) => {
    const currentMenu = useSelector(getCurrentMenu)
    const isViewerMode = useSelector(getIsViewerMode)
    const location = useLocation()
    const navigate = useNavigate()
    const productsContainer = useRef()
    const elementsContainer = useRef()
    const [isOpenModalAddProduct, setIsOpenModalAddProduct] = useState(false)
    const [productType, setProductType] = useState(PRODUCT_TYPES.PRODUCTS)
    const { editorRole } = useParams()
    const dispatch = useDispatch()
    const menuRef = useRef()
    const isPreviewMode = useSelector(getIsPreviewModel)

    useEffect(() => {
        if(currentMenu){
            onPlayOpenMenuSound()
        } else {
            onPlayCloseMenuSound()
        }
    }, [currentMenu])
    
    const handleClickMenu = (menuName) => {
        if(currentMenu === menuName){
            dispatch(setCurrentMenu(""))
        } else {
            dispatch(setCurrentMenu(menuName))
        }
    }

    const onGoBack = () => {
        if(global.IS_SHOPIFY){
            navigate(routesConstant.firstLogin.path)
            return
        }
        if(editorRole && editorRole === USER_ROLE.ADMIN){
            navigate("/admin/store")
        } else {
            navigate("/dashboard/store")
        }
    }

    const isMenuOverflow = () => {
        if(menuRef.current){
            if(menuRef.current.scrollHeight > menuRef.current.clientHeight){
                return true
            }
        }

        return false
    }
    
    return <>
        {!isPreviewMode && !isPublishModeLocation(location) && <div className="object-list-toggle-container" onClick={() => {handleClickMenu("Object-list")}}>
            <div className="object-list-toggle-button">
                <div className="name-container">
                    <img src={ObjectListIcon} alt="" />
                    {!isMobile && <span>
                        Object List
                    </span>}
                </div>
                <div className="arrow">
                    <img src={ObjectListArrowRightIcon} alt="" />
                </div>
            </div>
        </div>}
        {
            !isPreviewMode && !isPublishModeLocation(location) && <div className={`sidebar-editor-menu !pt-[92px] ${loadingPercent === 100 && isRoomLoaded && !currentMenu ? 'show' : ''}`}>
                <div ref={menuRef} className={`menu-list-container ${isMenuOverflow() ? 'justify-start' : 'justify-center'}`}>
                    <Tooltip placement="right" title={<div className="sidebar-editor-tooltip">Brand identity</div>} arrow={false}>
                        <div className={`menu-item ${isViewerMode ? 'disabled' : ''}`} style={{'--index': 0}} onClick={() => {handleClickMenu("Theme")}}>
                            <img src={BrandIcon} alt="" />
                        </div>
                    </Tooltip>
                    <Tooltip placement="right" title={<div className="sidebar-editor-tooltip">Text</div>} arrow={false}>
                        <div className={`menu-item ${isViewerMode ? 'disabled' : ''}`} style={{'--index': 1}} onClick={() => {handleClickMenu("Text")}}>
                            <img src={TextIcon} alt="" />
                        </div>
                    </Tooltip>
                    <Tooltip placement="right" title={<div className="sidebar-editor-tooltip">Products</div>} arrow={false}>
                        <div className={`menu-item ${isViewerMode ? 'disabled' : ''}`} style={{'--index': 2}} onClick={() => {handleClickMenu("Products")}}>
                            <img src={ProductIcon} alt="" />
                        </div>
                    </Tooltip>
                    <Tooltip placement="right" title={<div className="sidebar-editor-tooltip">Decoratives</div>} arrow={false}>
                        <div id="decorativeMenuItem" className={`menu-item`} style={{'--index': 3}} onClick={() => {handleClickMenu("Decoratives")}}>
                            <img src={DressIcon} alt="" />
                        </div>
                    </Tooltip>
                    {/* <Tooltip placement="right" title={<div className="sidebar-editor-tooltip">Coming Soon</div>} arrow={false}>
                        <div className='menu-item disabled' style={{'--index': 4}}>
                            <img src={EffectIcon} alt="" />
                        </div>
                    </Tooltip> */}
                    <Tooltip placement="right" title={<div className="sidebar-editor-tooltip">Upload</div>} arrow={false}>
                        <div className={`menu-item ${isViewerMode ? 'disabled' : ''}`} style={{'--index': 4}} onClick={() => {handleClickMenu("Upload")}}>
                            <img src={UploadIcon} alt="" />
                        </div>
                    </Tooltip>
                </div>
                {(!editorRole || !isViewerMode) && <div className='logout-button' style={{'--index': 5}}>
                    <img src={LogoutIcon} alt="" onClick={() => {onGoBack()}}/>
                </div>}
            </div>
        }

        {!isPublishModeLocation(location) && !location.pathname.includes('publish') && <DrawerDecoratives 
            open={currentMenu === "Decoratives" && !isPreviewMode && loadingPercent === 100 && isRoomLoaded}
            onClose={() => {
                dispatch(setCurrentMenu(""))
            }}
            container={container.current}
            handleDragEnd={handleDragEnd}
        />}
        {!isPublishModeLocation(location) && !location.pathname.includes('publish') && <DrawerProducts 
            ref={productsContainer}
            open={currentMenu === "Products" && !isPreviewMode && loadingPercent === 100 && isRoomLoaded}
            onClose={() => {dispatch(setCurrentMenu(""))}}
            container={container.current}
            handleDragEnd={handleDragEnd}
            onUpload={() => {
                setProductType(PRODUCT_TYPES.PRODUCTS)
                setIsOpenModalAddProduct(true)
            }}
        />}
        {!isPublishModeLocation(location) && !location.pathname.includes('publish') && <DrawerUpload
            ref={elementsContainer}
            open={currentMenu === "Upload" && !isPreviewMode && loadingPercent === 100 && isRoomLoaded}
            onClose={() => {dispatch(setCurrentMenu(""))}}
            container={container.current}
            handleDragEnd={handleDragEnd}
            onUpload={() => {
                setProductType(PRODUCT_TYPES.ELEMENT)
                setIsOpenModalAddProduct(true)
            }}
        />}
        {/* {!isPublishModeLocation(location) && !location.pathname.includes('publish') && <DrawerEffect
            open={currentMenu === "Effect" && !isPreviewMode && loadingPercent === 100 && isRoomLoaded}
            onClose={() => {dispatch(setCurrentMenu(""))}}
            container={container.current}
        />} */}
        {!isPublishModeLocation(location) && !location.pathname.includes('publish') && <DrawerText
            open={currentMenu === "Text" && !isPreviewMode && loadingPercent === 100 && isRoomLoaded}
            onClose={() => {dispatch(setCurrentMenu(""))}}
            container={container.current}
            handleDragEnd={handleDragEnd}
        />}
        {!isPublishModeLocation(location) && !location.pathname.includes('publish') && <DrawerTheme
            open={currentMenu === "Theme" && !isPreviewMode && loadingPercent === 100 && isRoomLoaded}
            onClose={() => {dispatch(setCurrentMenu(""))}}
            container={container.current}
        />}
        {!isPublishModeLocation(location) && !location.pathname.includes('publish') && <DrawerObjectList
            open={currentMenu === "Object-list" && !isPreviewMode && loadingPercent === 100 && isRoomLoaded}
            onClose={() => {dispatch(setCurrentMenu(""))}}
            container={container.current}
        />}
        {!isPublishModeLocation(location) && !location.pathname.includes('publish') && 
            <ModalUploadMultipleType
                open={isOpenModalAddProduct}
                onClose={() => {setIsOpenModalAddProduct(false)}}
                onBack={() => {setIsOpenModalAddProduct(false)}}
                defaultTab={productType === PRODUCT_TYPES.PRODUCTS ? PRODUCT_TYPES.PRODUCTS : PRODUCT_TYPES.ELEMENT}
                onSuccess={(type) => {
                    if(type === PRODUCT_TYPES.PRODUCTS){
                        productsContainer.current.reloadData();
                    } else {
                        elementsContainer.current.reloadData();
                    }
                    setIsOpenModalAddProduct(false);
                }}
            />
        }
    
    </>
}
export default EditorSidebar;