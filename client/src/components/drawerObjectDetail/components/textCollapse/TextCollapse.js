import { Collapse, ColorPicker, Divider, Input, InputNumber, Select, Slider, Switch } from "antd";
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"
import TriangleIcon from "../../../../assets/images/products/triangle.svg"
import FontIcon from "../../../../assets/images/project/font.svg"

import BIcon from "../../../../assets/images/project/style/b.svg"
import IIcon from "../../../../assets/images/project/style/i.svg"
import UIcon from "../../../../assets/images/project/style/u.svg"
import LeftIcon from "../../../../assets/images/project/style/left.svg"
import CenterIcon from "../../../../assets/images/project/style/center.svg"
import RightIcon from "../../../../assets/images/project/style/right.svg"
import NormalIcon from "../../../../assets/images/project/style/normal.svg"
import LowerIcon from "../../../../assets/images/project/style/lower.svg"
import UpperIcon from "../../../../assets/images/project/style/upper.svg"

import ResetIcon from "../../../../assets/images/project/reset.svg"

import "./styles.scss"
import _ from "lodash";
import fonts from "../../../canvasContainer/components/descriptionBoard/fonts";
import { TEXT_ALIGN, TEXT_DECORATION } from "../../../../utils/constants";

const fontsOptions = [
    {
        label: "Inter Bold",
        value: fonts.InterBold
    },
    {
        label: "Inter Medium",
        value: fonts.InterMedium
    },
    {
        label: "Inter Regular",
        value: fonts.InterRegular
    }
]

const TextCollapse = ({
    item,
    index,
    onChildrenTextAttributeChange = () => {}
}) => {

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="text-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex justify-between w-full">
                        <span>
                            Text {index + 1}
                        </span>
                        <span className="total-info">
                            <span className="num">
                                {_.get(item, ['text', 'length'], 0)}
                            </span>
                            <span className="total">
                                /50
                            </span>
                        </span>
                    </div>,
                    children: <>
                        <div className="text-collapse-content">
                            <div className="search-container mt-[11px]">
                                <Input
                                    value={_.get(item, 'text', '')}
                                    className="input-text"
                                    onChange={(e) => {onChildrenTextAttributeChange(item.id, 'text', e.target.value)}}
                                />
                            </div>
                            <div className="font-container mt-[18px]">
                                <div className="select-container">
                                    <Select
                                        className="select-font w-full"
                                        value={_.get(item, 'font', '')}
                                        suffixIcon={<img src={TriangleIcon} alt="" />}
                                        options={fontsOptions}
                                        onChange={(e) => {onChildrenTextAttributeChange(item.id, 'font', e)}}
                                    />
                                </div>
                                <div className="font-size-container">
                                    <img src={FontIcon} alt="" />
                                    <InputNumber
                                        type="number" 
                                        className="input-font" 
                                        min={1} 
                                        max={100} 
                                        value={_.get(item, 'fontSize', '')}
                                        onChange={(e) => {onChildrenTextAttributeChange(item.id, 'fontSize', e)}}
                                    />
                                </div>
                            </div>
                            <div className="text-style-container mt-[18px]">
                                <div className="color-container">
                                    <div className="text-color">
                                        Color
                                    </div>
                                    <ColorPicker 
                                        value={_.get(item, 'color', '')}
                                        format={'hex'}
                                        onChange={(e) => {onChildrenTextAttributeChange(item.id, 'color', typeof colorHex === 'string' ? e : e.toHexString())}}
                                    />
                                </div>
                                <div className="style-container disabled">
                                    <div className={`style-item active`}>
                                        <img src={BIcon} alt="" />
                                    </div>
                                    <div className={`style-item`}>
                                        <img src={IIcon} alt="" />
                                    </div>
                                    <div className={`style-item`}>
                                        <img src={UIcon} alt="" />
                                    </div>
                                </div>
                                <div className="style-container">
                                    <div className={`style-item ${_.get(item, 'textAlign', '') === TEXT_ALIGN.LEFT ? 'active' : ''}`} onClick={() => {onChildrenTextAttributeChange(item.id, 'textAlign', TEXT_ALIGN.LEFT)}}>
                                        <img src={LeftIcon} alt="" />
                                    </div>
                                    <div className={`style-item ${_.get(item, 'textAlign', '') === TEXT_ALIGN.CENTER ? 'active' : ''}`} onClick={() => {onChildrenTextAttributeChange(item.id, 'textAlign', TEXT_ALIGN.CENTER)}}>
                                        <img src={CenterIcon} alt="" />
                                    </div>
                                    <div className={`style-item ${_.get(item, 'textAlign', '') === TEXT_ALIGN.RIGHT ? 'active' : ''}`} onClick={() => {onChildrenTextAttributeChange(item.id, 'textAlign', TEXT_ALIGN.RIGHT)}}>
                                        <img src={RightIcon} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="divider mt-[15px]">
                            </div>
                            <div className="text-style-container mt-[12px]">
                                <div className="background-container">
                                    <div className="text-background">
                                        Background
                                    </div>
                                    <ColorPicker 
                                        value={_.get(item, 'background', '')}
                                        format={'hex'}
                                        onChange={(e) => {onChildrenTextAttributeChange(item.id, 'background', typeof colorHex === 'string' ? e : e.toHexString())}}
                                    />
                                </div>
                                <div className="background-container">
                                    <div className="text-background">
                                        Glow
                                    </div>
                                    <Switch 
                                        checked={_.get(item, 'glow', false)}
                                        onChange={(e) => {onChildrenTextAttributeChange(item.id, 'glow', e)}}
                                    />
                                </div>
                                <div className="style-container">
                                    <div className={`style-item ${_.get(item, 'textDecoration', '') === TEXT_DECORATION.NORMAL ? 'active' : ''}`} onClick={() => {onChildrenTextAttributeChange(item.id, 'textDecoration', TEXT_DECORATION.NORMAL)}}>
                                        <img src={NormalIcon} alt="" />
                                    </div>
                                    <div className={`style-item ${_.get(item, 'textDecoration', '') === TEXT_DECORATION.LOWERCASE ? 'active' : ''}`} onClick={() => {onChildrenTextAttributeChange(item.id, 'textDecoration', TEXT_DECORATION.LOWERCASE)}}>
                                        <img src={LowerIcon} alt="" />
                                    </div>
                                    <div className={`style-item ${_.get(item, 'textDecoration', '') === TEXT_DECORATION.UPPERCASE ? 'active' : ''}`} onClick={() => {onChildrenTextAttributeChange(item.id, 'textDecoration', TEXT_DECORATION.UPPERCASE)}}>
                                        <img src={UpperIcon} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="slider-container-grid mt-[11px]">
                                <div className="title">
                                    Transparency
                                </div>
                                <div className="header-name gap-[12px]">
                                    <Slider
                                        min={0.01}
                                        max={1}
                                        trackStyle={{
                                            background: "#FFFFFF"
                                        }}
                                        railStyle={{
                                            background: "rgba(0, 0, 0, 0.30)"
                                        }}
                                        className="w-full"
                                        value={_.get(item, 'transparency', 0)}
                                        step={0.01}
                                        onChange={(e) => {onChildrenTextAttributeChange(item.id ,'transparency', e)}}
                                    />
                                    <InputNumber
                                        min={0.01}
                                        max={1}
                                        step={0.01}
                                        value={_.get(item, 'transparency', 0)}
                                        onChange={(e) => {onChildrenTextAttributeChange(item.id ,'transparency', e)}}
                                        className="transform-input w-[100px]"
                                    />
                                </div>
                                <div className="action">
                                    <img src={ResetIcon} alt="" className="cursor-pointer"/>
                                </div>
                            </div>
                            <div className="slider-container-grid mt-[15px]">
                                <div className="title">
                                    Depth
                                </div>
                                <div className="header-name gap-[12px]">
                                    <Slider
                                        min={0.01}
                                        max={10}
                                        trackStyle={{
                                            background: "#FFFFFF"
                                        }}
                                        railStyle={{
                                            background: "rgba(0, 0, 0, 0.30)"
                                        }}
                                        className="w-full"
                                        step={0.01}
                                        value={_.get(item, 'depth', 0)}
                                        onChange={(e) => {onChildrenTextAttributeChange(item.id ,'depth', e)}}
                                    />
                                    <InputNumber
                                        min={0.01}
                                        max={10}
                                        step={0.01}
                                        value={_.get(item, 'depth', 0)}
                                        className="transform-input w-[100px]"
                                        onChange={(e) => {onChildrenTextAttributeChange(item.id ,'depth', e)}}
                                    />
                                </div>
                                <div className="action">
                                    <img src={ResetIcon} alt="" className="cursor-pointer"/>
                                </div>
                            </div>
                            <div className="mt-[15px]">
                                <div className="transform-item">
                                    <div className="title">
                                    </div>
                                    <div className="header-name !text-[#FF0000] pl-[5px]">
                                        X - Axis
                                    </div>
                                    <div className="header-name !text-[#00FF00] pl-[5px]">
                                        Y - Axis
                                    </div>
                                    <div className="header-name !text-[#0000FF] pl-[5px]">
                                        Z - Axis
                                    </div>
                                    <div className="action">
                                    </div>
                                </div>
                                <div className="transform-item mt-[5px]">
                                    <div className="title">
                                        Position
                                    </div>
                                    <div className="header-name">
                                        <InputNumber step={0.01} value={_.get(item, ['position', 'x'], '').toFixed(2)} className="transform-input w-full" onChange={(e) => {onChildrenTextAttributeChange(item.id, 'position', {x: e, y: item.position.y, z: item.position.z})}}/>
                                    </div>
                                    <div className="header-name">
                                        <InputNumber step={0.01} value={_.get(item, ['position', 'y'], '').toFixed(2)} className="transform-input w-full" onChange={(e) => {onChildrenTextAttributeChange(item.id, 'position', {x: item.position.x, y: e, z: item.position.z})}}/>
                                    </div>
                                    <div className="header-name">
                                        <InputNumber step={0.01} value={_.get(item, ['position', 'z'], '').toFixed(2)} className="transform-input w-full" onChange={(e) => {onChildrenTextAttributeChange(item.id, 'position', {x: item.position.x, y: item.position.y, z: e})}}/>
                                    </div>
                                    <div className="action">
                                        <span className="text-reset" onClick={() => {onChildrenTextAttributeChange(item.id, 'position', {x: 0, y: 0, z: 0})}}>
                                            Reset
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>,
                },
            ]}
        />
    </>
}
export default TextCollapse;