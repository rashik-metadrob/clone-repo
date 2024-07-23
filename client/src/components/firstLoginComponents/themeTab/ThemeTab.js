import "./styles.scss"
import themeImage from "../../../assets/images/first-login/themeBg.png"
import { Col, ColorPicker, Input, Row } from "antd"
import { useState } from "react"
import SelectLogo from "../../selectLogo/SelectLogo"

const ThemeTab = () => {
    const [formData, setFormData] = useState({
        logoId: null,
        title: "",
        bodyText: "",
        buttonHoverColor: "#959595",
        buttonBackgroundColor: "#FFFFFF"
    })
    const [isHover, setIsHover] = useState(false)

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    return <>
        <div className="theme-tab-container pt-[46px]">
            <Row gutter={[66, 24]} className="!mx-0">
                <Col span={24} lg={12}>
                    <SelectLogo 
                        // value={formData.logoId}
                        value={"Logo"}
                        onChange={(value) => {handleFormDataChange('logoId', value)}}
                    />
                    <Input 
                        className="shared-first-login-input mt-[25px]"
                        placeholder="Title Text"
                        value={formData.title}
                        onChange={(e) => {handleFormDataChange('title', e.target.value)}}
                    />
                    <Input 
                        className="shared-first-login-input mt-[25px]"
                        placeholder="Body Text"
                        value={formData.bodyText}
                        onChange={(e) => {handleFormDataChange('bodyText', e.target.value)}}
                    />
                    <div className="pl-[15px] pt-[21px] pr-[22px] pb-[40px] rounded-[5px] bg-[#1F1F1F] mt-[25px]">
                        <div className="text-left font-inter text-[16px] font-[600] text-[#FFF]">
                            Button
                        </div>
                        <div className="flex justify-end gap-[8px] items-center">
                            <span className="text-[#FFF] text-[12px] font-inter">
                                Background
                            </span>
                            <ColorPicker
                                value={formData.buttonBackgroundColor}
                                format={'hex'}
                                className="logo-color-picker"
                                onChange={(e) => {handleFormDataChange('buttonBackgroundColor', typeof colorHex === 'string' ? e : e.toHexString())}}
                            />
                            <span className="text-[#FFF] text-[12px] font-inter">
                                Hex
                            </span>
                            <Input 
                                className="w-[90px] h-[27px] px-[8px] rounded-[6px] bg-[#000] border-none text-[#FFF] font-inter text-[12px]"
                                value={formData.buttonBackgroundColor}
                            />
                        </div>
                        <div className="flex justify-end gap-[8px] items-center mt-[10px]">
                            <span className="text-[#FFF] text-[12px] font-inter">
                                Hover
                            </span>
                            <ColorPicker
                                value={formData.buttonHoverColor.toUpperCase()}
                                format={'hex'}
                                className="logo-color-picker"
                                onChange={(e) => {handleFormDataChange('buttonHoverColor', typeof colorHex === 'string' ? e : e.toHexString())}}
                            />
                            <span className="text-[#FFF] text-[12px] font-inter">
                                Hex
                            </span>
                            <Input 
                                className="w-[90px] h-[27px] px-[8px] rounded-[6px] bg-[#000] border-none text-[#FFF] font-inter text-[12px]"
                                value={formData.buttonHoverColor.toUpperCase()}
                            />
                        </div>
                    </div>
                </Col>
                <Col span={24} lg={12}>
                <div className="relative w-full h-fit rounded border-[2px] border-[#FFF] rounded-[6px] relative">
                        <img src={themeImage} alt="" className="w-full h-full min-h-[200px]"/>
                        <button 
                            className={
                                `absolute w-[108px] 
                                h-[29px] rounded-[5.3px] 
                                bottom-[9px] left-[10px] 
                                cursor-pointer
                                transition
                                `
                            }
                            style={{
                                backgroundColor: isHover ? formData.buttonHoverColor : formData.buttonBackgroundColor
                            }}
                            onPointerEnter={() => {setIsHover(true)}}
                            onPointerLeave={() => {setIsHover(false)}}
                        >
                        </button>
                        {/* LOGO */}
                        {/* <img src={} alt="" /> */}
                    </div>
                </Col>
            </Row>
        </div>
    </>
}
export default ThemeTab