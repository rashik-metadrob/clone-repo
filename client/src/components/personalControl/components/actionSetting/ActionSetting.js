import { Dropdown } from "antd"
import { useState } from "react"
import { isMobile } from "react-device-detect"
import ActionIcon from '../../../../assets/images/project/action.png';
import { useTriggerAction } from "../../../../hook/useTriggerAction";
import { ACTION_KEYS } from "../../../../utils/constants";
import Action1 from "../../../../assets/images/project/preview/action/1.png"
import ThumbUpIcon from "../../../../assets/images/project/preview/action/thumb-up.png"
import ThumbDownIcon from "../../../../assets/images/project/preview/action/thumb-down.png"

const ActionSetting = () => {
    const [isShowMenu, setIsShowMenu] = useState(false)
    const { onSetAction } = useTriggerAction()

    function onTriggerAction(actionKey) {
        onSetAction(actionKey)
        setIsShowMenu(false)
      }

    return <>
        <Dropdown
            menu={{
                items: []
            }}
            dropdownRender={() => (
            <div className="menu-action-content">
                <div className='item' onClick={() => onTriggerAction(ACTION_KEYS.WAVING)}><img src={Action1} alt="" /></div>
                <div className='item' onClick={() => onTriggerAction(ACTION_KEYS.AGREEING)}><img src={ThumbUpIcon} alt="" /></div>
                <div className='item' onClick={() => onTriggerAction(ACTION_KEYS.DISMISSING)}><img src={ThumbDownIcon} alt="" /></div>
            </div>
            )}
            placement={isMobile ? 'topLeft' : 'top'}
            arrow={false}
            trigger="click"
            overlayClassName='menu-action-overlay'
            open={isShowMenu}
            onOpenChange={(value) => {setIsShowMenu(value)}}
        >
            <div className='setting room-setting'>
            <img src={ActionIcon} alt='room' className='!w-[26px] !h-[26px] object-contain'/>
            </div>
        </Dropdown>
    </>
}

export default ActionSetting