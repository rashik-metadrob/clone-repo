import { Collapse, Select, Upload } from "antd"
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"
import Model3dIcon from "../../../../assets/images/project/model3d.svg"

import Animation4Image from "../../../../assets/images/project/animation/4.png"

import "./styles.scss"
import { useState } from "react"
import ModalAnimation from "../modalAnimation/ModalAnimation"
import { AVAILABLE_ANIMATION } from "../../../../utils/constants"
import LoopForever from "../../../../assets/icons/LoopForever"
import LoopOne from "../../../../assets/icons/LoopOne"
import PlayNever from "../../../../assets/icons/PlayNever"

const AnimationCollapse = ({
    availableAnimation,
    onChangeAvailableAnimation = () => {}
}) => {
    const [isShowSelectAnimation, setIsShowSelectAnimation] = useState(false)
    const [isShowModal, setIsShowModal] = useState(false)
    const [selectedAnimation, setSelectedAnimation] = useState()
    const [listAvailableAnimations] = useState([
        {
            value: AVAILABLE_ANIMATION.LOOP_FOREVER,
            label: "Loop forever",
            icon: <LoopForever />
        },
        {
            value: AVAILABLE_ANIMATION.LOOP_ONE,
            label: "Loop one",
            icon: <LoopOne />
        },
        {
            value: AVAILABLE_ANIMATION.PLAY_NEVER,
            label: "Play never",
            icon: <PlayNever />
        }
    ])

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="animation-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex">Animation</div>,
                    children: <>
                        <div className="animation-collapse-content">
                            {/* {!selectedAnimation &&<div className="add-motion-btn" onClick={() => {setIsShowModal(true)}}>
                                + Add Motion
                            </div>}
                            {selectedAnimation && <div className="motion-info">
                                <img src={selectedAnimation.image} alt="" />
                                <div className="motion-name-info">
                                    <div className="name">
                                        {selectedAnimation.name}
                                    </div>
                                    <div className="change" onClick={() => {setIsShowModal(true)}}>
                                        Change
                                    </div>
                                </div>
                            </div>} */}

                            <div className="motion-info">
                                <div className="motion-name-info py-[8px]">
                                    <div className="name">
                                        Available animation
                                    </div>
                                    <Select
                                        className="object-detail-select w-[112px]"
                                        popupClassName="object-detail-select-popup"
                                        options={listAvailableAnimations}
                                        dropdownRender={() => (
                                            <div className="custom-popup">
                                                {
                                                    listAvailableAnimations.map(el => (
                                                        <div className="item" 
                                                            key={el.value} 
                                                            onClick={() => {
                                                                setIsShowSelectAnimation(false)
                                                                onChangeAvailableAnimation(el.value)
                                                            }
                                                        }
                                                        >
                                                            <div className="icon-container">
                                                                {el.icon}
                                                            </div>
                                                            <span>{el.label}</span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )}
                                        open={isShowSelectAnimation}
                                        value={availableAnimation}
                                        onDropdownVisibleChange={(open) => {setIsShowSelectAnimation(open)}}
                                    />
                                </div>
                            </div>
                        </div>
                    </>,
                },
            ]}
        />
        <ModalAnimation 
            open={isShowModal}
            onClose={() => {setIsShowModal(false)}}
            onSelect={(el) => {
                setSelectedAnimation(el)
                setIsShowModal(false)
            }}
        />
    </>
}
export default AnimationCollapse