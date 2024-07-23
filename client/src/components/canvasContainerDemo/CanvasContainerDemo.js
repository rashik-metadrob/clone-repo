import { Canvas } from '@react-three/fiber'
import Room from '../canvasContainer/components/room/Room';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Input, Modal, Progress } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addListPlayer, addPlayer, getIsObjectsLoaded, getIsPreviewModel, getIsViewerMode, getStoreInfo, removePlayer, resetModelState, setBeMutedTwoWay, setCanBeJoinMultiplePlayer, setIsActiveStore, setIsLoadingCheckActiveStore, setIsObjectsLoaded, setIsPreviewModel, setIsShowNameModal, setIsStoreHasWhiteLabel, setIsViewerMode, setListCamera, setListPlayers, setListSpawnPoints, setNewprojectInfoName, setPlayerGender, setPlayerName, setSelectedObject, setStoreInfo, setUserIP } from '../../redux/modelSlice';
import ModelContainer from '../canvasContainer/components/modelContainer/ModelContainer';
import { useLocation, useParams } from 'react-router-dom';
import "./styles.scss"
import { getProjectById } from '../../api/project.api';
import { LinearToneMapping, Vector3 } from 'three';
import LoadingData from "../../assets/json/LOGO_Loader_Anim.json"
import Lottie from "lottie-react";
import nipplejs from 'nipplejs';
import CanvasControl from '../canvasContainer/components/canvasControl/CanvasControl';
import VRController from '../canvasContainer/components/VRController/VRController';
import { Controllers, XR } from '@react-three/xr';
import VRModelContainer from '../canvasContainer/components/VRController/VRModelContainer';

import {isMobile} from 'react-device-detect';
import PreviewIcon from "../../assets/images/project/preview.svg"
import PublishIcon from "../../assets/images/project/publish.svg"
import { PRODUCT_TYPES, RENDERER_CONFIG, USER_ROLE } from '../../utils/constants';
import InstructionIcon from "../../assets/images/project/instruction.svg"
import FullscreenIcon from "../../assets/images/project/fullscreen.svg"
import ExitFullscreenIcon from "../../assets/images/project/exit-fullscreen.svg"
import EditorSidebar from '../canvasContainer/components/editorSidebar/EditorSidebar';
import ModalPricingPlan from '../modalPricingPlan/ModalPricingPlan';
import PreviewControl from '../canvasContainer/components/previewControl/PreviewControl';
import _ from 'lodash';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { userApi } from '../../api/user.api';
import CustomToast from '../canvasContainer/components/customToast/CustomToast';
import { setIsShowModalMoreInfo } from '../../redux/uiSlice';
import StoreEditorOnBoardingForViewer from '../Onboarding/StoreEditorOnBoardingForViewer'
import { getStepStoreOnboardingIndexForRetailer, getStepStoreOnboardingIndexForViewer, getWaitingForAction, setStoreOnboardingRunForRetailer, setStoreOnboardingRunForViewer, setWaitingForAction } from "../../redux/joyrideSlice";
import { setShopifyCartId, getShopifyCartId } from "../../redux/shopifySlice"
import { setShopifyAmountInfo, setShopifyCart } from '../../redux/shopifySlice';
import { setCurrentMenu } from '../../redux/navbarSlice';
import { STORE_BRAND_SETUP_INFO_DEFAULT, resetStoreThemeState, setStoreBrandSetupInfo } from '../../redux/storeThemeSlice';
import DrawerInstruction from '../drawerInstruction/DrawerInstruction';
import { getSharedListDecoratives } from '../../redux/sharedSlice';
import { isPublishModeLocation } from '../../utils/util';
import InstructionAndScreenContainer from '../canvasContainer/components/instructionAndScreenContainer/InstructionAndScreenContainer';

const CanvasContainerDemo = forwardRef(({
    container
}, ref) => {
    const location = useLocation()
    const refToast = useRef()
    const isViewerMode = useSelector(getIsViewerMode)
    const [isShowModalPricing, setIsShowModalPricing] = useState(false)
    const {id: projectId, editorRole} = useParams()
    const dispatch = useDispatch()
    const [loadingPercent, setLoadingPercent] = useState(0)
    const [isRoomLoaded, setIsRoomLoaded] = useState(false)
    const [isAvatarLoaded, setIsAvatarLoaded] = useState(false)
    const isPreviewMode = useSelector(getIsPreviewModel)
    const cameraControl = useRef()
    const modelContainer = useRef()
    const [isShowControlBoard, setIsShowControlBoard] = useState(false)
    const [projectName, setProjectName] = useState("")
    const storeInfo = useSelector(getStoreInfo)
    const [isShowSpinnerViewer, setIsShowSpinnerViewer] = useState(false)
    const playerRef = useRef()
    const VRControllerRef = useRef()
    const nippleRef = useRef()
    const snapPoints = useRef([])
    const [isVRMode, setIsVRMode] = useState(false)
    const isOnboardWaitingForAction = useSelector(getWaitingForAction)
    const stepStoreOnboardingIndexForViewer = useSelector(getStepStoreOnboardingIndexForViewer);
    const stepStoreOnboardingIndexForRetailer = useSelector(getStepStoreOnboardingIndexForRetailer);
    const savedShopifyCartId = useSelector(getShopifyCartId)
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isVRSupport, setIsVRSupport] = useState(false)
    const isObjectsLoaded = useSelector(getIsObjectsLoaded)
    const sharedListDecoratives = useSelector(getSharedListDecoratives)

    useEffect(() => {
        async function checkVRSupport(){
            if(navigator?.xr?.isSessionSupported){
                const rs = await navigator.xr.isSessionSupported("immersive-vr")

                if(rs){
                    setIsVRSupport(true)
                }
            }
        }

        if(editorRole && editorRole === USER_ROLE.VIEWER){
            dispatch(setIsViewerMode(true))
        } else {
            dispatch(setIsViewerMode(false))
        }

        checkVRSupport()

        function onFullscreenChange() {
          setIsFullscreen(Boolean(document.fullscreenElement));
        }
              
        document.addEventListener('fullscreenchange', onFullscreenChange);
      
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    useEffect(() => {
        const brandSetupData = _.pick(storeInfo, ['storeThemeType', 'name', 'description', 'brandLogo', 'background', 'storeNameStyle'])
        if(!brandSetupData.storeNameStyle){
            brandSetupData.storeNameStyle = STORE_BRAND_SETUP_INFO_DEFAULT.storeNameStyle
        }
        dispatch(
            setStoreBrandSetupInfo(brandSetupData)
        )
    }, [storeInfo])

    useEffect(() => {
        return () => {
            dispatch(resetModelState())
            dispatch(resetStoreThemeState())
        }
    }, [])

    useEffect(() => {
        dispatch(setIsActiveStore(true))
        dispatch(setIsLoadingCheckActiveStore(false))
    }, [storeInfo?.createdBy])

    useEffect(() => {
        if(isPublishModeLocation(location)){
            if(isAvatarLoaded && isRoomLoaded && loadingPercent === 100){
                dispatch(setIsPreviewModel(true))
            }
        }
    },[isRoomLoaded, isAvatarLoaded, loadingPercent, location])

    useEffect(() => {
        if(loadingPercent >= 100 && isRoomLoaded){
            setTimeout(() => {
                dispatch(setStoreOnboardingRunForViewer(true))

                dispatch(setWaitingForAction(false))
                dispatch(setStoreOnboardingRunForRetailer(true))
            }, 2000);
        }
    }, [loadingPercent, isRoomLoaded])

    useEffect(() => {
        if(isMobile) {
            onRequiredFullScreen()
        }

        return () => {
            dispatch(setStoreInfo(null))
        }
    }, [])

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
        getProjectById(projectId).then(data => {
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

    useEffect(() => {
        if(storeInfo?.name){
            setProjectName(storeInfo.name)
        }
    },[storeInfo])

    const onExitPointerControl = () => {
        dispatch(setIsPreviewModel(false))
    }

    const onSelectObject = (id) => {
        dispatch(setSelectedObject(id))
    }

    const onShowSpinner = (value) => {
        if(isViewerMode){
            if(value === 1){
                setIsShowSpinnerViewer(true)
            } else {
                setIsShowSpinnerViewer(false)
            }
        }

        if(isPreviewMode && value === 0 && isOnboardWaitingForAction && stepStoreOnboardingIndexForViewer === 3){
            dispatch(setWaitingForAction(false))
            dispatch(setStoreOnboardingRunForViewer(true))
        }
        if(isPreviewMode && value === 0 && isOnboardWaitingForAction && stepStoreOnboardingIndexForRetailer === 6){
            dispatch(setWaitingForAction(false))
            dispatch(setStoreOnboardingRunForRetailer(true))
        }
    }

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
        if(modelContainer.current && (el?.type === PRODUCT_TYPES.DECORATIVES || el?.type === PRODUCT_TYPES.PRODUCTS || el?.type === PRODUCT_TYPES.ELEMENT || el?.type === PRODUCT_TYPES.TEXT)){
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

    const handlePreview = () => {
        if(isPublishModeLocation(location)){
            dispatch(setIsShowNameModal(true))
        } else {
            dispatch(setIsPreviewModel(true))
        }
    }

    const onClickProjectMode = () => {
        if(isViewerMode){
            setIsShowModalPricing(true)
        } else {
            
        }
    }
    const onUpdateProjectName = () => {
        if(editorRole === USER_ROLE.VIEW || editorRole === USER_ROLE.ADMIN){
            return
        }
    }

    const onSetUserIP = (IP) => {
        dispatch(setUserIP(IP))
    }

    const onCustomerSelectWall = (el) => {
        if(playerRef.current){
            playerRef.current.selectWall(el)
        }
    }

    const onRequiredFullScreen = () => {
        if(document.fullscreenElement){
            document.exitFullscreen()
        } else {
            try{
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen().then().catch(err => {
                        console.log('err', err)
                    });
                }
        
                if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen().then().catch(err => {
                        console.log('err', err)
                    });
                }
                
                if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen().then().catch(err => {
                        console.log('err', err)
                    });
                }
            }
            catch (err) {

            }
        }
    }

    const onSetCanBeJoinMultiplePlayer = (value) => {
        dispatch(setCanBeJoinMultiplePlayer(value))
    }

    return  <>
        <CustomToast ref={refToast}/>
        <PreviewControl 
            isPreviewMode={isPreviewMode} 
            container={container.current} 
            onSelectWall={(el) => {onCustomerSelectWall(el)}}
            onPlayOpenMenuSound={onPlayOpenMenuSound}
            onPlayCloseMenuSound={onPlayCloseMenuSound}
        />
        { (loadingPercent !== 100 || (!isAvatarLoaded && isPreviewMode)) &&
        <div className='w-full h-full absolute z-10 bg-[#FFFFFF]'>
            <Progress 
                percent={loadingPercent} 
                showInfo={false} 
                className='absolute top-[50%] left-[50%] z-10 w-[300px]' 
                strokeColor='#00F6FF'
                trailColor='#000000'
                style={{
                    transform: 'translateX(-50%) translateY(calc(-50% + 150px))'
                }}
            />
            <div 
                className='absolute top-[50%] left-[50%] z-10 text-project-name' 
                style={{
                    transform: 'translateX(-50%) translateY(95px)'
                }}
            >
                {storeInfo?.name}
            </div>
            <div 
                className='w-[300px] h-[300px] absolute top-[50%] left-[50%] z-10'
                style={{
                    transform: 'translateX(-50%) translateY(-50%)'
                }}
            >
                <Lottie animationData={LoadingData} />
            </div>
        </div>}

        <div className={`${isShowSpinnerViewer ? 'absolute' : 'hidden'} w-full h-full z-10 bg-[#FFFFFF]`}>
            <div 
                className='w-[300px] h-[300px] absolute top-[50%] left-[50%] z-10'
                style={{
                    transform: 'translateX(-50%) translateY(-50%)'
                }}
            >
                <Lottie animationData={LoadingData} />
            </div>
        </div>

        {(isPreviewMode && !isPublishModeLocation(location)) && <div className='preview-exit-panel'>
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

        <EditorSidebar 
            isPreviewMode={isPreviewMode}
            showEditorMenu={true}
            loadingPercent={loadingPercent}
            isRoomLoaded={isRoomLoaded}
            container={container}
            handleDragEnd={handleDragEnd}
            onPlayOpenMenuSound={onPlayOpenMenuSound}
            onPlayCloseMenuSound={onPlayCloseMenuSound}
        />

        <InstructionAndScreenContainer 
            container={container}
            onPlayOpenMenuSound={onPlayOpenMenuSound}
            onPlayCloseMenuSound={onPlayCloseMenuSound}
        />

        {(!isPreviewMode && !isPublishModeLocation(location)) && <div className={`project-mode-control ${isMobile ? 'flex-col !gap-[12px] !right-[12px]' : 'flex-row'}`}>
            <button id="btnPreview" className='btn-preview' onClick={() => {handlePreview()}}>
                <img src={PreviewIcon} alt="" />
                {!isMobile && "Preview"}
            </button>
            <button className='btn-preview' onClick={() => {onClickProjectMode()}}>
                <img src={PublishIcon} alt="" />
                {!isMobile && "Publish"}
            </button>
        </div>}

        <ModalPricingPlan 
            open={isShowModalPricing}
            onClose={() => {setIsShowModalPricing(false)}}
            isPublishProject={true}
        />

        <Canvas
            camera={{ 
                fov: 45,
                position: new Vector3(0, 1.5, 5),
                near: 0.05,
                far: 8000
            }}
            gl={{
                antialias: false,
                alpha: true,
                preserveDrawingBuffer: false,
                toneMappingExposure: _.get(storeInfo, 'templateToneMappingExposure', RENDERER_CONFIG.TONE_MAPPING_EXPOSURE),
                toneMapping: LinearToneMapping,
                useLegacyLights: true
            }}
            className='canvas-container'
            frameloop='demand'
            performance={{
                current: 1,
                min: 0.1,
                max: 1,
                debounce: 200,
            }}
        >
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />

            <XR
                onSessionEnd={() => {
                    onXrSessionEnd()
                }}
                onSessionStart={() => {
                    onXrSessionStart()
                }}
            >
                {/* <Suspense fallback={<CanvasLoading />}> */}
                    <VRController ref={VRControllerRef}/>
                    <Controllers />

                    <CanvasControl
                        loadingPercent={loadingPercent}
                        isPreviewMode={isPreviewMode}
                        playerRef={playerRef}
                        onExitPointerControl={onExitPointerControl}
                        onShowSpinner={onShowSpinner}
                        onPlayWalkingSound={onPlayWalkingSound}
                        onStopWalkingSound={onStopWalkingSound}
                        cameraControl={cameraControl}
                        onAvatarLoaded={() => {setIsAvatarLoaded(true)}}
                        onSetUserIP={onSetUserIP}
                        project={storeInfo}
                        onSelectObject={onSelectObject}
                        onSetCanBeJoinMultiplePlayer={onSetCanBeJoinMultiplePlayer}
                    />

                    {isVRMode && isRoomLoaded && <VRModelContainer 
                        ref={modelContainer} 
                        onSelectObject={onSelectObject}
                        onAddToCart={() => {}}
                        updateObjectsLoadedStatus={(value) => {dispatch(setIsObjectsLoaded(value))}}
                        project={storeInfo}
                    />}
                    
                    {storeInfo && <Room 
                        onLoading={(percent) => {
                            setLoadingPercent(percent)
                        }}
                        onBuildGrid={(points) => {onBuildGrid(points)}}
                        project={storeInfo}
                        onListCameras={onListCameras}
                        onListSpawnPoints={onListSpawnPoints}
                        onRoomLoaded={() => {setIsRoomLoaded(true)}}
                    />}
                {/* </Suspense> */}
            </XR>
            {!isVRMode && isRoomLoaded && <>
                <ModelContainer 
                    ref={modelContainer} 
                    container={container}
                    cameraControl={cameraControl} 
                    onSelectObject={onSelectObject}
                    onAddToCart={() => {}}
                    snapPoints={snapPoints}
                    project={storeInfo}
                    setIsShowAutoSaving={() => {}}
                    updateObjectsLoadedStatus={(value) => {dispatch(setIsObjectsLoaded(value))}}
                    onChangeIsShowModalMoreInfo={(value) => {dispatch(setIsShowModalMoreInfo(value))}}
                />
            </>}
        </Canvas>
        {(loadingPercent === 100 && isViewerMode && !isPublishModeLocation(location) && isObjectsLoaded && _.get(sharedListDecoratives, ['length'], 0) > 0) && <StoreEditorOnBoardingForViewer />}
  </>
})
export default CanvasContainerDemo;