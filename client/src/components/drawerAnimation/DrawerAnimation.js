import { Col, Drawer, Row, Select } from "antd"
import { forwardRef, useState } from "react"
import "./styles.scss"
import ExitIcon from "../../assets/images/project/exit.svg"
import AnimationIcon from "../../assets/images/project/animation-icon.svg"

import TriangleIcon from "../../assets/images/products/triangle.svg"

import Animation1Image from "../../assets/images/project/animation/1.png"
import Animation2Image from "../../assets/images/project/animation/2.png"
import Animation3Image from "../../assets/images/project/animation/3.png"
import Animation4Image from "../../assets/images/project/animation/4.png"
import Animation5Image from "../../assets/images/project/animation/5.png"
import Animation6Image from "../../assets/images/project/animation/6.png"
import Animation7Image from "../../assets/images/project/animation/7.png"
import Animation8Image from "../../assets/images/project/animation/8.png"

const DrawerAnimation = forwardRef(({
    open,
    onClose = () => {},
    container,
}, ref) => {
    const [listCategoryFilter, setListCategoryFilter] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("All")
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
        },
        {
            id: "8",
            image: Animation8Image
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
            <div className="drawer-animation-container">
                <div className="drawer-title-container">
                    <div className="title-container">
                        <div className="title">
                            <img src={AnimationIcon} alt="" />
                            Animation
                        </div>
                        <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                            <img src={ExitIcon} alt="" />
                            <div className="text-close">Close</div>
                        </div>
                    </div>
                    <div className="select-cate-container mt-[11px]">
                        <Select
                            className="category-filter-select w-full"
                            value={selectedCategory}
                            suffixIcon={<img src={TriangleIcon} alt="" />}
                            options={[...listCategoryFilter, {label: "All", value: "All"}]}
                            onChange={(val) => {
                                setSelectedCategory(val);
                            }}
                        />
                    </div>
                </div>
                <Row className="animation-list !ml-0 !mr-0 my-[24px]" gutter={[24, 24]} style={{flexGrow: "initial"}}>
                    {
                        listAnimation && listAnimation.map((el, index) => {
                            return <>
                                <Col span={12} key={el.id} className="h-[150px]">
                                    <div className="animation-item">
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

export default DrawerAnimation;