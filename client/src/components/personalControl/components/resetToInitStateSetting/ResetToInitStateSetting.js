import ResetStateIcon from '../../../../assets/images/project/initial-state.svg';
import { APP_EVENTS } from '../../../../utils/constants';
const ResetToInitStateSetting = () => {

    const onResetPlayerAvatarToInitState = () => {
        dispatchEvent(new CustomEvent(APP_EVENTS.RESET_PLAYER_AVATAR_TO_INIT_STATE, {}))
    }

    return <>
    <div className={`setting`} onClick={() => {onResetPlayerAvatarToInitState()}}>
        <img src={ResetStateIcon} alt='room' className='!w-[26px] !h-[26px] object-contain' />
      </div>
    </>
}
export default ResetToInitStateSetting