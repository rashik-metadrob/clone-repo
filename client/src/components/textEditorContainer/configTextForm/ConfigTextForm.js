import { Col, ColorPicker, Input, InputNumber, Row, Select, Slider, Switch, notification } from "antd"
import { useEffect, useState } from "react"
import fonts from "../../canvasContainer/components/descriptionBoard/fonts"
import { uuidv4 } from "../../../utils/util"
import BIcon from "../../../assets/images/project/style/b.svg"
import IIcon from "../../../assets/images/project/style/i.svg"
import UIcon from "../../../assets/images/project/style/u.svg"
import LeftIcon from "../../../assets/images/project/style/left.svg"
import CenterIcon from "../../../assets/images/project/style/center.svg"
import RightIcon from "../../../assets/images/project/style/right.svg"
import NormalIcon from "../../../assets/images/project/style/normal.svg"
import LowerIcon from "../../../assets/images/project/style/lower.svg"
import UpperIcon from "../../../assets/images/project/style/upper.svg"
import { TEXT_ALIGN, TEXT_DECORATION } from "../../../utils/constants"
import SelectFont from "../selectFont/SelectFont"

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

const ConfigTextForm = ({
    selectedTextId,
    texts,
    setTexts = () => {}
}) => {
    const [textForm, setTextForm] = useState({
        font: null,
        fontSize: 10,
        color: '#000000',
        background: '#000000',
        depth: 1,
        transparency: 1,
        textAlign: TEXT_ALIGN.CENTER,
        textDecoration: TEXT_DECORATION.NORMAL,
        glow: false
    })

    useEffect(() => {
        if(texts){
            const text = texts.find(el => el.id === selectedTextId)
            if(text){
                setTextForm({...text})
            }
        }
    }, [selectedTextId])

    const onAddOrSaveText = () => {
        if(!textForm.text){
            notification.warning({
                message: "Text can't be null!"
            })
            return
        }
        if(!textForm.font){
            notification.warning({
                message: "Font can't be null!"
            })
            return
        }
        if(selectedTextId){
            const newTexts = texts.map(el => {
                if(el.id === selectedTextId){
                    el = {
                        ...textForm
                    }
                }

                return el
            })
            setTexts([...newTexts])
        } else {
            setTexts([...texts, {
                ...textForm,
                id: uuidv4()
            }])
        }
    }

    const handleFormDataChange = (type, value) => {
        setTextForm({
            ...textForm,
            [type]: value
        })
    }

    return <>
        <Row gutter={[16, 16]} className="p-[24px] items-center">
            <Col span={6} className="text-left text-label">
                Text
            </Col>
            <Col span={18}>
                <div className="flex gap-[16px] items-center">
                    <Input className="admin-form-input" value={textForm.text} onChange={(e) => {handleFormDataChange('text', e.target.value)}}/>
                    <button className="btn-add" onClick={() => {onAddOrSaveText()}}>
                        {selectedTextId ? 'Save' : 'Add'}
                    </button>
                </div>
            </Col>

            <Col span={6} className="text-left text-label">
                Font
            </Col>
            <Col span={18}>
                <Row gutter={[12, 12]}>
                    <Col span={18}>
                        <SelectFont 
                            value={textForm.font}
                            onChange={(value) => {handleFormDataChange('font', value)}} 
                        />
                    </Col>
                    <Col span={6}>
                        <InputNumber 
                            className="text-editor-input" 
                            value={textForm.fontSize} 
                            min={1}
                            onChange={(e) => {handleFormDataChange('fontSize', e || 1)}}
                        />
                    </Col>
                </Row>
            </Col>
            <Col span={6} className="text-left text-label">
                Color
            </Col>
            <Col span={18}>
                <div className="flex items-center justify-between">
                    <ColorPicker
                        // className="w-full"
                        value={textForm.color}
                        format={'hex'}
                        onChange={(e) => {handleFormDataChange('color', typeof colorHex === 'string' ? e : e.toHexString())}}
                    />

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
                        <div className={`style-item ${textForm.textAlign === TEXT_ALIGN.LEFT ? 'active' : ''}`} onClick={() => {handleFormDataChange('textAlign', TEXT_ALIGN.LEFT)}}>
                            <img src={LeftIcon} alt="" />
                        </div>
                        <div className={`style-item ${textForm.textAlign === TEXT_ALIGN.CENTER ? 'active' : ''}`} onClick={() => {handleFormDataChange('textAlign', TEXT_ALIGN.CENTER)}}>
                            <img src={CenterIcon} alt="" />
                        </div>
                        <div className={`style-item ${textForm.textAlign === TEXT_ALIGN.RIGHT ? 'active' : ''}`} onClick={() => {handleFormDataChange('textAlign', TEXT_ALIGN.RIGHT)}}>
                            <img src={RightIcon} alt="" />
                        </div>
                    </div>
                </div>
            </Col>
            <Col span={6} className="text-left text-label">
                Background
            </Col>
            <Col span={18}>
                <div className="flex items-center justify-between">
                    <ColorPicker
                        value={textForm.background}
                        format={'hex'}
                        onChange={(e) => {handleFormDataChange('background', typeof colorHex === 'string' ? e : e.toHexString())}}
                    />

                    <div className="flex items-center gap-[12px]">
                        <div className="text-label">
                            Glow
                        </div>
                        <Switch checked={textForm.glow} onChange={(e) => {handleFormDataChange('glow', e)}}/>
                    </div>

                    <div className="style-container">
                        <div className={`style-item ${textForm.textDecoration === TEXT_DECORATION.NORMAL ? 'active' : ''}`} onClick={() => {handleFormDataChange('textDecoration', TEXT_DECORATION.NORMAL)}}>
                            <img src={NormalIcon} alt="" />
                        </div>
                        <div className={`style-item ${textForm.textDecoration === TEXT_DECORATION.LOWERCASE ? 'active' : ''}`} onClick={() => {handleFormDataChange('textDecoration', TEXT_DECORATION.LOWERCASE)}}>
                            <img src={LowerIcon} alt="" />
                        </div>
                        <div className={`style-item ${textForm.textDecoration === TEXT_DECORATION.UPPERCASE ? 'active' : ''}`} onClick={() => {handleFormDataChange('textDecoration', TEXT_DECORATION.UPPERCASE)}}>
                            <img src={UpperIcon} alt="" />
                        </div>
                    </div>
                </div>
            </Col>
            <Col span={6} className="text-left text-label">
                Transparency
            </Col>
            <Col span={18}>
                <div className="flex items-center gap-[12px]">
                    <Slider
                        min={0.01}
                        max={1}
                        value={textForm.transparency}
                        step={0.01}
                        onChange={(e) => {handleFormDataChange('transparency', e)}}
                        trackStyle={{
                            background: "#FFFFFF"
                        }}
                        railStyle={{
                            background: "rgba(0, 0, 0, 0.30)"
                        }}
                        className="flex-auto"
                    />
                    <InputNumber
                        min={0.01}
                        max={1}
                        step={0.01}
                        value={textForm.transparency}
                        onChange={(e) => {handleFormDataChange('transparency', e)}}
                        className="text-editor-input !w-[100px]"
                    />
                </div>
            </Col>
            <Col span={6} className="text-left text-label">
                Depth
            </Col>
            <Col span={18}>
                <div className="flex items-center gap-[12px]">
                    <Slider
                        min={0.01}
                        max={10}
                        value={textForm.depth}
                        step={0.1}
                        onChange={(e) => {handleFormDataChange('depth', e)}}
                        trackStyle={{
                            background: "#FFFFFF"
                        }}
                        railStyle={{
                            background: "rgba(0, 0, 0, 0.30)"
                        }}
                        className="flex-auto"
                    />
                    <InputNumber
                        min={0.01}
                        max={10}
                        step={0.1}
                        value={textForm.depth}
                        onChange={(e) => {handleFormDataChange('depth', e)}}
                        className="text-editor-input !w-[100px]"
                    />
                </div>
            </Col>
        </Row>
    </>
}
export default ConfigTextForm