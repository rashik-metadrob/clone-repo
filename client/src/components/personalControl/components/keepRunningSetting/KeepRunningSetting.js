import { useKeepRunningAction } from "../../../../hook/keepRunningAction"
import KeepRunningIcon from '../../../../assets/images/project/keep-run.png';

const KeepRunningSetting = () => {
    const { isRunning, onChangeKeepRunning } = useKeepRunningAction()

    return <>
    <div className={`setting room-setting ${isRunning ? 'keep-running' : ''}`} onClick={() => {
        onChangeKeepRunning(!isRunning)
      }}>
        <img src={KeepRunningIcon} alt='room' className='!w-[26px] !h-[26px] object-contain' />
      </div>
    </>
}
export default KeepRunningSetting