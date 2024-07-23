import './styles.scss';
import { useEffect, useState } from 'react';
import {isMobile} from 'react-device-detect';
import LiveModeControl from './components/liveModeControl/LiveModeControl';
import global from '../../redux/global';
import { useLocation } from 'react-router-dom';
import { isPublishModeLocation } from '../../utils/util';
import MultiUserSetting from './components/multiUserSetting/MultiUserSetting';
import ActionSetting from './components/actionSetting/ActionSetting';
import AudioSetting from './components/audioSetting/AudioSetting';
import MicSetting from './components/micSetting/MicSetting';
import KeepRunningSetting from './components/keepRunningSetting/KeepRunningSetting';
import CartSetting from './components/cartSetting/CartSetting';
import ShowMenuIcon from "../../assets/images/mobile/show-menu.svg"
import ResetToInitStateSetting from './components/resetToInitStateSetting/ResetToInitStateSetting';

function PersonalControl({
  container,
  onPlayOpenMenuSound = () => {},
  onPlayCloseMenuSound = () => {}
}) {
  const location = useLocation()
  const [isPortraitMode, setIsPortraitMode] = useState(window.innerHeight > window.innerWidth)
  const [isShowMenu, setIsShowMenu] = useState(false)

  useEffect(() => {
      window.addEventListener("resize", handleResize)

      return () => {
          window.removeEventListener("resize", handleResize)
      }
  }, [])

  const handleResize = () => {
    setIsPortraitMode(window.innerHeight > window.innerWidth)
  }

  return <>
  {isPublishModeLocation(location) && !global.IS_DROB_A && isMobile && !isPortraitMode && <div className='absolute bottom-[20px] left-[50%] z-[3]'>
    <LiveModeControl isPortraitMode={isPortraitMode}/>
  </div>}
  <div className={`personal-control-wrapper ${isMobile ? 'mobile' : 'desktop'} ${isPortraitMode ? "portrait" : "landscape"}`}>
    {isPublishModeLocation(location) && !global.IS_DROB_A && !(isMobile && !isPortraitMode) && <LiveModeControl isPortraitMode={isPortraitMode}/>}
    
    <div className={`personal-control-container ${isMobile ? 'mobile' : 'desktop'} ${isPortraitMode ? "portrait" : "landscape"} ${isShowMenu ? 'show' : ''}`}>
      {
        !isMobile && <>
          <MicSetting />
          <AudioSetting />
          <MultiUserSetting />
          <ActionSetting />
          <KeepRunningSetting />
          <CartSetting 
            container={container}
            onPlayOpenMenuSound={onPlayOpenMenuSound}
            onPlayCloseMenuSound={onPlayCloseMenuSound}
          />
          <ResetToInitStateSetting />
        </>
      }
      {
        isMobile && isPortraitMode && <>
          <MicSetting />
          <AudioSetting />
          <MultiUserSetting />
          <ActionSetting />
          <CartSetting 
            container={container}
            onPlayOpenMenuSound={onPlayOpenMenuSound}
            onPlayCloseMenuSound={onPlayCloseMenuSound}
          />
          <ResetToInitStateSetting />
        </>
      }
      {
        isMobile && !isPortraitMode && <>
          <AudioSetting />
          <MultiUserSetting />
          <ActionSetting />
          <MicSetting />
          <ResetToInitStateSetting />
          <CartSetting 
            container={container}
            onPlayOpenMenuSound={onPlayOpenMenuSound}
            onPlayCloseMenuSound={onPlayCloseMenuSound}
          />
        </>
      }
    </div>
    <>
      {
        isMobile && 
        <button className={`btn-mobile-show-menu ${isShowMenu ? 'show' : ''}`} onClick={() => {setIsShowMenu(!isShowMenu)}}>
          <img src={ShowMenuIcon} alt="" />
        </button>
      }
    </>
  </div>
  </>
}

export default PersonalControl;