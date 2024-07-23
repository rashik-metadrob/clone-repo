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
import _ from "lodash"
import fonts from "../../../canvasContainer/components/descriptionBoard/fonts";
import { FONTS_OPTIONS, TEXT_ALIGN, TEXT_DECORATION } from "../../../../utils/constants";

const StoreNameStyle = ({
    item,
    onTextAttributeChange = () => {}
}) => {

    return <>
    <div className="store-name-style-container !pb-[18px]">
        <div className="font-container">
            <div className="select-container">
                <div className="font-inter font-[600] text-[12px] leading-[14.5px] text-[rgba(255,255,255,0.5)] text-left">
                    Font Family
                </div>
                <Select
                    className="select-font w-full mt-[8px]"
                    value={_.get(item, 'font', '')}
                    suffixIcon={<img src={TriangleIcon} alt="" />}
                    options={FONTS_OPTIONS}
                    onChange={(e) => {onTextAttributeChange('font', e)}}
                />
            </div>
            <div>
                <div className="font-inter font-[600] text-[12px] leading-[14.5px] text-[rgba(255,255,255,0.5)] text-left">
                    Font size
                </div>
                <div className="font-size-container mt-[8px]">
                    <img src={FontIcon} alt="" />
                    <InputNumber
                        type="number" 
                        className="input-font" 
                        min={1} 
                        max={100} 
                        value={_.get(item, 'fontSize', '')}
                        onChange={(e) => {onTextAttributeChange( 'fontSize', e)}}
                    />
                </div>
            </div>
        </div>
        <div className="text-style-container mt-[18px]">
            <div className="color-container">
                <div className="font-inter font-[600] text-[12px] leading-[14.5px] text-[rgba(255,255,255,0.5)] text-left">
                    Color
                </div>
                <ColorPicker 
                    value={_.get(item, 'color', '')}
                    format={'hex'}
                    onChange={(e) => {onTextAttributeChange( 'color', typeof colorHex === 'string' ? e : e.toHexString())}}
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
                <div className={`style-item ${_.get(item, 'textAlign', '') === TEXT_ALIGN.LEFT ? 'active' : ''}`} onClick={() => {onTextAttributeChange( 'textAlign', TEXT_ALIGN.LEFT)}}>
                    <img src={LeftIcon} alt="" />
                </div>
                <div className={`style-item ${_.get(item, 'textAlign', '') === TEXT_ALIGN.CENTER ? 'active' : ''}`} onClick={() => {onTextAttributeChange( 'textAlign', TEXT_ALIGN.CENTER)}}>
                    <img src={CenterIcon} alt="" />
                </div>
                <div className={`style-item ${_.get(item, 'textAlign', '') === TEXT_ALIGN.RIGHT ? 'active' : ''}`} onClick={() => {onTextAttributeChange( 'textAlign', TEXT_ALIGN.RIGHT)}}>
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
                    onChange={(e) => {onTextAttributeChange( 'background', typeof colorHex === 'string' ? e : e.toHexString())}}
                />
            </div>
            <div className="background-container">
                <div className="text-background">
                    Glow
                </div>
                <Switch 
                    checked={_.get(item, 'glow', false)}
                    onChange={(e) => {onTextAttributeChange( 'glow', e)}}
                />
            </div>
            <div className="style-container">
                <div className={`style-item ${_.get(item, 'textDecoration', '') === TEXT_DECORATION.NORMAL ? 'active' : ''}`} onClick={() => {onTextAttributeChange( 'textDecoration', TEXT_DECORATION.NORMAL)}}>
                    <img src={NormalIcon} alt="" />
                </div>
                <div className={`style-item ${_.get(item, 'textDecoration', '') === TEXT_DECORATION.LOWERCASE ? 'active' : ''}`} onClick={() => {onTextAttributeChange( 'textDecoration', TEXT_DECORATION.LOWERCASE)}}>
                    <img src={LowerIcon} alt="" />
                </div>
                <div className={`style-item ${_.get(item, 'textDecoration', '') === TEXT_DECORATION.UPPERCASE ? 'active' : ''}`} onClick={() => {onTextAttributeChange( 'textDecoration', TEXT_DECORATION.UPPERCASE)}}>
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
                    onChange={(e) => {onTextAttributeChange('transparency', e)}}
                />
                <InputNumber
                    min={0.01}
                    max={1}
                    step={0.01}
                    value={_.get(item, 'transparency', 0)}
                    onChange={(e) => {onTextAttributeChange('transparency', e)}}
                    className="transform-input w-[100px]"
                />
            </div>
            <div className="action">
                <span className="text-reset" onClick={(e) => {onTextAttributeChange('transparency', 1)}}>
                    Reset
                </span>
            </div>
        </div>
        <div className="slider-container-grid mt-[0]">
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
                    onChange={(e) => {onTextAttributeChange('depth', e)}}
                />
                <InputNumber
                    min={0.01}
                    max={10}
                    step={0.01}
                    value={_.get(item, 'depth', 0)}
                    className="transform-input w-[100px]"
                    onChange={(e) => {onTextAttributeChange('depth', e)}}
                />
            </div>
            <div className="action">
                <span className="text-reset" onClick={(e) => {onTextAttributeChange('depth', 1)}}>
                    Reset
                </span>
            </div>
        </div>
    </div>
    </>
}
export default StoreNameStyle