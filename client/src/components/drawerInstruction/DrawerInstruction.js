import { Drawer } from "antd"
import ExitIcon from "../../assets/images/project/exit.svg"
import "./styles.scss"
import KeyArrowUpIcon from "../../assets/images/project/key-arrow-up.svg"
import { useEffect } from "react"

const DrawerInstruction = ({
    open,
    onClose = () => {},
    container,
    onPlayOpenMenuSound = () => {},
    onPlayCloseMenuSound = () => {}
}) => {

    useEffect(() => {
        if(open){
            onPlayOpenMenuSound()
        } else {
            onPlayCloseMenuSound()
        }
    }, [open])

    return <>
        <Drawer
            title={null}
            placement="right"
            closable={false}
            onClose={() => {onClose()}}
            open={open}
            getContainer={() => container}
            destroyOnClose={true}
            className="drawer-instruction"
            width={443}
            mask={false}
        >
            <div className="drawer-instruction-container">
                <div className="drawer-title-container">
                    <div className="title">
                        Instruction
                    </div>
                    <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                        <img src={ExitIcon} alt="" />
                        <div className="text-close">Close</div>
                    </div>
                </div>
                <div className="drawer-content-wrap">
                    <div className="drawer-content-container">
                        <div className="instruction-group">
                            <div className="instruction-item instruction-item-header">
                                <div className="header-text">
                                    Object Actions
                                </div>
                            </div>
                            <div className="instruction-item">
                                <div className="instruction-layout">
                                    <span>
                                        Selected object actions
                                    </span>
                                    <div className="flex gap-[11px] items-center justify-end pr-[12px]">
                                        <kbd>Q</kbd>
                                        <span>and</span>
                                        <kbd>E</kbd>
                                    </div>
                                </div>
                            </div>
                            <div className="instruction-item">
                                <div className="instruction-layout">
                                    <span>
                                        Delete the selected object
                                    </span>
                                    <div className="flex gap-[11px] items-center justify-end pr-[12px]">
                                        <kbd>Delete</kbd>
                                    </div>
                                </div>
                            </div>
                            <div className="instruction-item">
                                <div className="instruction-layout">
                                    <span>
                                        Undo the previous action
                                    </span>
                                    <div className="flex gap-[11px] items-center justify-end pr-[12px]">
                                        <kbd>Ctrl</kbd>
                                        <span>+</span>
                                        <kbd>Z</kbd>
                                    </div>
                                </div>
                            </div>
                            <div className="instruction-item">
                                <div className="instruction-layout">
                                    <span>
                                        Redo the previously undone action
                                    </span>
                                    <div className="flex flex-col gap-[11px]">
                                        <div className="flex gap-[11px] items-center justify-end pr-[12px]">
                                            <kbd>Shift</kbd>
                                            <span>+</span>
                                            <kbd>Z</kbd>
                                        </div>
                                        <div>
                                            <span className="pl-[15px]">
                                                or
                                            </span>
                                        </div>
                                        <div className="flex gap-[11px] items-center justify-end pr-[12px]">
                                            <kbd>Ctrl</kbd>
                                            <span>+</span>
                                            <kbd>Y</kbd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="instruction-item">
                                <div className="instruction-layout">
                                    <span>
                                        Open the detail panel for the selected object
                                    </span>
                                    <div className="flex gap-[11px] items-center justify-end pr-[12px]">
                                        <kbd>I</kbd>
                                    </div>
                                </div>
                            </div>
                            <div className="instruction-item">
                                <div className="instruction-layout">
                                    <span>
                                        Copy the selected object
                                    </span>
                                    <div className="flex gap-[11px] items-center justify-end pr-[12px]">
                                        <kbd>Ctrl</kbd>
                                        <span>+</span>
                                        <kbd>C</kbd>
                                    </div>
                                </div>
                            </div>
                            <div className="instruction-item">
                                <div className="instruction-layout">
                                    <span>
                                        Paste the copied object at the mouse cursor position
                                    </span>
                                    <div className="flex gap-[11px] items-center justify-end pr-[12px]">
                                        <kbd>Ctrl</kbd>
                                        <span>+</span>
                                        <kbd>V</kbd>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="instruction-group">
                            <div className="instruction-item instruction-item-header">
                                <div className="header-text">
                                    Scene Navigation
                                </div>
                            </div>
                            <div className="instruction-item">
                                <div className="instruction-layout">
                                    <span>
                                        Move the camera around the scene
                                    </span>
                                    <div className="flex flex-col gap-[12px] items-center">
                                        <div className="flex flex-col gap-[7px] items-center">
                                            <div className="flex gap-[7px] item-center">
                                                <div></div>
                                                <kbd>W</kbd>
                                                <div></div>
                                            </div>
                                            <div className="flex gap-[7px] item-center">
                                                <kbd>A</kbd>
                                                <kbd>S</kbd>
                                                <kbd>D</kbd>
                                            </div>
                                        </div>
                                        <span>or</span>
                                        <div className="flex flex-col gap-[7px] items-center">
                                            <div className="flex gap-[7px] item-center">
                                                <div></div>
                                                <kbd><img src={KeyArrowUpIcon} alt="" /></kbd>
                                                <div></div>
                                            </div>
                                            <div className="flex gap-[7px] item-center">
                                                <kbd><img src={KeyArrowUpIcon} alt="" className="rotate-[-90deg]" /></kbd>
                                                <kbd><img src={KeyArrowUpIcon} alt="" className="rotate-[180deg]" /></kbd>
                                                <kbd><img src={KeyArrowUpIcon} alt="" className="rotate-[90deg]" /></kbd>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="instruction-item !pb-[60px]">
                                <div className="instruction-layout">
                                    <span>
                                        Move the camera up and down
                                    </span>
                                    <div className="flex gap-[11px] items-center justify-end pr-[12px]">
                                        <kbd>Q</kbd>
                                        <span>and</span>
                                        <kbd>E</kbd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    </>
}
export default DrawerInstruction