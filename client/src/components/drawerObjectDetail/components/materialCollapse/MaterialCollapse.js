import { Checkbox, Col, Collapse, ColorPicker, Input, InputNumber, Row, Select, Slider } from "antd";
import "./styles.scss"

import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"
import { useEffect, useRef, useState } from "react";
import { buildGraph, apllyTexture } from "../../../../utils/util";
import { EDITOR_MATERIAL_KEYS, MATERIAL_VALUE_TYPES } from "../../../../utils/constants";
import ArrowIcon from "../../../../assets/images/products/arrow.svg"
import { Color, NoColorSpace } from "three";
import SelectTexture from "../../../selectTexture/SelectTexture";
import _ from "lodash";
import { setObjectEditorMaterials } from "../../../../redux/modelSlice";

const MaterialCollapse = ({
    scene,
    selectedObject,
    onMaterialChange = () => {},
    savedElementMaterials,
    objectDetail,
    objectEditorMaterials,
    dispatch
}) => {
    const [selectedMaterial, setSelectedMaterial] = useState("")
    const materialRef = useRef()
    
    useEffect(() => {
        return () => {
            if(materialRef.current){
                Object.keys(materialRef.current).forEach(el => {
                    materialRef.current[el].dispose()
                })

                materialRef.current = undefined
            }
        }
    },[materialRef])

    useEffect(() => {
        const object = scene.getObjectByName(`prod-${selectedObject}`)
        if(object){
            const materials = buildGraph(object)
            loadMaterials(materials.materials)
        }
    }, [selectedObject, objectDetail?.selectedGalleryId, scene, savedElementMaterials])

    const loadMaterials = (mats) => {
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
                } else if(atrInfo.valueType === MATERIAL_VALUE_TYPES.TEXTURE){
                    saveMaterials[el][atrr] = _.get(savedElementMaterials, [el, atrr, 'value'], null)
                } else {
                    saveMaterials[el][atrr] = mats[el][atrr]
                }
            })
        })
        
        dispatch(setObjectEditorMaterials({...saveMaterials}))
        if(mats && Object.keys(mats).length > 0){
            let keys = Object.keys(mats)
            const names = keys.map(el => mats[el].name)
            if(!selectedMaterial || !names.includes(selectedMaterial)){
                setSelectedMaterial(mats[keys[0]].name)
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

    const onMaterialValueChange = (key, value, type) => {
        let newEditorMaterials = {...objectEditorMaterials}
        if(type === MATERIAL_VALUE_TYPES.COLOR){
            if(typeof value === "string"){
                return
            }

            let newColor = new Color().setRGB(value.metaColor.r / 255, value.metaColor.g / 255, value.metaColor.b / 255, NoColorSpace)

            newEditorMaterials = {
                ...objectEditorMaterials,
                [selectedMaterial]: {
                    ...objectEditorMaterials[selectedMaterial],
                    [key]: {r: value.metaColor.r, g: value.metaColor.g, b: value.metaColor.b}
                }
            }
    
            if(materialRef.current[selectedMaterial]){
                materialRef.current[selectedMaterial][key] = newColor;
                materialRef.current[selectedMaterial].needsUpdate = true;
            }
        } else if(type === MATERIAL_VALUE_TYPES.TEXTURE){
            newEditorMaterials = {
                ...objectEditorMaterials,
                [selectedMaterial]: {
                    ...objectEditorMaterials[selectedMaterial],
                    [key]: value
                }
            }
    
            if(materialRef.current[selectedMaterial]){
                // TODO: Load texture
                // materialRef.current[selectedMaterial][key] = value;
                apllyTexture(materialRef.current[selectedMaterial], value)
                materialRef.current[selectedMaterial].needsUpdate = true;
            }
        } else {
            newEditorMaterials = {
                ...objectEditorMaterials,
                [selectedMaterial]: {
                    ...objectEditorMaterials[selectedMaterial],
                    [key]: value
                }
            }
    
            if(materialRef.current[selectedMaterial]){
                materialRef.current[selectedMaterial][key] = value;
                materialRef.current[selectedMaterial].needsUpdate = true;
            }
        }
        dispatch(setObjectEditorMaterials({...newEditorMaterials}))

        onMaterialChange(newEditorMaterials)
    }

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
                        <div className="material-collapse-content">
                            <Select
                                placeholder="Select material"
                                className="admin-form-select w-full"
                                popupClassName="admin-form-select-popup"
                                showSearch
                                suffixIcon={<img src={ArrowIcon} alt="" />}
                                value={selectedMaterial}
                                onChange={(value) => {setSelectedMaterial(value)}} 
                                options={Object.keys(objectEditorMaterials).map(el => {
                                    return {
                                        label: formatMaterialName(objectEditorMaterials[el].name),
                                        value: objectEditorMaterials[el].name
                                    }
                                })}
                            />
                            <div className="material-control-container">
                                {
                                    selectedMaterial && objectEditorMaterials[selectedMaterial] &&
                                    Object.keys(objectEditorMaterials[selectedMaterial]).filter(el => EDITOR_MATERIAL_KEYS.find(m => m.key === el)).map((el, index) => {
                                        let controlInfo = EDITOR_MATERIAL_KEYS.find(m => m.key === el)
                                        
                                        return <>
                                            <Row gutter={8} key={el}>
                                                <Col span={8} className="text-left">
                                                    {controlInfo.name}
                                                </Col>
                                                <Col span={16}>
                                                    {
                                                        controlInfo.valueType === MATERIAL_VALUE_TYPES.BOOL &&
                                                        <Checkbox 
                                                            checked={objectEditorMaterials[selectedMaterial][el]}
                                                            onChange={(e) => {onMaterialValueChange(el, e.target.checked)}}
                                                        />
                                                    }
                                                    {
                                                        controlInfo.valueType === MATERIAL_VALUE_TYPES.NUMBER &&
                                                        <>
                                                            <div className="flex gap-[12px] flex-nowrap">
                                                                <Slider
                                                                    min={controlInfo.min}
                                                                    max={controlInfo.max}
                                                                    step={controlInfo.step}
                                                                    className="w-full admin-form-slider"
                                                                    onChange={(value) => {onMaterialValueChange(el, value)}}
                                                                    value={objectEditorMaterials[selectedMaterial][el]}
                                                                />
                                                                <InputNumber
                                                                    min={controlInfo.min}
                                                                    max={controlInfo.max}
                                                                    step={controlInfo.step}
                                                                    className="w-[100px] admin-form-input"
                                                                    value={objectEditorMaterials[selectedMaterial][el]}
                                                                    onChange={(value) => {onMaterialValueChange(el, value)}}
                                                                />
                                                            </div>
                                                        </>
                                                    }
                                                    {
                                                        controlInfo.valueType === MATERIAL_VALUE_TYPES.SELECT &&
                                                        <Select 
                                                            className="admin-form-select w-full"
                                                            popupClassName="admin-form-select-popup"
                                                            value={objectEditorMaterials[selectedMaterial][el]}
                                                            options={controlInfo.options}
                                                            onChange={(e) => {onMaterialValueChange(el, e)}}
                                                        />
                                                    }
                                                    {
                                                        controlInfo.valueType === MATERIAL_VALUE_TYPES.COLOR &&
                                                        <ColorPicker
                                                            className="w-full"
                                                            value={`rgb(${objectEditorMaterials[selectedMaterial][el].r}, ${objectEditorMaterials[selectedMaterial][el].g}, ${objectEditorMaterials[selectedMaterial][el].b})`}
                                                            format={'rgb'}
                                                            onChange={(e) => {onMaterialValueChange(el, e, MATERIAL_VALUE_TYPES.COLOR)}}
                                                        />
                                                    }
                                                    {
                                                        controlInfo.valueType === MATERIAL_VALUE_TYPES.TEXTURE &&
                                                        // <ColorPicker
                                                        //     className="w-full"
                                                        //     value={`rgb(${objectEditorMaterials[selectedMaterial][el].r}, ${objectEditorMaterials[selectedMaterial][el].g}, ${objectEditorMaterials[selectedMaterial][el].b})`}
                                                        //     format={'rgb'}
                                                        //     onChange={(e) => {onMaterialValueChange(el, e, MATERIAL_VALUE_TYPES.COLOR)}}
                                                        // />
                                                        <SelectTexture 
                                                            value={objectEditorMaterials[selectedMaterial][el]}
                                                            onChange={(e) => {onMaterialValueChange(el, e, MATERIAL_VALUE_TYPES.TEXTURE)}}
                                                        />
                                                    }
                                                </Col>
                                            </Row>
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
export default MaterialCollapse;