import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./styles.scss"
import { Checkbox, Col, Collapse, InputNumber, Row, Select, Slider, ColorPicker } from "antd";
import { EDITOR_MATERIAL_KEYS, MATERIAL_VALUE_TYPES } from "../../../../../utils/constants";
import { Color, NoColorSpace } from "three";
import { useDispatch, useSelector } from "react-redux";
import { getDecorativeEditorMaterials, getDecorativeSelectedMaterial, setDecorativeEditorMaterials } from "../../../../../redux/decorativeEditorSlice";

const DecorativeMaterialEditorAdmin = forwardRef((
    {
        onSelectedMaterialChange = () => {}
    },
    ref
) => {
    const dispatch = useDispatch()
    const selectedMaterial = useSelector(getDecorativeSelectedMaterial)
    const editorMaterials = useSelector(getDecorativeEditorMaterials)
    const materialRef = useRef()

    useImperativeHandle(ref, () => ({
        loadMaterials: (mats) => {
            materialRef.current = mats

            let saveMaterials = {}

            Object.keys(mats).forEach(el => {
                let atrKeys = Object.keys(mats[el])
                saveMaterials[el] = {
                    name: mats[el].name
                }
                atrKeys.filter(k => EDITOR_MATERIAL_KEYS.find(o => o.key === k)).forEach(atrr => {
                    let atrInfo = EDITOR_MATERIAL_KEYS.find(o => o.key === atrr)
                    if(atrInfo.valueType === MATERIAL_VALUE_TYPES.COLOR){
                        saveMaterials[el][atrr] = {r: mats[el][atrr].r * 255, g: mats[el][atrr].g * 255, b: mats[el][atrr].b * 255}
                    } else {
                        saveMaterials[el][atrr] = mats[el][atrr]
                    }
                })
            })
            dispatch(setDecorativeEditorMaterials({
                ...saveMaterials
            }))
            if(mats && Object.keys(mats).length > 0){
                let keys = Object.keys(mats)
                onSelectedMaterialChange(mats[keys[0]].name)
            }
        }
    }));

    const onMaterialValueChange = (key, value, type) => {
        if(type === MATERIAL_VALUE_TYPES.COLOR){
            if(typeof value === "string"){
                return
            }

            let newColor = new Color().setRGB(value.metaColor.r / 255, value.metaColor.g / 255, value.metaColor.b / 255, NoColorSpace)

            dispatch(setDecorativeEditorMaterials({
                ...editorMaterials,
                [selectedMaterial]: {
                    ...editorMaterials[selectedMaterial],
                    [key]: {r: value.metaColor.r, g: value.metaColor.g, b: value.metaColor.b}
                }
            }))
    
            if(materialRef.current[selectedMaterial]){
                materialRef.current[selectedMaterial][key] = newColor;
                materialRef.current[selectedMaterial].needsUpdate = true;
            }
        } else {
            dispatch(setDecorativeEditorMaterials({
                ...editorMaterials,
                [selectedMaterial]: {
                    ...editorMaterials[selectedMaterial],
                    [key]: value
                }
            }))
    
            if(materialRef.current[selectedMaterial]){
                materialRef.current[selectedMaterial][key] = value;
                materialRef.current[selectedMaterial].needsUpdate = true;
            }
        }
    }

    const formatMaterialName = (name) => {
        let nameArr = name.split("_")
        nameArr = nameArr.map(el => {
            if(el.toLowerCase() === "mt"){
                el = "Material"
            }
            if(el.charAt(0)){
                el = el.toLowerCase()
                el = el.charAt(0).toUpperCase() + el.slice(1);
            }

            return el
        })
        let newName = nameArr.join(" ")

        return newName
    }

    const componentToHex = (c) => {
        var hex = parseInt(c.toString()).toString(16);
        return (hex.length === 1 ? "0" + hex : hex).toLocaleUpperCase();
    }

    const rgbToHex = (r, g, b) => {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    return <>
        <div
            className="flex-auto h-full overflow-y-auto decorative-materials-editor-admin"
        >
            <div className="select-material-container">
                <div className="flex jusftify-between flex-nowrap items-center gap-[24px]">
                    <span className="text-material">
                        Material
                    </span>
                    <div className="flex-auto">
                        <Select 
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={selectedMaterial}
                            onChange={(value) => {onSelectedMaterialChange(value)}}
                            className="w-full material-select"
                            options={
                                Object.keys(editorMaterials).map(el => {
                                return {
                                    label: formatMaterialName(editorMaterials[el].name),
                                    value: editorMaterials[el].name
                                }
                            })}
                        />
                    </div>
                </div>
            </div>
            <div className="material-control-container">
                {
                    selectedMaterial && editorMaterials[selectedMaterial] &&
                    Object.keys(editorMaterials[selectedMaterial]).filter(el => EDITOR_MATERIAL_KEYS.find(m => m.key === el)).map((el, index) => {
                        let controlInfo = EDITOR_MATERIAL_KEYS.find(m => m.key === el)
                        
                        return <>
                            <Row gutter={8} key={el} className="items-center">
                                {
                                    controlInfo.valueType !== MATERIAL_VALUE_TYPES.TEXTURE &&
                                    <Col span={8} className="text-left text-control-label">
                                        {controlInfo.name}
                                    </Col>
                                }
                                {
                                    controlInfo.valueType !== MATERIAL_VALUE_TYPES.TEXTURE &&
                                    <Col span={16}>
                                        {
                                            controlInfo.valueType === MATERIAL_VALUE_TYPES.BOOL &&
                                            <div className="flex items-center justify-start">
                                                <Checkbox 
                                                    checked={editorMaterials[selectedMaterial][el]}
                                                    onChange={(e) => {onMaterialValueChange(el, e.target.checked)}}
                                                />
                                            </div>
                                        }
                                        {
                                            controlInfo.valueType === MATERIAL_VALUE_TYPES.NUMBER &&
                                            <>
                                                <div className="flex gap-[12px] flex-nowrap items-center">
                                                    <Slider
                                                        min={controlInfo.min}
                                                        max={controlInfo.max}
                                                        step={controlInfo.step}
                                                        className="w-full material-slider"
                                                        onChange={(value) => {onMaterialValueChange(el, value)}}
                                                        value={editorMaterials[selectedMaterial][el]}
                                                    />
                                                    <InputNumber
                                                        min={controlInfo.min}
                                                        max={controlInfo.max}
                                                        step={controlInfo.step}
                                                        className="w-[44px] material-number-input"
                                                        value={editorMaterials[selectedMaterial][el]}
                                                        onChange={(value) => {onMaterialValueChange(el, value)}}
                                                    />
                                                </div>
                                            </>
                                        }
                                        {
                                            controlInfo.valueType === MATERIAL_VALUE_TYPES.SELECT &&
                                            <Select 
                                                className="w-full material-select"
                                                value={editorMaterials[selectedMaterial][el]}
                                                options={controlInfo.options}
                                                onChange={(e) => {onMaterialValueChange(el, e)}}
                                            />
                                        }
                                        {
                                            controlInfo.valueType === MATERIAL_VALUE_TYPES.COLOR &&
                                            <div className="flex items-center justify-start">
                                                <ColorPicker
                                                    className="material-color-picker"
                                                    value={`rgb(${editorMaterials[selectedMaterial][el].r}, ${editorMaterials[selectedMaterial][el].g}, ${editorMaterials[selectedMaterial][el].b})`}
                                                    format={'rgb'}
                                                    onChange={(e) => {onMaterialValueChange(el, e, MATERIAL_VALUE_TYPES.COLOR)}}
                                                />
                                                <span className="color-text ml-[9px]">
                                                    {
                                                        rgbToHex(editorMaterials[selectedMaterial][el].r, editorMaterials[selectedMaterial][el].g, editorMaterials[selectedMaterial][el].b)
                                                    }
                                                </span>
                                            </div>
                                        }
                                    </Col>
                                }
                            </Row>
                        </>
                    })
                }
            </div>
        </div>
    </>
})

export default DecorativeMaterialEditorAdmin