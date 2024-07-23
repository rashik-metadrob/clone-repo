import { Collapse, Upload } from "antd"
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"

import "./styles.scss"
import { useState } from "react"
import ModalPlugin from "../modalPlugin/ModalPlugin"

const PluginCollapse = () => {
    const [isShowModal, setIsShowModal] = useState(false)
    const [listPlugin, setListPlugin] = useState([
        // {
        //     name: "Virtual Try-on"
        // },
        // {
        //     name: "AI generate"
        // }
    ])

    const onClickAdd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsShowModal(true)
    }

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="plugin-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex justify-between items-center w-full">
                        <span>
                            Plug-in
                        </span>
                        <span className="text-add disabled" onClick={(e) => {onClickAdd(e)}}>
                            + Add
                        </span>
                    </div>,
                    children: <>
                        <div className="plugin-collapse-content">
                            {
                                listPlugin.map((el, index) => 
                                    (
                                        <div className="motion-info" key={`motion-${index}`}>
                                            <div className="image">

                                            </div>
                                            <div className="motion-name-info">
                                                <div className="name">
                                                    {el.name}
                                                </div>
                                                <div className="change" onClick={() => {setIsShowModal(true)}}>
                                                    Change
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </>,
                },
            ]}
        />
        <ModalPlugin
            open={isShowModal}
            onClose={() => {setIsShowModal(false)}}
        />
    </>
}
export default PluginCollapse