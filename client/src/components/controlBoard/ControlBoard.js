import "./styles.scss"

import DeleteIcon from "../../assets/images/project/delete.svg"
import CopyIcon from "../../assets/images/project/copy.svg"
import PasteIcon from "../../assets/images/project/paste.svg"
import TurnLeftIcon from "../../assets/images/project/turn-left.svg"

const ControlBoard = ({
    isShow
}) => {

    return <>
        <div className={`control-board-container ${isShow ? 'show' : ''}`}>
            <div className="control-board">
                <div className="control-item">
                    <div className="flex items-center gap-[12px]">
                        <img src={DeleteIcon} alt="" className="w-[28px] h-[28px]"/>
                        <div className="text-control-name">
                            Delete
                        </div>
                    </div>
                    <div className="text-control-host-key">
                        Del/Backspace
                    </div>
                </div>
                <div className="control-item">
                    <div className="flex items-center gap-[12px]">
                        <img src={CopyIcon} alt="" className="w-[28px] h-[28px]"/>
                        <div className="text-control-name">
                            Copy
                        </div>
                    </div>
                    <div className="text-control-host-key">
                        Ctrl+c/Cmd+c
                    </div>
                </div>
                <div className="control-item">
                    <div className="flex items-center gap-[12px]">
                        <img src={PasteIcon} alt="" className="w-[28px] h-[28px]"/>
                        <div className="text-control-name">
                            Paste
                        </div>
                    </div>
                    <div className="text-control-host-key">
                        Ctrl+v/Cmd+v
                    </div>
                </div>
                <div className="control-item">
                    <div className="flex items-center gap-[12px]">
                        <img src={TurnLeftIcon} alt="" className="w-[28px] h-[28px]"/>
                        <div className="text-control-name">
                            Turn Left
                        </div>
                    </div>
                    <div className="text-control-host-key">
                        Q
                    </div>
                </div>
                <div className="control-item">
                    <div className="flex items-center gap-[12px]">
                        <img src={TurnLeftIcon} alt="" className="w-[28px] h-[28px]"/>
                        <div className="text-control-name">
                            Turn Right
                        </div>
                    </div>
                    <div className="text-control-host-key">
                        E
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default ControlBoard