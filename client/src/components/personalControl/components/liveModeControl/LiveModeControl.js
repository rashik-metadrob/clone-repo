import { useEffect } from "react"
import { useAppDispatch } from "../../../../redux"
import { getCanBeJoinMultiplePlayer, getInteractiveMode, setInteractiveMode } from "../../../../redux/modelSlice"
import { INTERACTIVE_MODE } from "../../../../utils/constants"
import { useSelector } from "react-redux"
import "./styles.scss"
import { notification } from "antd"
import { isMobile } from "react-device-detect"

const LiveModeControl = ({
    isPortraitMode
}) => {
    const dispatch = useAppDispatch()
    const interactiveMode = useSelector(getInteractiveMode)
    const canBeJoinMultiplePlayer = useSelector(getCanBeJoinMultiplePlayer)

    useEffect(() => {
        // dispatch(setInteractiveMode(INTERACTIVE_MODE.LIVE))
    }, [])

    const onChange = (e) => {
        if(e.target.checked){
            if(canBeJoinMultiplePlayer) {
                dispatch(setInteractiveMode(INTERACTIVE_MODE.LIVE))

                return
            } else {
                notification.warning({
                    message: "Can't enter Live Mode! Please contect the Store Owner!"
                })
            }
            
        }

        dispatch(setInteractiveMode(INTERACTIVE_MODE.INDIVIDUAL))
    }

    return <>
        <div 
            className={`
                live-mode-control-container 
                px-[clamp(5px,0.6vw,12px)] 
                py-[clamp(5px,1vh,12px)] 
                rounded-[24px] 
                absolute 
                bg-[#FFF] 
                flex 
                flex-nowrap 
                items-center 
                gap-[12px] 
                top-[-12px] 
                translate-y-[-100%] 
                ${isMobile && isPortraitMode ? 'left-[100%] translate-x-[-100%]' : 'left-[50%] translate-x-[-50%]' }
            `}
        >
            <div className="w-[9px] h-[9px] rounded-[50%]" style={{backgroundColor: interactiveMode === INTERACTIVE_MODE.INDIVIDUAL ? "#FF0000" : "#14FF00"}}></div>
            {!isMobile && <div className="font-inter text-[16px] leading-[19.36px] text-[#000] whitespace-nowrap">
                {interactiveMode === INTERACTIVE_MODE.INDIVIDUAL ? 'Go to live store' : 'Individual Mode'}
            </div>}
            <label className='checkbox-interactive-mode'>
                <input type="checkbox" checked={interactiveMode === INTERACTIVE_MODE.LIVE} onChange={(e) => {onChange(e)}}/>
                <span className='check'></span>
            </label>
        </div>
    </>
}
export default LiveModeControl