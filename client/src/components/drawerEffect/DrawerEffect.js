import { Col, Drawer, Input, Row, Select } from "antd"
import { forwardRef, useState } from "react"
import "./styles.scss"
import ExitIcon from "../../assets/images/project/exit.svg"
import EffectIcon from "../../assets/images/project/effect-icon.svg"

import SearchIcon from "../../assets/images/project/search.svg"

import Animation1Image from "../../assets/images/project/effect/1.png"
import Animation2Image from "../../assets/images/project/effect/2.png"
import Animation3Image from "../../assets/images/project/effect/3.png"
import Animation4Image from "../../assets/images/project/effect/4.png"
import Animation5Image from "../../assets/images/project/effect/5.png"
import Animation6Image from "../../assets/images/project/effect/6.png"
import Animation7Image from "../../assets/images/project/effect/7.png"
import SearchLibraryInput from "../searchLibraryInput/SearchLibraryInput"

const DrawerEffect = forwardRef(({
    open,
    onClose = () => {},
    container,
}, ref) => {
    const [listAnimation, setListAnimation] = useState([
        {
            id: "1",
            image: Animation1Image
        },
        {
            id: "2",
            image: Animation2Image
        },
        {
            id: "3",
            image: Animation3Image
        },
        {
            id: "4",
            image: Animation4Image
        },
        {
            id: "5",
            image: Animation5Image
        },
        {
            id: "6",
            image: Animation6Image
        },
        {
            id: "7",
            image: Animation7Image
        }
    ])

    return <>
        <Drawer
            title={null}
            placement="left"
            closable={false}
            onClose={() => {onClose()}}
            open={open}
            getContainer={() => container}
            destroyOnClose={true}
            className="drawer-shared"
            width={377}
            mask={false}
        >
            <div className="drawer-effect-container">
                <div className="drawer-title-container">
                    <div className="title-container">
                        <div className="title">
                            <img src={EffectIcon} alt="" />
                            Effect
                        </div>
                        <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                            <img src={ExitIcon} alt="" />
                            <div className="text-close">Close</div>
                        </div>
                    </div>
                    <div className="search-container mt-[11px]">
                        <SearchLibraryInput />
                    </div>
                </div>
                <Row className="effect-list !ml-0 !mr-0 my-[24px]" gutter={[24, 24]} style={{flexGrow: "initial"}}>
                    {
                        listAnimation && listAnimation.map((el, index) => {
                            return <>
                                <Col span={12} key={el.id} className="h-[150px]">
                                    <div className="effect-item">
                                        <img src={el.image} alt=""/>
                                    </div>
                                </Col>
                            </>
                        })
                    }
                </Row>
            </div>
        </Drawer>
    </>
})

export default DrawerEffect;