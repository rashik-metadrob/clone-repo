import { Col, ColorPicker, Input, InputNumber, Row, Select, notification } from "antd"
import "./styles.scss"
import TextEditorCanvasContainer from "./textEditorCanvasContainer/TextEditorCanvasContainer"
import { useEffect, useRef, useState } from "react"
import { uuidv4 } from "../../utils/util"
import ArrowIcon from "../../assets/images/products/arrow.svg"
import fonts from "../canvasContainer/components/descriptionBoard/fonts"
import closeIcon from "../../assets/images/project/close.svg"
import ConfigTextForm from "./configTextForm/ConfigTextForm"
import _ from "lodash"

const TextEditorContainer = ({
    item,
    onSave = () => {}
}) => {
    const [texts, setTexts] = useState([])
    const [selectedTextId, setSelectedTextId] = useState()
    const canvasContainer = useRef()

    useEffect(() => {
        setTexts(_.get(item, ['texts'], []))
    }, [item])

    const onSelectText = (id) => {
        if(selectedTextId === id){
            setSelectedTextId()
        } else {
            setSelectedTextId(id)
        }
    }

    const onDeleteText = (e, id) => {
        e.stopPropagation()
        setTexts([...texts.filter(el => el.id !== id)])
        if(selectedTextId === id){
            setSelectedTextId()
        }
    }

    const onSaveText = () => {
        if(texts.length === 0){
            notification.warning({
                message: "Text can't be null!"
            })

            return
        }
        canvasContainer.current.getCanvasPicture().then(rs => {
            onSave({
                image: rs,
                texts: canvasContainer.current.getTextsInfo()
            })
        })
       
    }
    
    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 h-full text-editor-container">
            <Col lg={14} md={24} sm={24} xs={24} className="!p-0 h-[500px] rounded-[5px] border-[#FFF] border-[1px]">
                <TextEditorCanvasContainer texts={texts} ref={canvasContainer}/>
            </Col>
            <Col lg={10} md={24} sm={24} xs={24} className="h-full">
                <div className="p-[16px] w-full h-[200px] overflow-y-auto flex flex-col gap-[8px] rounded-[5px] border-[#FFF] border-[1px]">
                    {
                        texts.map(el => (
                            <div key={el.id} className={`text-item ${selectedTextId === el.id ? 'active' : ''}`} onClick={() => {onSelectText(el.id)}}>
                                <span>{el.text}</span>
                                <img src={closeIcon} alt="" onClick={(e) => {onDeleteText(e, el.id)}}/>
                            </div>
                        ))
                    }
                </div>
                <div>
                    <ConfigTextForm selectedTextId={selectedTextId} texts={texts} setTexts={setTexts}/>
                </div>
                <div className="mt-[24px]">
                    <button className="btn-add w-full" onClick={() => {onSaveText()}}>
                        Save
                    </button>
                </div>
            </Col>
        </Row>
    </>
}

export default TextEditorContainer