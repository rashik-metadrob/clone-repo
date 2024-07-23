import { Collapse, Select } from "antd"
import ArrowDownIcon from "../../../../../assets/images/project/arrow-down.svg"
import AdminAnimationIcon from "../../../../../assets/images/project/admin-animation-icon.svg"
import "./styles.scss"
import { useState } from "react"
import { AVAILABLE_ANIMATION } from "../../../../../utils/constants"
import LoopForever from "../../../../../assets/icons/LoopForever"
import LoopOne from "../../../../../assets/icons/LoopOne"
import PlayNever from "../../../../../assets/icons/PlayNever"
import { useSelector } from "react-redux"
import { getTemplateAvailableAnimation, setTemplateAvailableAnimation } from "../../../../../redux/modelSlice"
import { useAppDispatch } from "../../../../../redux"

const AdminTemplateAnimationCollapse = ({}) => {
    const dispatch = useAppDispatch()
    const [isShowSelectAnimation, setIsShowSelectAnimation] = useState(false)
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
    const templateAvailableAnimation = useSelector(getTemplateAvailableAnimation)

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="admin-template-animation-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex">Animation</div>,
                    children: <>
                        <div className="animation-collapse-content">
                            <div className="motion-info">
                                <div className="motion-name-info py-[8px]">
                                    <div className="flex items-center gap-[16px]">
                                        <img src={AdminAnimationIcon} alt="" />
                                        <div className="name">
                                            Available animation
                                        </div>
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
                                                                dispatch(setTemplateAvailableAnimation(el.value))
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
                                        value={templateAvailableAnimation}
                                        onDropdownVisibleChange={(open) => {setIsShowSelectAnimation(open)}}
                                    />
                                </div>
                            </div>
                        </div>
                    </>,
                },
            ]}
        />
    </>
}
export default AdminTemplateAnimationCollapse