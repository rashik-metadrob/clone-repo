import { Canvas } from '@react-three/fiber'



//---
import Room from './components/room/Room';
//---

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Progress, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getIsActiveStore, getIsPreviewModel, getIsShowNameModal, getObjectsLoadedPercent, getStoreInfo, resetModelState, setAllProducts, setCanBeJoinMultiplePlayer, setIsActiveStore, setIsLoadingCheckActiveStore, setIsObjectsLoaded, setIsPreviewModel, setIsShowNameModal, setIsStoreHasWhiteLabel, setListCamera, setListPlayers, setListSpawnPoints, setNewprojectInfoName, setPlayerAvatar, setPlayerGender, setPlayerName, setSelectedObject, setStoreInfo, setUserIP } from '../../redux/modelSlice';
//debuging-----
import ModelContainer from './components/modelContainer/ModelContainer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import "./styles.scss"
import { createProjectTemplate, getProjectById } from '../../api/project.api';
import { addProductToCart, getCart, setCart } from '../../redux/orderSlice';
import { LinearToneMapping, Vector3 } from 'three';
import LoadingData from "../../assets/json/LOGO_Loader_Anim.json"
import Lottie from "lottie-react";
import nipplejs from 'nipplejs';
import CanvasControl from './components/canvasControl/CanvasControl';
import VRController from './components/VRController/VRController';
import { Controllers, XR } from '@react-three/xr';
import VRModelContainer from './components/VRController/VRModelContainer';

import { getStorageUserDetail } from '../../utils/storage';
import {isMobile} from 'react-device-detect';
import { CART_MODE, CART_TYPES, CONFIG_TEXT, CURRENCY_LIST, DEFAULT_PRODUCT, DRAWER_BAG_TABS, PRODUCT_TYPES, PROJECT_MODE, PROJECT_TYPE, RENDERER_CONFIG, TRACKING_ACTION_NAME, TRACKING_TYPE, USER_CONFIG_KEY, USER_ROLE, USER_ROUTE_PREFIX } from '../../utils/constants';
import ModalPublishProject from '../modalPublishProject/ModalPublishProject';
import EditorSidebar from './components/editorSidebar/EditorSidebar';
import CustomerPreviewInit from '../customerPreviewInit/CustomerPreviewInit';

import moment from 'moment';
import { createTracking } from '../../api/tracking.api';
import userConfigApi from '../../api/userConfig.api';
import ModalPricingPlan from '../modalPricingPlan/ModalPricingPlan';
import PreviewControl from './components/previewControl/PreviewControl';
import _ from 'lodash';
import { userApi } from '../../api/user.api';
import MusicAndDeliveryPartner from '../musicAndDeliveryPartner/MusicAndDeliveryPartner';
import ModalProjectName from '../modalProjectName/ModalProjectName';
import CustomToast from './components/customToast/CustomToast';
import { encodeUrl, getAssetsUrl, htmlDecode, isPublishModeLocation, uuidv4 } from '../../utils/util';
import { setCartMode, setDrawerBagActiveTab, setIsShowDrawerBag, setIsShowDrawerCheckout, setIsShowModalMoreInfo } from '../../redux/uiSlice';
import { getStepStoreOnboardingIndexForRetailer, getStepStoreOnboardingIndexForViewer, getWaitingForAction, setStoreOnboardingRunForRetailer, setStoreOnboardingRunForViewer, setWaitingForAction } from "../../redux/joyrideSlice";
import { getIsCompleteStoreOnboardingForRetailer, getUser  } from '../../redux/appSlice';
import { setShopifyCartId, getShopifyCartId } from "../../redux/shopifySlice"
import shopifyApi from '../../api/shopify.api';
import { getShopifyCart, setShopifyAmountInfo, setShopifyCart } from '../../redux/shopifySlice';
import StoreEditorOnBoardingForRetailer from '../Onboarding/StoreEditorOnBoardingForRetailer';
import { setCurrentMenu } from '../../redux/navbarSlice';
import { isShopifyEmbedded } from '@shopify/app-bridge/utilities';
import ModalLogin from '../modalLogin/ModalLogin';
import { STORE_BRAND_SETUP_INFO_DEFAULT, resetStoreThemeState, setStoreBrandSetupInfo } from '../../redux/storeThemeSlice';
import global from '../../redux/global';
import VRButtonContainer from './components/VRButtonContainer/VRButtonContainer';
import InstructionAndScreenContainer from './components/instructionAndScreenContainer/InstructionAndScreenContainer';
import MusicAndAudioControl from '../musicAndAudioControl/MusicAndAudioControl';
import { fetchUserPlaylist, setListAudios } from '../../redux/audioSlice';
import productApi from '../../api/product.api';
import { getIsAntialiasDesktop, getIsAntialiasMobile, getIsLoadedConfig, getPixelRatioDesktop, getPixelRatioMobile } from '../../redux/configSlice';
import useDetectDevice from '../../hook/useDetectDevice';
import ModeControlContainer from './components/modeControlContainer/ModeControlContainer';

const CanvasContainer = forwardRef(({
    container
}, ref) => {
    const location = useLocation();
    const navigate = useNavigate();
    const checkUserEnter = useRef(true);
    const refToast = useRef()
    const isCompleteStoreOnboardingForRetailer = useSelector(getIsCompleteStoreOnboardingForRetailer)
    const [isShowModalPricing, setIsShowModalPricing] = useState(false)
    const {id: projectId, editorRole} = useParams()
    const dispatch = useDispatch()
    const objectsLoadedPercent = useSelector(getObjectsLoadedPercent)
    const [loadingPercent, setLoadingPercent] = useState(0)
    const [isRoomLoaded, setIsRoomLoaded] = useState(false)
    const isPreviewMode = useSelector(getIsPreviewModel)
    const cameraControl = useRef()
    const modelContainer = useRef()
    const storeInfo = useSelector(getStoreInfo)
    const playerRef = useRef()
    const VRControllerRef = useRef()
    const nippleRef = useRef()
    const snapPoints = useRef([])
    const [isVRMode, setIsVRMode] = useState(false)
    const currentUser = getStorageUserDetail();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalProjectNameOpen, setIsModalProjectNameOpen] = useState(false);
    const isShowNameModal = useSelector(getIsShowNameModal);
    const isOnboardWaitingForAction = useSelector(getWaitingForAction)
    const stepStoreOnboardingIndexForViewer = useSelector(getStepStoreOnboardingIndexForViewer);
    const stepStoreOnboardingIndexForRetailer = useSelector(getStepStoreOnboardingIndexForRetailer);
    const savedShopifyCartId = useSelector(getShopifyCartId)
    const shopifyCartItems = useSelector(getShopifyCart)
    const user = useSelector(getUser)
    const cart = useSelector(getCart)
    const isActiveStore = useSelector(getIsActiveStore)
    const isLoadedConfig = useSelector(getIsLoadedConfig)
    const isAntialiasDesktop = useSelector(getIsAntialiasDesktop)
    const isAntialiasMobile = useSelector(getIsAntialiasMobile)
    const pixelRatioDesktop = useSelector(getPixelRatioDesktop)
    const pixelRatioMobile = useSelector(getPixelRatioMobile)

    const shouldEnableScene = useMemo(() => {
        if(isPublishModeLocation(location)){
            return isActiveStore && storeInfo?.mode === PROJECT_MODE.PUBLISH
        } else {
            return true
        }
    }, [isActiveStore, location, storeInfo])

    const [isShowModalLogin, setIsShowModalLogin] = useState(false)
    const [cachedShopifyProduct, setCachedShopifyProduct] = useState({
        product: null,
        isBuyNow: false
    })

    const {isPortraitMode} = useDetectDevice()

    const isShowKindlyMessage = useRef(false)

    const shouldAntialias = useMemo(() => {
        return (!isMobile && isAntialiasDesktop) || (isMobile && isAntialiasMobile)
    }, [isAntialiasDesktop, isAntialiasMobile])

    const pixelRatioValue = useMemo(() => {
        if(isMobile) {
            return pixelRatioMobile / 100 * window.devicePixelRatio
        } else {
            return pixelRatioDesktop / 100 * window.devicePixelRatio
        }
    }, [pixelRatioDesktop, pixelRatioMobile])

    const appLoadedPercent = useMemo(() => {
        if(isPublishModeLocation(location)) {
            return Math.min(100, Math.round(loadingPercent * 0.7 + objectsLoadedPercent * 0.3))
        } else {
            return loadingPercent
        }
    }, [objectsLoadedPercent, loadingPercent])

    useEffect(() => {
        if(!isPublishModeLocation(location) && isMobile && !isShowKindlyMessage.current) {
            isShowKindlyMessage.current = true
            notification.warning({
                message: CONFIG_TEXT.KINDLY_OPEN_THE_STORE_EDITOR_ON_YOUR_DESKTOP
            })
        }

        return () => {
            dispatch(setStoreInfo(null))
        }
    }, [])

    useEffect(() => {
        const brandSetupData = _.pick(storeInfo, ['storeThemeType', 'name', 'description', 'brandLogo', 'background', 'storeNameStyle'])
        if(!brandSetupData.storeNameStyle){
            brandSetupData.storeNameStyle = STORE_BRAND_SETUP_INFO_DEFAULT.storeNameStyle
        }
        if(_.has(brandSetupData, ['description'])){
            brandSetupData.description = htmlDecode(brandSetupData.description)
        }
        dispatch(
            setStoreBrandSetupInfo(brandSetupData)
        )
    }, [storeInfo])

    useEffect(() => {
        dispatch(fetchUserPlaylist())
        return () => {
            dispatch(setListAudios([]))
            dispatch(resetModelState())
            dispatch(resetStoreThemeState())
        }
    }, [])

    useEffect(() => {
        if(storeInfo?.createdBy) {
            if(isShopifyEmbedded()){
                dispatch(setIsLoadingCheckActiveStore(true))
                // Check is store owner installed Metadrob App in shopify
                userApi.checkIsActiveShopifyStore(storeInfo.createdBy).then(rs => {
                    dispatch(setIsActiveStore(!!rs?.result))
                    dispatch(setIsLoadingCheckActiveStore(false))
                }).catch(err => {
                    notification.error({
                        message: _.get(err, ['response', 'data', 'message'], `Can't get Store data!`)
                    })
                    dispatch(setIsActiveStore(false))
                    dispatch(setIsLoadingCheckActiveStore(false))
                })
            } else {
                dispatch(setIsActiveStore(true))
                dispatch(setIsLoadingCheckActiveStore(false)) 
            }
            
            userApi.checkHasWhiteLabel(storeInfo.createdBy).then(rs => {
                dispatch(setIsStoreHasWhiteLabel(!!rs?.result))
            }).catch(err => {
                dispatch(setIsStoreHasWhiteLabel(false))
            })

            productApi.getAllProducts().then(rs => {
                dispatch(setAllProducts(rs))
            }).catch(err => {
                dispatch(setAllProducts([]))
            })

        } else {
            dispatch(setIsActiveStore(true))
            dispatch(setIsLoadingCheckActiveStore(false))
        }


    }, [storeInfo?.createdBy])

      // Customer mode
    useEffect(() => {
        if(user?.id && isPublishModeLocation(location)){
            userApi.getUserShopifyCartIdById(user.id).then(data => {
                dispatch(setShopifyCartId(_.get(data, ['shopifyCartId'], '')))
            })
        }
    }, [user, isPublishModeLocation(location)])

    useEffect(() => {
        if(user?.id && isPublishModeLocation(location) && savedShopifyCartId){
            shopifyApi.getShopifyCartByStoreFrontAPI(savedShopifyCartId, projectId).then(data => {
                setShopifyCartInfo(_.get(data, "cart", null))
            }).catch(err => {
                if(_.get(err, ['response', 'status'], 400) !== 401){
                    userApi.updateLoggedInUser({shopifyCartId: ""})
                    dispatch(setShopifyCartId(""))
                }
            })
        }
    }, [user, location, savedShopifyCartId])

    useEffect(() => {
        if(isPublishModeLocation(location)){
            if(isRoomLoaded && appLoadedPercent === 100){
                dispatch(setIsPreviewModel(true))
            }
        }
    },[isRoomLoaded, appLoadedPercent, location])

    useEffect(() => {
        if(appLoadedPercent >= 100 && isRoomLoaded){
            setTimeout(() => {
                dispatch(setStoreOnboardingRunForViewer(true))

                dispatch(setWaitingForAction(false))
                dispatch(setStoreOnboardingRunForRetailer(true))
            }, 2000);
        }
    }, [appLoadedPercent, isRoomLoaded])

    useImperativeHandle(ref, () => ({
        selectWall: (el) => {
            if(cameraControl.current){
                cameraControl.current.selectWall(el)
            }
        },
        handleDragEnd: (e, el) => {
            modelContainer.current.handleDragEnd(e, el)
        }
    }));

    useEffect(() => {
        getProjectById(projectId, isPublishModeLocation(location)).then(data => {
            if(location.pathname.includes('publish') && checkUserEnter.current){
                checkUserEnter.current = false;
                const body = {
                    userId: data.createdBy
                }
                userConfigApi.userEnterRoom(body).then(rs => {
                    if(!rs.result){
                        notification.info({
                            message: CONFIG_TEXT.NUM_OF_VISITS_IS_OUT
                        })
                
                        window.isRequiredTracking = false;
                        navigate("/")
                    }
                })
            }
            dispatch(setStoreInfo(data))
        }).catch(err => {

        })
    }, [projectId])

    useEffect(() => {
        if(isPreviewMode){
            onShowSpinner(1)
        } else {
            onShowSpinner(0)
        }
    }, [isPreviewMode])

    const onExitPointerControl = () => {
        dispatch(setIsPreviewModel(false))
    }

    const onSelectObject = (id) => {
        dispatch(setSelectedObject(id))
    }

    const onShowSpinner = (value) => {
        if(isPreviewMode && value === 0 && isOnboardWaitingForAction && stepStoreOnboardingIndexForViewer === 3){
            dispatch(setWaitingForAction(false))
            dispatch(setStoreOnboardingRunForViewer(true))
        }
        if(isPreviewMode && value === 0 && isOnboardWaitingForAction && stepStoreOnboardingIndexForRetailer === 6){
            dispatch(setWaitingForAction(false))
            dispatch(setStoreOnboardingRunForRetailer(true))
        }
    }

    // Set list camera to store
    const onListCameras = (value) => {
        dispatch(setListCamera(value))
    }

    const onListSpawnPoints = (value) => {
        dispatch(setListSpawnPoints(value))
    }

    const setShopifyCartInfo = (shopifyCart) => {
        if(!shopifyCart){
            dispatch(setShopifyCart([]))
            dispatch(setShopifyAmountInfo(null))
            return
        }
        const shopifyCartId = _.get(shopifyCart, "id", "")
        const shopifyCartItems = _.get(shopifyCart, ["lines", "edges"], []).map(el => el.node)
        const shopifyCartTotalCost = _.get(shopifyCart, ["cost", "totalAmount"], null)

        dispatch(setShopifyCart(
                shopifyCartItems.map(el => {
                    return {
                        ...el,
                        quantity: _.get(el, ['quantity'], 1)
                    }
                })
            )
        )
        dispatch(setShopifyAmountInfo(shopifyCartTotalCost))

        if(!savedShopifyCartId){
            userApi.updateLoggedInUser({shopifyCartId: shopifyCartId})
            dispatch(setShopifyCartId(shopifyCartId))
        }
    }

    const onLoginSuccessWithEmail = () => {
        setIsShowModalLogin(false)
        if(cachedShopifyProduct?.product){
            onAddToCart(cachedShopifyProduct.product, cachedShopifyProduct.isBuyNow)
        }
    }

    const onPlayAddToCartSound = () => {
        if(modelContainer.current){
            modelContainer.current.playAddToCartSound()
        }
    }

    const onPlayOpenMenuSound = () => {
        if(modelContainer.current){
            modelContainer.current.playOpenMenuSound()
        }
    }

    const onPlayCloseMenuSound = () => {
        if(modelContainer.current){
            modelContainer.current.playCloseMenuSound()
        }
    }

    const onAddToCart = (product, isBuyNow = false) => {
        onPlayAddToCartSound()
        let cartProduct = {
            id: product.objectId,
            image: product.image,
            description: product.description,
            discount: product.discount,
            lastPrice: product.lastPrice,
            name: product.name,
            url: product.url,
            price: product.price,
            type: product.type,
            typeText: product.typeText,
            quantity: 1,
            dimensions: product.dimensions || DEFAULT_PRODUCT.DIMENSIONS,
            actualWeight: product.actualWeight || DEFAULT_PRODUCT.ACTUALWEIGHT,
            storeId: projectId,
            displayCurrency: _.get(product, ['displayCurrency'], CURRENCY_LIST[0].code)
        }

        let traking = {
            trackingContainerId: product.objectId,
            type: TRACKING_TYPE.PRODUCT,
            track: {
                actionName: TRACKING_ACTION_NAME.ADD_TO_CART,
                actionTime: moment().toString(),
                actionValue: 1,
                actionTrackingId: product.objectId,
                actionUnit: "time"
            }
        }
        createTracking(traking).then(rs => {
        })
        if( 
            _.get(product, ['cartType'], CART_TYPES.METADROB_CART) == CART_TYPES.SHOPIFY_CART
            || (
                !product.cartType
                && product.useThirdPartyCheckout
            )
        ){
            // //TODO: Check this logic
            const storageUser = getStorageUserDetail()
            if(!storageUser?.id){
                notification.warning({
                    message: "Please log in before add Shopify item to Shopify Cart!"
                })

                setCachedShopifyProduct({
                    product: product,
                    isBuyNow
                })
                setIsShowModalLogin(true)
                return
            }
            if(!product.shopifyVariantMerchandiseId){
                notification.warning({
                    message: "Can't add this product to Shopify Cart!"
                })
                return
            }
            if(!savedShopifyCartId){
                // Add to shopify cart
                shopifyApi.createShopifyCartByStoreFrontAPI({products: [{quantity: 1, merchandiseId: product.shopifyVariantMerchandiseId}]}, projectId).then(data => {
                    setShopifyCartInfo(_.get(data, ["cartCreate", "cart"], null))
                    showAddProductToast(cartProduct)
                    if(isBuyNow){
                        onShopifyCheckout()
                    } else {
                        dispatch(setIsShowDrawerBag(true))
                    }
                }).catch(err => {
                    notification.error({
                        message: _.get(err, ['response', 'data', 'message'], `Can't create Shopify Cart!`)
                    })
                })
            } else {
                // Add or create
                const savedItem = shopifyCartItems.find(el => _.get(el, ["merchandise", "id"], "") === product.shopifyVariantMerchandiseId)
                if(savedItem){
                    // Update
                    const data = {
                        product: {
                            lineId: savedItem.id,
                            quantity: _.get(savedItem, "quantity", 0) + 1
                        }
                    }
                    shopifyApi.updateShopifyCartItemsByStoreFrontAPI(savedShopifyCartId, data, projectId).then(data => {
                        setShopifyCartInfo(_.get(data, ["cartLinesUpdate", "cart"], null))
                        showAddProductToast(cartProduct)
                        if(isBuyNow){
                            onShopifyCheckout()
                        } else {
                            dispatch(setIsShowDrawerBag(true))
                        }
                    }).catch(err => {
                        notification.error({
                            message: _.get(err, ['response', 'data', 'message'], `Can't update quantity!`)
                        })
                    })
                } else {
                    // Add
                    const data = {
                        product: {
                            merchandiseId: product.shopifyVariantMerchandiseId,
                            quantity: 1
                        }
                    }
                    shopifyApi.addShopifyCartItemsByStoreFrontAPI(savedShopifyCartId, data, projectId).then(data => {
                        setShopifyCartInfo(_.get(data, ["cartLinesAdd", "cart"], null))
                        showAddProductToast(cartProduct)
                        if(isBuyNow){
                            onShopifyCheckout()
                        } else {
                            dispatch(setIsShowDrawerBag(true))
                        }
                    }).catch(err => {
                        notification.error({
                            message: _.get(err, ['response', 'data', 'message'], `Can't add product to Shopify Cart!`)
                        })
                    })
                }
            }
        } else {
            dispatch(addProductToCart(cartProduct))
            showAddProductToast(cartProduct)
            if(isBuyNow){
                dispatch(setIsShowDrawerCheckout(true))
            }
        }
    }

    const onShopifyCheckout = () => {
        // No need check
        // if(!savedShopifyCartId || +_.get(shopifyCatyAmountInfo, "amount", 0) === 0){
        //     notification.warning({
        //         "message": "Can't checkput with shopify cart!"
        //     })
        //     return
        // }
        const currentUser = getStorageUserDetail();
        if(currentUser?.id){
            shopifyApi.getCheckoutUrlByStoreFrontAPI(savedShopifyCartId, projectId).then(data => {
                const checkOutUrl = _.get(data, ["cart", "checkoutUrl"], "")
                if(checkOutUrl){
                    console.log("redirect to checkout")
                    const a = document.createElement("a")
                    a.href = checkOutUrl
                    a.target = "_blank"
                    a.click()
                } else {
                    notification.error({
                        message: _.get(`Can't checkout Shopify Cart!`)
                    })
                }
            }).catch(err => {
                notification.error({
                    message: _.get(err, ['response', 'data', 'message'], `Can't checkout Shopify Cart!`)
                })
            })
        } else {
            navigate(`/register?returnUrl=${encodeUrl(window.location.href)}`)
        }
    }

    const handleAddProductToCart = (product, isBuyNow = false) => {
        if(_.get(product, ['cartType'], CART_TYPES.METADROB_CART) == CART_TYPES.WEB_LINK) {
            if(isBuyNow && _.get(product, ['webLink'], "")){
                const a = document.createElement("a")
                a.href = _.get(product, ['webLink'], "")
                a.target = "_blank"
                a.click()
            }

            return
        }
        if(global.IS_DROB_A){
            notification.warning({
                message: "Can't add this Product to Cart on Drob A Version!"
            })
            return
        }
        if(
            _.get(product, ['cartType'], CART_TYPES.METADROB_CART) == CART_TYPES.SHOPIFY_CART
            || (
                !product.cartType
                && product.useThirdPartyCheckout
            )
        ) {
            removeAllItemsInMetadrobCart()
            onAddToCart(product, isBuyNow)
            dispatch(setDrawerBagActiveTab(DRAWER_BAG_TABS.MY_SHOPIFY_ORDERS))
            dispatch(setCartMode(CART_MODE.SHOPIFY))
        } else {
            removeAllItemsInShopifyCart()
            onAddToCart(product, isBuyNow)
            dispatch(setDrawerBagActiveTab(DRAWER_BAG_TABS.MY_ORDERS))
            dispatch(setCartMode(CART_MODE.METADROD))
        }
    }

    const removeAllItemsInMetadrobCart = () => {
        if(cart.length > 0){
            dispatch(setCart([]))
            refToast.current.notification({
                id: uuidv4(),
                content: <span className="normal-text">This will replace your earlier items</span>,
                actionText: "Close",
                type: "Close",
            })
        }
    }

    const removeAllItemsInShopifyCart = () => {
        const lineIds = shopifyCartItems.map(el => el.id)
        if(lineIds.length > 0){
            refToast.current.notification({
                id: uuidv4(),
                content: <span className="normal-text">This will replace your earlier items</span>,
                actionText: "Close",
                type: "Close",
            })
            const data = {
                lineIds
            }
            shopifyApi.removeShopifyCartItemsByStoreFrontAPI(savedShopifyCartId, data, projectId).then(data => {
                setShopifyCartInfo(_.get(data, ["cartLinesRemove", "cart"], null))
            }).catch(err => {
                notification.error({
                    message: _.get(err, ['response', 'data', 'message'], `Can't remove Shopify cart!`)
                })
            })
        }
    }

    const showAddProductToast = (cartProduct) => {
        refToast.current.notification({
            id: uuidv4(),
            image: getAssetsUrl(cartProduct.image),
            content: <span className="normal-text"><span className="bold-text">{cartProduct.name}</span> has been added to the cart</span>,
            actionText: "View now",
            type: "Product",
            buttonAction: () => {dispatch(setIsShowDrawerBag(true))}
        })
    }

    const onPlayWalkingSound = () => {
        if(modelContainer.current){
            modelContainer.current.playWalkingSound()
        }
    }

    const onStopWalkingSound = () => {
        if(modelContainer.current){
            modelContainer.current.stopWalkingSound()
        }
    }

    const nippleMove = useCallback((e, stick) => {
        let keyA = false;
        let keyD = false;
        let keyW = false;
        let keyS = false;

        if(stick.vector.x <= -0.2) {
            keyA = true
        }
        else if(stick.vector.x >= 0.2) {
            keyD = true
        }

        if(stick.vector.y <= -0.2) {
            keyS = true
        }
        else if(stick.vector.y >= 0.2) {
            keyW = true
        }

        if(isPreviewMode) {
            if(playerRef.current && playerRef.current.onMove) {
                playerRef.current.onMove(
                    keyW,
                    keyS,
                    keyA,
                    keyD
                )
            }
        }
        else {
            if(cameraControl.current && cameraControl.current.onMove) {
                cameraControl.current.onMove(
                    keyW,
                    keyS,
                    keyA,
                    keyD
                )
            }
        }
    }, [isPreviewMode])

    const nippleEndMove = useCallback(() => {
        if(isPreviewMode) {
            if(playerRef.current && playerRef.current.onEndMove) {
                playerRef.current.onEndMove()
            }  
        }
        else {
            if(cameraControl.current && cameraControl.current.onEndMove) {
                cameraControl.current.onEndMove()
            }  
        }
        
    }, [isPreviewMode])

    useEffect(() => {
        if(isMobile){
            const nippleContainer = document.getElementById("nippleContainerId");

            if(nippleRef.current){
                nippleRef.current.destroy()
            }

            if(nippleContainer) {
                nippleRef.current = nipplejs.create({
                    size: 100,
                    zone: nippleContainer,
                    mode: 'static',
                    position: {left: '50%', top: '50%'},
                    color: 'white',
                });
                nippleRef.current.on("move", nippleMove)
                nippleRef.current.on("end", nippleEndMove)
            } else {
                nippleRef.current.on("move", nippleMove)
                nippleRef.current.on("end", nippleEndMove)
            }
        }
        

        return () => {
            const nippleContainer = document.getElementById("nippleContainerId");
            if(nippleContainer && isMobile && nippleRef.current){
                nippleRef.current.off("move", nippleMove)
                nippleRef.current.off("end", nippleEndMove)
            }
        }
    }, [nippleEndMove, nippleMove, isPreviewMode])

    const onXrSessionEnd = () => {
        setIsVRMode(false)
        if(VRControllerRef.current){
            VRControllerRef.current.onEndSection()
        }
    }

    const onXrSessionStart = () => {
        setIsVRMode(true)
        if(VRControllerRef.current){
            VRControllerRef.current.onStartSection()
        }
    }

    const onBuildGrid = (points) => {
        snapPoints.current = points
    }

    const handleDragEnd = (e, el) => {
        if(modelContainer.current && (el?.type === PRODUCT_TYPES.DECORATIVES || el?.type === PRODUCT_TYPES.PRODUCTS || el?.type === PRODUCT_TYPES.ELEMENT || el?.type === PRODUCT_TYPES.TEXT || el?.type === PRODUCT_TYPES.PLACEHOLDER)){
            modelContainer.current.handleDragEnd(e, el)
        }

        if(isOnboardWaitingForAction && stepStoreOnboardingIndexForViewer === 2){
            setTimeout(() => {
                dispatch(setWaitingForAction(false))
                dispatch(setStoreOnboardingRunForViewer(true))
            }, 2000);
        }

        // Open drawer products
        if(isOnboardWaitingForAction && (
            //Drag decor
            stepStoreOnboardingIndexForRetailer === 2
            // Drag prod
            || stepStoreOnboardingIndexForRetailer === 5
        )){
            dispatch(setCurrentMenu('Products'))
            setTimeout(() => {
                dispatch(setWaitingForAction(false))
                dispatch(setStoreOnboardingRunForRetailer(true))
            }, 2000);
        }
    }

    const onSetUserIP = (IP) => {
        dispatch(setUserIP(IP))
    }

    const onStartPreview = (cname, cplayerAvatar) => {
        dispatch(setPlayerName(cname))
        dispatch(setPlayerAvatar(cplayerAvatar))
        dispatch(setIsShowNameModal(false))
    }

    const handleSaveAsTemplate = (templateName) => {
        if(!templateName){
            notification.warning({
                message: "Project name is required!"
            })
            return
        }
        setIsModalProjectNameOpen(false)
        dispatch(setNewprojectInfoName(templateName))

        let listProducts = modelContainer.current.getListProducts()
        const listTexts = modelContainer.current.getListTexts()

        // Filter except product, only keep decor and orther element
        listProducts = listProducts.filter( el => !_.has(el, ['type']) || el.type !== PRODUCT_TYPES.PRODUCTS)

        let data = {
            ...storeInfo,
            name: templateName,
            listProducts: listProducts,
            listTexts: listTexts,
            mode: PROJECT_MODE.UNSAVED,
            type: PROJECT_TYPE.TEMPLATE,
            isBlank: false,
            isLock: false,
            createdBy: currentUser?.id,
            shouldNotCompress: true,
        }
        delete data.createdAt
        delete data.updatedAt

        createProjectTemplate(data).then(async data => {
            if(data.id){
                // We don't check num of created store in month because only super admin can create template from here
                // const body = {
                //     userId: data.createdBy,
                //     key: USER_CONFIG_KEY.NUM_OF_DRAFT_STORE_IN_MONTH
                // }
                // await userConfigApi.userCreateStore(body);
                notification.success({
                    message: "Template created successfully!"
                })
            }
        }).catch(err => {
            notification.error({
                message: "Failed to create template!"
            })
        })
    }

    const onCustomerSelectWall = (el) => {
        if(playerRef.current){
            playerRef.current.selectWall(el)
        }
    }

    const onSetCanBeJoinMultiplePlayer = (value) => {
        dispatch(setCanBeJoinMultiplePlayer(value))
    }
    return  <>
        <CustomToast ref={refToast}/>
        <PreviewControl 
            container={container.current} 
            onSelectWall={(el) => {onCustomerSelectWall(el)}}
            onPlayOpenMenuSound={onPlayOpenMenuSound}
            onPlayCloseMenuSound={onPlayCloseMenuSound}
        />
        {
            isShowNameModal && 
            <CustomerPreviewInit 
                loadingPercent={appLoadedPercent}
                onPreview={(cname, cplayerAvatar) => {
                    onStartPreview(cname, cplayerAvatar)
                }}
            />
        }
        { !isPublishModeLocation(location) &&
            <div className={`w-[100vw] h-[100vh] absolute z-10 editor-mode-loading-screen-wrapper`}>
                <div className={`bg-[#FFFFFF] w-[100vw] h-[100vh] editor-mode-loading-screen ${appLoadedPercent === 100 ? 'loading-screen-animation' : ''}`}>
                    <video 
                        src={`${process.env.REACT_APP_HOMEPAGE}/videos/editor-loading-screen.mp4`}
                        muted
                        autoPlay
                        loop
                        className="background-image"
                    />
                    
                    <div 
                        className='absolute bottom-[10%] left-[50%] z-10'
                        style={{
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <div className='text-project-name'>
                            {storeInfo?.name}
                        </div>
                        {
                            storeInfo?.description && <>
                                <div className='relative flex justify-center'>
                                    <div className='text-project-description' dangerouslySetInnerHTML={{__html: htmlDecode(storeInfo?.description)}}>
                                    </div>
                                </div>
                            </>
                        }
                        <div className='relative flex justify-center'>
                            <div className='relative w-fit'>
                                <div className='loading-screen-progress-tooltip' style={{ "--persent": `${appLoadedPercent}%`}}>
                                    {_.round(appLoadedPercent, 0)} %
                                </div>
                                <Progress 
                                    percent={appLoadedPercent} 
                                    showInfo={false} 
                                    className={'w-[350px] mt-[50px] loading-screen-progress'}
                                    strokeColor='#16F6FE'
                                    trailColor='#000000'
                                    strokeLinecap="round"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

        {(isPreviewMode && !isPublishModeLocation(location)) && 
        <div className={`preview-exit-panel ${isMobile ? 'mobile' : 'desktop'} ${isPortraitMode ? "portrait" : "landscape"}`}>
            <button className="btn-exit-preview-mode"  onClick={onExitPointerControl}>
                EXIT
            </button>
            <span>
                or press ESCAPE
            </span>
        </div>}
        {
            isMobile && <div id='nippleContainerId' className={`nipple-wrapper ${isPreviewMode ? '!left-[20px] !bottom-[20px]' : '!left-[85px] !bottom-[20px]'}`} />
        }
        
        <VRButtonContainer isVRMode={isVRMode}/>

        <EditorSidebar 
            loadingPercent={appLoadedPercent}
            isRoomLoaded={isRoomLoaded}
            container={container}
            handleDragEnd={handleDragEnd}
            onPlayOpenMenuSound={onPlayOpenMenuSound}
            onPlayCloseMenuSound={onPlayCloseMenuSound}
        />

        <ModalPublishProject
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            projectId={projectId}
        />

        <InstructionAndScreenContainer 
            container={container}
            onPlayOpenMenuSound={onPlayOpenMenuSound}
            onPlayCloseMenuSound={onPlayCloseMenuSound}
        />

        {(!isPreviewMode && !isPublishModeLocation(location) && editorRole === USER_ROLE.ADMIN) && <div className='project-mode-control-higher'>
            <button className='btn-preview' onClick={() => {setIsModalProjectNameOpen(true)}}>
                Save as Template
            </button>
        </div>}

        <ModalProjectName
            open={isModalProjectNameOpen}
            onClose={() => {setIsModalProjectNameOpen(false)}}
            onOk={(value) => {handleSaveAsTemplate(value)}}
            title="Template name"
            placeholder="Enter TEMPLATE NAME"
        />

        <ModeControlContainer 
            setIsModalOpen={setIsModalOpen}
            setIsShowModalPricing={setIsShowModalPricing}
        />

        {
            (!isPreviewMode && !isPublishModeLocation(location)) && <MusicAndDeliveryPartner />
        }
        <MusicAndAudioControl />

        <ModalPricingPlan 
            open={isShowModalPricing}
            onClose={() => {setIsShowModalPricing(false)}}
            isPublishProject={true}
        />

        <ModalLogin 
            open={isShowModalLogin}
            onClose={() => {setIsShowModalLogin(false)}}
            onSuccess={onLoginSuccessWithEmail}
            loginTitle="Login to Store"
            loginSubTitle="This is your login Panel. Enter Your Login Credentials to enter store"
        />

        <Canvas
            camera={{ 
                fov: 45,
                position: new Vector3(0, 1.5, 5),
                near: 0.05,
                far: 8000
            }}
            gl={{
                antialias: shouldAntialias,
                alpha: true,
                preserveDrawingBuffer: false,
                toneMappingExposure: _.get(storeInfo, 'templateToneMappingExposure', RENDERER_CONFIG.TONE_MAPPING_EXPOSURE),
                toneMapping: LinearToneMapping,
                useLegacyLights: true
            }}
            className='canvas-container'
            frameloop='always'
            dpr={pixelRatioValue}
        >
            {/* <AdaptiveDpr pixelated />
            <AdaptiveEvents /> */}
            {/* <Stats /> */}

            {shouldEnableScene && <XR
                onSessionEnd={() => {
                    onXrSessionEnd()
                }}
                onSessionStart={() => {
                    onXrSessionStart()
                }}
            >
                <VRController ref={VRControllerRef}/>
                <Controllers />

                <CanvasControl
                    loadingPercent={appLoadedPercent}
                    isPreviewMode={isPreviewMode}
                    playerRef={playerRef}
                    onExitPointerControl={onExitPointerControl}
                    onShowSpinner={onShowSpinner}
                    onPlayWalkingSound={onPlayWalkingSound}
                    onStopWalkingSound={onStopWalkingSound}
                    cameraControl={cameraControl}
                    onSetUserIP={onSetUserIP}
                    project={storeInfo}
                    onSelectObject={onSelectObject}
                    onSetCanBeJoinMultiplePlayer={onSetCanBeJoinMultiplePlayer}
                />

                {isVRMode && isRoomLoaded && <VRModelContainer 
                    ref={modelContainer} 
                    onSelectObject={onSelectObject}
                    onAddToCart={handleAddProductToCart}
                    updateObjectsLoadedStatus={(value) => {dispatch(setIsObjectsLoaded(value))}}
                />}

                {/* <OrbitControls /> */}
                
                {storeInfo && isLoadedConfig && <Room 
                    onLoading={(percent) => {
                        setLoadingPercent(percent)
                    }}
                    onBuildGrid={(points) => {onBuildGrid(points)}}
                    project={storeInfo}
                    onListCameras={onListCameras}
                    onListSpawnPoints={onListSpawnPoints}
                    onRoomLoaded={() => {setIsRoomLoaded(true)}}
                />}
            </XR>}
            {shouldEnableScene && !isVRMode && isRoomLoaded && <>
                <ModelContainer 
                    ref={modelContainer} 
                    container={container}
                    cameraControl={cameraControl} 
                    onSelectObject={onSelectObject}
                    onAddToCart={handleAddProductToCart}
                    snapPoints={snapPoints}
                    onChangeIsShowModalMoreInfo={(value) => {dispatch(setIsShowModalMoreInfo(value))}}
                />
            </>}
        </Canvas>
        {(appLoadedPercent === 100 && !isCompleteStoreOnboardingForRetailer && !isPublishModeLocation(location) && !isMobile) && <StoreEditorOnBoardingForRetailer />}
  </>
})
export default React.memo(CanvasContainer);