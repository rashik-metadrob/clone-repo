import { Layout, notification } from "antd";
import "./styles.scss"

import { useEffect, useRef, useState } from "react";
import CanvasContainer from "../../components/canvasContainer/CanvasContainer";
import SelectWallCarousel from "../../components/selectWallCarousel/SelectWallCarousel";
import { useDispatch, useSelector } from "react-redux";
import { getIsPreviewModel, getPlayerName, setIsShowNameModal } from "../../redux/modelSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment"
import { createTracking } from "../../api/tracking.api";
import { CONFIG_TEXT, PUBLISH_ROLE, TRACKING_ACTION_NAME, TRACKING_TYPE, USER_ROLE } from "../../utils/constants";
import { setIsHiddenPreview } from "../../redux/appSlice";
import { getStorageUserDetail } from "../../utils/storage";
import { socket } from "../../socket/socket";
import { getIsShowDrawerCheckout } from "../../redux/uiSlice";
import { isPublishModeLocation } from "../../utils/util";
import usePublishStoreRole from "../../hook/usePublishStoreRole";
import Chatbot from "../../components/chatbot/Chatbot";

const { Content } = Layout;
const Project = () => {
    const navigate = useNavigate()
    const container = useRef()
    const dispatch = useDispatch();
    const isPreviewMode = useSelector(getIsPreviewModel)
    
    const canvasContainerRef = useRef();
    window.container = container.current
    console.log( window.container ,"WINDOW CONTAINERRR")
    //---------
    const {id: projectId, editorRole} = useParams()
    const { publishRole } = usePublishStoreRole()
    const currentUser = getStorageUserDetail();


    
    const timestampCounter = useRef()
    let location = useLocation();
    const playerName = useSelector(getPlayerName)
    const isShowDrawerCheckout = useSelector(getIsShowDrawerCheckout)
    const shouldCountEnterRoom = useRef(true)





    useEffect(() => {
        dispatch(setIsHiddenPreview(false))
    },[])

    useEffect(() => {
        if(!playerName && isPublishModeLocation(location)){
            dispatch(setIsShowNameModal(true))
        }
    }, [playerName, location])




    useEffect(() => {
        window.isRequiredTracking = true;
        const handleTabClose = event => {
            if(!window.isRequiredTracking){
                return
            }
            event.preventDefault();

            if(location.pathname.includes('publish')){
                // Issue 4.8
                if(socket.connected){
                    socket.disconnect()
                }
                trackingStayInStore()
            } else {
                trackingStayToBuildStore()
            }
      
            return (event.returnValue =
              'Are you sure you want to exit?');
        };
      
        if(location.pathname.includes('publish') && !isShowDrawerCheckout){
            window.addEventListener('beforeunload', handleTabClose);
        }
    
        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, [isShowDrawerCheckout])

    useEffect(() => {
        if(isShowDrawerCheckout){
            trackingStayInStore()
        }
    }, [isShowDrawerCheckout])

    useEffect(() => {
        if(shouldCountEnterRoom.current){
            shouldCountEnterRoom.current = false;
            trackingUserEnterStore()
        }
        timestampCounter.current = moment()
        return () => {
            if(location.pathname.includes('publish')){
                trackingStayInStore()
            } else {
                trackingStayToBuildStore()
            }
        }
    },[])

    useEffect(() => {
        if(isPublishModeLocation(location)){
            // Check role difference customer and sale
            if(publishRole !== PUBLISH_ROLE.CUSTOMER && publishRole !== PUBLISH_ROLE.SALE){
                navigate("/404")
            }
        } else {
            // Edit mode, only 2 role admin and retailers, check if user login isn't equal editorRole => kick
            if(editorRole && editorRole === USER_ROLE.ADMIN && currentUser?.role !== USER_ROLE.ADMIN){
                notification.error({
                    message: CONFIG_TEXT.USER_DONT_HAVE_PERMISSION_TO_EDIT_THIS_STORE
                })
                navigate("/")
            }
        }
    }, [location])

    const trackingStayInStore = () => {
        const stateValue = moment().diff(timestampCounter.current, 'seconds')
        if(stateValue === 0){
            return
        }
        let traking = {
            trackingContainerId: projectId,
            type: TRACKING_TYPE.STORE,
            track: {
                actionName: TRACKING_ACTION_NAME.STAY_IN_STORE,
                actionTime: moment().toString(),
                actionValue: stateValue,
                actionTrackingId: projectId,
                actionUnit: "second"
            }
        }
        createTracking(traking).then(rs => {
            timestampCounter.current = moment()
        })
    }

    const trackingStayToBuildStore = () => {
        const stateValue = moment().diff(timestampCounter.current, 'seconds')
        if(stateValue === 0){
            return
        }
        let traking = {
            trackingContainerId: projectId,
            type: TRACKING_TYPE.STORE,
            track: {
                actionName: TRACKING_ACTION_NAME.STAY_TO_BUILD_STORE,
                actionTime: moment().toString(),
                actionValue: stateValue,
                actionTrackingId: projectId,
                actionUnit: "second"
            }
        }
        createTracking(traking).then(rs => {
            timestampCounter.current = moment()
        })
    }

    // const trackingWhenOutStore = () => {
    //     if(!currentUser?.id){
    //         return
    //     }
    //     const stateValue = moment().diff(timestampCounter.current, 'seconds')
    //     if(stateValue === 0){
    //         return
    //     }
    //     let traking = {
    //         trackingContainerId: projectId,
    //         type: TRACKING_TYPE.STORE,
    //         tracks: [
    //             {
    //                 actionName: TRACKING_ACTION_NAME.USER_ENTER_STORE,
    //                 actionTime: moment().toString(),
    //                 actionValue: 1,
    //                 actionTrackingId: currentUser.id,
    //                 actionUnit: "time"
    //             },
    //             {
    //                 actionName: TRACKING_ACTION_NAME.STAY_IN_STORE,
    //                 actionTime: moment().toString(),
    //                 actionValue: stateValue,
    //                 actionTrackingId: projectId,
    //                 actionUnit: "second"
    //             }
    //         ]
    //     }
    //     createTracking(traking).then(rs => {
    //         timestampCounter.current = moment()
    //     })
    // }

    const trackingUserEnterStore = () => {
        if(!currentUser?.id){
            return
        }
        let traking = {
            trackingContainerId: projectId,
            type: TRACKING_TYPE.STORE,
            track: {
                actionName: TRACKING_ACTION_NAME.USER_ENTER_STORE,
                actionTime: moment().toString(),
                actionValue: 1,
                actionTrackingId: currentUser.id,
                actionUnit: "time"
            }
        }
        createTracking(traking)
    }

    const onSelectWall = (el) => {
        canvasContainerRef.current.selectWall(el)
    }

    return <>
        <Layout className="project-layout relative h-full" id='projectLayout' ref={container}>
            <Content className="flex">
                {isPublishModeLocation(location) && <Chatbot />}
                {!isPreviewMode && <SelectWallCarousel onSelectWall={onSelectWall}/>}
                <CanvasContainer ref={canvasContainerRef} container={container}/>
             
            </Content>
        </Layout>
    </>
}
export default Project;