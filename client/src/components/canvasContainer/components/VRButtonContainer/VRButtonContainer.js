import { useSelector } from "react-redux"
import { getIsPreviewModel } from "../../../../redux/modelSlice"
import { useEffect, useState } from "react"
import { VRButton } from "@react-three/xr"
import {isMobile} from 'react-device-detect';
import { useLocation } from "react-router-dom";
import { isPublishModeLocation } from "../../../../utils/util";

const VRButtonContainer = ({isVRMode}) => {
    const isPreviewMode = useSelector(getIsPreviewModel)
    const [isVRSupport, setIsVRSupport] = useState(false)
    const location = useLocation();

    useEffect(() => {
        async function checkVRSupport(){
            if(navigator?.xr?.isSessionSupported){
                const rs = await navigator.xr.isSessionSupported("immersive-vr")

                if(rs){
                    setIsVRSupport(true)
                }
            }
        }

        checkVRSupport()
    }, []);


    return <>
        {isPreviewMode && !global.IS_DROB_A && isVRSupport &&
        <VRButton className={`${isVRMode ? '!z-[10000]' : '!z-[3]'} select-none ${isMobile ? `!bottom-[18px] right-[40px] !left-[unset]` : `${isPublishModeLocation(location) ? '!bottom-[140px]' : '!bottom-[80px]' }`}`}>
            {!isVRMode ? 'VR Mode' : 'Exit VR Mode'}
        </VRButton>}
    </>
}

export default VRButtonContainer