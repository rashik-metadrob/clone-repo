import { useSelector } from "react-redux"
import { useLocation, useParams } from "react-router-dom"
import { getIsPreviewModel, getStoreInfo, setStoreInfo } from "../../../../redux/modelSlice"
import { isPublishModeLocation } from "../../../../utils/util"
import { useEffect, useState } from "react"
import { USER_ROLE } from "../../../../utils/constants"
import { updateProjectById } from "../../../../api/project.api"
import { useAppDispatch } from "../../../../redux"
import { Input, notification } from "antd"
import {isMobile} from 'react-device-detect';
import InstructionIcon from "../../../../assets/images/project/instruction.svg"
import FullscreenIcon from "../../../../assets/images/project/fullscreen.svg"
import ExitFullscreenIcon from "../../../../assets/images/project/exit-fullscreen.svg"
import DrawerInstruction from "../../../drawerInstruction/DrawerInstruction"

const InstructionAndScreenContainer = ({
    container,
    onPlayOpenMenuSound,
    onPlayCloseMenuSound
}) => {
    const dispatch = useAppDispatch()
    const {id: projectId, editorRole} = useParams()
    const location = useLocation()
    const isPreviewMode = useSelector(getIsPreviewModel)
    const [projectName, setProjectName] = useState("")
    const [isShowControlBoard, setIsShowControlBoard] = useState(false)
    const storeInfo = useSelector(getStoreInfo)
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        function onFullscreenChange() {
          setIsFullscreen(Boolean(document.fullscreenElement));
        }
              
        document.addEventListener('fullscreenchange', onFullscreenChange);
      
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    useEffect(() => {
        if(storeInfo?.name){
            setProjectName(storeInfo.name)
        }
    },[storeInfo])

    useEffect(() => {
        if(isMobile) {
            onRequiredFullScreen()
        }
    }, [])

    const onUpdateProjectName = () => {
        if(editorRole === USER_ROLE.VIEW || editorRole === USER_ROLE.ADMIN){
            return
        }
        if(projectId){
            updateProjectById(projectId, {name: projectName}).then(rs => {
                dispatch(setStoreInfo(rs))
                notification.success({
                    message: "Update successfully!"
                })
            }).catch(err => {
                notification.error({
                    message: "Update fail!"
                })
            })
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

    return <>
        {!isPreviewMode && !isPublishModeLocation(location) && <div className={`project-name-container ${isMobile ? 'flex-col !gap-[12px] !right-[12px]' : 'flex-row'}`}>
            {!isMobile && <Input type='text' value={projectName} className='project-name-input' onChange={(e) => {setProjectName(e.target.value)}} onPressEnter={() => {onUpdateProjectName()}}/>}
            <img src={InstructionIcon} alt="" className='cursor-pointer' onClick={() => {setIsShowControlBoard(!isShowControlBoard)}}/>
            <div className='w-[40px] h-[40px] rounded-[8px] p-[8px] bg-[rgba(0,0,0,0.5)]'>
                <img src={isFullscreen ? ExitFullscreenIcon : FullscreenIcon} alt="" className='cursor-pointer' onClick={() => {onRequiredFullScreen()}}/>
            </div>
        </div>}
        <DrawerInstruction 
            open={isShowControlBoard && !isPreviewMode} 
            onClose={() => {setIsShowControlBoard(false)}} 
            container={container.current}
            onPlayOpenMenuSound={onPlayOpenMenuSound}
            onPlayCloseMenuSound={onPlayCloseMenuSound}
        />
    </>
}
export default InstructionAndScreenContainer