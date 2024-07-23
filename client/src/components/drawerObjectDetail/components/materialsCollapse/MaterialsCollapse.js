import { Collapse, Input } from "antd";
import "./styles.scss"

import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"
import SearchIcon from "../../../../assets/images/project/search.svg"
import { useState } from "react";

import Mat1Image from "../../../../assets/images/project/materials/1.png"
import Mat2Image from "../../../../assets/images/project/materials/2.png"
import Mat3Image from "../../../../assets/images/project/materials/3.png"
import Mat4Image from "../../../../assets/images/project/materials/4.png"
import Mat5Image from "../../../../assets/images/project/materials/5.png"
import Mat6Image from "../../../../assets/images/project/materials/6.png"
import Mat7Image from "../../../../assets/images/project/materials/7.png"

const MaterialsCollapse = () => {
    const [selectedMaterial, setSelectedMaterial] = useState("1")
    const [listMaterials, setListMaterials] = useState([
        {
            id: "1",
            name: "Wooden Wall 0354",
            image: Mat1Image
        },
        {
            id: "2",
            name: "Wooden Wall 0354",
            image: Mat2Image
        },
        {
            id: "3",
            name: "Wooden Wall 0354",
            image: Mat3Image
        },
        {
            id: "4",
            name: "Wooden Wall 0354",
            image: Mat4Image
        },
        {
            id: "5",
            name: "Wooden Wall 0354",
            image: Mat5Image
        },
        {
            id: "6",
            name: "Wooden Wall 0354",
            image: Mat6Image
        },
        {
            id: "7",
            name: "Wooden Wall 0354",
            image: Mat7Image
        }
    ])

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="material-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex">Materials</div>,
                    children: <>
                        <div className="materials-collapse-content">
                            <div className="search-container">
                                <Input
                                    placeholder="Search Library"
                                    suffix={<img src={SearchIcon} alt=""/>}
                                    className="input-search"
                                />
                            </div>
                            <div className="material-container">
                                {
                                    listMaterials
                                    && listMaterials.map(el => {
                                        return <>
                                            <div className={`material-item ${selectedMaterial === el.id ? 'selected' : ''}`} key={el.id} onClick={() => {setSelectedMaterial(el.id)}}>
                                                <div className="image">
                                                    <img src={el.image} alt="" />
                                                </div>
                                                <div className="name">
                                                    {el.name}
                                                </div>
                                            </div>
                                        </>
                                    })
                                }
                            </div>
                        </div>
                    </>,
                },
            ]}
        />
    </>
}
export default MaterialsCollapse;