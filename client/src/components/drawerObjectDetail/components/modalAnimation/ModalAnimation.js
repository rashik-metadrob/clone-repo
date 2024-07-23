import { Col, Input, Modal, Row, Select } from "antd"
import "./styles.scss"

import AnimationIcon from "../../../../assets/images/project/animation-icon.svg"
import ExitIcon from "../../../../assets/images/project/exit.svg"
import TriangleIcon from "../../../../assets/images/products/triangle.svg"

import Animation1Image from "../../../../assets/images/project/animation/1.png"
import Animation2Image from "../../../../assets/images/project/animation/2.png"
import Animation3Image from "../../../../assets/images/project/animation/3.png"
import Animation4Image from "../../../../assets/images/project/animation/4.png"
import Animation5Image from "../../../../assets/images/project/animation/5.png"
import Animation6Image from "../../../../assets/images/project/animation/6.png"
import Animation7Image from "../../../../assets/images/project/animation/7.png"
import Animation8Image from "../../../../assets/images/project/animation/8.png"
import { useState } from "react"

const ModalAnimation = ({
    open,
    onClose = () => {},
    onSelect
}) => {
    const [listAnimation, setListAnimation] = useState([
        {
            id: "1",
            name: "Animation",
            image: Animation1Image
        },
        {
            id: "2",
            name: "Animation",
            image: Animation2Image
        },
        {
            id: "3",
            name: "Animation",
            image: Animation3Image
        },
        {
            id: "4",
            name: "Animation",
            image: Animation4Image
        },
        {
            id: "5",
            name: "Animation",
            image: Animation5Image
        },
        {
            id: "6",
            name: "Animation",
            image: Animation6Image
        },
        {
            id: "7",
            name: "Animation",
            image: Animation7Image
        },
        {
            id: "8",
            name: "Animation",
            image: Animation8Image
        }
    ])


    return <>
        <Modal
            open={open}
            closable={false}
            title={null}
            footer={null}
            onCancel={onClose}
            width={1100}
            className="modal-animation"
            centered
        >
            <div className="modal-animation-content">
                <div className="modal-title-container">
                    <div className="title-container">
                        <img src={AnimationIcon} alt="" />
                        Animation
                    </div>
                    <div className="select-container">
                        <Select
                            className="select-type w-full"
                            value={'All'}
                            suffixIcon={<img src={TriangleIcon} alt="" />}
                            options={[{label: "All", value: "All"}]}
                        />
                    </div>
                    <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                        <img src={ExitIcon} alt="" />
                        <div className="text-close">Close</div>
                    </div>
                </div>
                <Row className="animation-list py-[17px] !mx-[17px]" gutter={[29, 29]}>
                    {
                        listAnimation && listAnimation.map((el, index) => (
                            <Col span={6} key={el.id} className="h-[220px]" onClick={() => {onSelect(el)}}>
                                <div className="animation-item">
                                    <img src={el.image} alt=""/>
                                </div>
                            </Col>
                            )
                        )
                    }
                </Row>
            </div>
        </Modal>
    </>
}
export default ModalAnimation