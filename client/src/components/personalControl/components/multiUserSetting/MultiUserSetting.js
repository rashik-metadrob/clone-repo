import { useEffect, useState } from 'react';
import UserGroupIcon from '../../../../assets/images/project/user-group.png';
import { isMobile } from 'react-device-detect';
import { useSelector } from 'react-redux';
import { getIsMuteAll, getPlayerName, setIsMuteAll } from '../../../../redux/modelSlice';
import MicIcon from '../../../../assets/images/project/Mic.svg';
import { getOtherPlayers, onMuteAllOtherPlayer, onMuteOtherPlayer } from '../../../../redux/photonSlice';
import { PUBLISH_ROLE } from '../../../../utils/constants';
import { useAppDispatch } from '../../../../redux';
import global from '../../../../redux/global';
import { Dropdown } from 'antd';

const MultiUserSetting = () => {
    const dispatch = useAppDispatch()
    const [isShowUser, setIsShowUser] = useState(false)
    const playerName = useSelector(getPlayerName)
    const otherPlayers = useSelector(getOtherPlayers)
    const isMuteAll = useSelector(getIsMuteAll)

    useEffect(() => {
      if(!otherPlayers.find(item => item.role === PUBLISH_ROLE.CUSTOMER && !item.mute)){
        dispatch(setIsMuteAll(true))
      } 
      if (!otherPlayers.find(item => item.role === PUBLISH_ROLE.CUSTOMER && item.mute)){
        dispatch(setIsMuteAll(false))
      }
      
    },[otherPlayers])

    function onSelectUser(id, value) {
        dispatch(onMuteOtherPlayer({id, value}))
    }

    function onSelectAll() {
        if(isMuteAll) {
          dispatch(onMuteAllOtherPlayer(false))
        }
        else {
          dispatch(onMuteAllOtherPlayer(true))
        }
    
        dispatch(setIsMuteAll(!isMuteAll))
    }

    return <>
    {
        !global.IS_DROB_A &&
        // <div className='setting room-setting'>
        //   <img src={UserGroupIcon} alt='room' className='!w-[26px] !h-[26px] object-contain' onClick={() => {
        //     setIsShowUser(!isShowUser)
        //   }} />
        //   {
        //     isShowUser && !isMobile && 
        //     <div className={`room-container ${isMobile ? 'mobile' : 'desktop'}`}>
        //       <div className='customer-header'>
        //         <div className='title'>{playerName}</div>
        //         <div className='icon'>
        //         <img src={MicIcon} alt='Mic' />
        //         </div>
        //       </div>
        //       <div className='center'>
        //         <div className='child-container'>
        //           {
        //             otherPlayers.map((u, index) => (
        //               <div className='child-item' key={index}>
        //                 <div className='name'>{ u.clientName }</div>
        //                 <div className={`check-box ${u.role === PUBLISH_ROLE.SALE ? 'disabled' : ''}`}>
        //                   <div className='box' onClick={() => onSelectUser(u.clientId, !u.mute)}>
        //                     {
        //                       u.mute && <div className='selected'></div>
        //                     }
        //                   </div>
        //                 </div>
        //               </div>
        //             ))
        //           }
        //         </div>
        //       </div>
        //       <div className='bottom'>
        //           <div className='divide'/>
        //           <div className='mute-all'>
        //             <div className='custom-cb' onClick={() => onSelectAll()}>
        //               {
        //                 isMuteAll && otherPlayers.length > 0 && <div className='selected' />
        //               }
        //             </div>
        //             Mute all
        //           </div>
        //       </div>
        //     </div>
        //   }
        // </div>
        <Dropdown
            menu={{
                items: []
            }}
            dropdownRender={() => (
              <div className={`room-container ${isMobile ? 'mobile' : 'desktop'}`}>
                <div className='customer-header'>
                  <div className='title'>{playerName}</div>
                  <div className='icon'>
                  <img src={MicIcon} alt='Mic' />
                  </div>
                </div>
                <div className='center'>
                  <div className='child-container'>
                    {
                      otherPlayers.map((u, index) => (
                        <div className='child-item' key={index}>
                          <div className='name'>{ u.clientName }</div>
                          <div className={`check-box ${u.role === PUBLISH_ROLE.SALE ? 'disabled' : ''}`}>
                            <div className='box' onClick={() => onSelectUser(u.clientId, !u.mute)}>
                              {
                                u.mute && <div className='selected'></div>
                              }
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div className='bottom'>
                    <div className='divide'/>
                    <div className='mute-all'>
                      <div className='custom-cb' onClick={() => onSelectAll()}>
                        {
                          isMuteAll && otherPlayers.length > 0 && <div className='selected' />
                        }
                      </div>
                      Mute all
                    </div>
                </div>
              </div>
            )}
            placement={isMobile ? 'left' : 'top'}
            arrow={false}
            trigger="click"
            overlayClassName='menu-action-overlay'
            open={isShowUser}
            onOpenChange={(value) => {setIsShowUser(value)}}
        >
          <div className='setting room-setting'>
            <img src={UserGroupIcon} alt='room' className='!w-[26px] !h-[26px] object-contain' onClick={() => {
              setIsShowUser(!isShowUser)
            }} />
          </div>
        </Dropdown>
      }
    </>
}

export default MultiUserSetting