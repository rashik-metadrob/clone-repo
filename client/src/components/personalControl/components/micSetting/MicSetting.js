import { useSelector } from "react-redux"
import { useAppDispatch } from "../../../../redux"
import global from "../../../../redux/global"
import { getIsMuteAudio, setIsMuteAudio } from "../../../../redux/modelSlice"
import MicIcon from '../../../../assets/images/project/Mic.svg';
import MicMuteIcon from '../../../../assets/images/project/MicMute.png';

const MicSetting = () => {
    const dispatch = useAppDispatch()
    const isMuteAudio = useSelector(getIsMuteAudio)

    return <>
        {
            !global.IS_DROB_A &&
            <div className='setting' onClick={() => {dispatch(setIsMuteAudio())}}>
                <img src={isMuteAudio ? MicMuteIcon : MicIcon} alt='room' className='!w-[26px] !h-[26px] object-contain'/>
            </div>
        }
    </>
}
export default MicSetting