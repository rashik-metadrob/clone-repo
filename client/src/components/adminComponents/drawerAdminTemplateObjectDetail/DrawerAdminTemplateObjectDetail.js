import { Checkbox, Col, ColorPicker, Drawer, Input, InputNumber, Row, Select, Slider } from "antd"
import ExitIcon from "../../../assets/images/project/exit.svg"
import ResetEditorIcon from "../../../assets/images/project/reset-editor.svg"
import "./styles.scss"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { useAppDispatch } from "../../../redux"
import { useSelector } from "react-redux"
import { getEditorMaterials, getSetSelectedMaterial, setEditorMaterials } from "../../../redux/modelSlice"
import { EDITOR_MATERIAL_KEYS, MATERIAL_VALUE_TYPES } from "../../../utils/constants"
import { Color, NoColorSpace } from "three"
import AdminTemplateAnimationCollapse from "./components/adminTemplateAnimationCollapse/AdminTemplateAnimationCollapse"

const DrawerAdminTemplateObjectDetail = forwardRef(({
        onSelectedMaterialChange = () => {},
        open,
        onClose = () => {}
    }, 
    ref
) => {
    const dispatch = useAppDispatch()
    const selectedMaterial = useSelector(getSetSelectedMaterial)
    const editorMaterials = useSelector(getEditorMaterials)
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
            dispatch(setEditorMaterials({
                ...saveMaterials
            }))
            // if(mats && Object.keys(mats).length > 0){
            //     let keys = Object.keys(mats)
            //     onSelectedMaterialChange(mats[keys[0]].name)
            // }
        }
    }));

    const onMaterialValueChange = (key, value, type) => {
        if(type === MATERIAL_VALUE_TYPES.COLOR){
            if(typeof value === "string"){
                return
            }

            let newColor = new Color().setRGB(value.metaColor.r / 255, value.metaColor.g / 255, value.metaColor.b / 255, NoColorSpace)

            dispatch(setEditorMaterials({
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
            dispatch(setEditorMaterials({
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

    function componentToHex(c) {
        if(!c) {
            return "0"
        }
        var hex = Math.round(+c).toString(16);
        return (hex.length === 1 ? "0" + hex : hex).toUpperCase();
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    return <>
        <Drawer
            title={null}
            placement="right"
            closable={false}
            onClose={() => {onClose()}}
            open={open}
            className="drawer-admin-template-object-detail"
            width={513}
            mask={false}
        >
            <div className="drawer-admin-template-object-detail-container">
                <div className="drawer-title-container">
                    <div className="title">
                        Object Details
                    </div>
                    <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                        <img src={ExitIcon} alt="" />
                        <div className="text-close">Close</div>
                    </div>
                </div>
                <div className="drawer-content-wrap pb-[20px]">
                    <div className="drawer-content-container">
                        <div>
                            <Select 
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                value={selectedMaterial}
                                onChange={(value) => {onSelectedMaterialChange(value)}}
                                className="admin-form-select w-full !h-[30px]"
                                popupClassName="admin-form-select-popup"
                                options={
                                    Object.keys(editorMaterials).map(el => {
                                    return {
                                        label: formatMaterialName(editorMaterials[el].name),
                                        value: editorMaterials[el].name
                                    }
                                })}
                            />
                        </div>
                        { selectedMaterial && <div className="material-color-editor-container mt-[20px]">
                            <Row gutter={[16, 16]} className="items-center">
                                <Col span={8} className="text-left">
                                    Color Change
                                </Col>
                                <Col span={16}>
                                    <div className="flex justify-center gap-[10px] items-center">
                                        <ColorPicker
                                            className="w-full material-color-picker"
                                            value={`rgb(${editorMaterials[selectedMaterial]['color'].r}, ${editorMaterials[selectedMaterial]['color'].g}, ${editorMaterials[selectedMaterial]['color'].b})`}
                                            format={'rgb'}
                                            onChange={(e) => {onMaterialValueChange('color', e, MATERIAL_VALUE_TYPES.COLOR)}}
                                        />
                                        <span className="text-left">
                                            Hex
                                        </span>
                                        <Input
                                            className="w-[100px] admin-form-input"
                                            value={rgbToHex(editorMaterials[selectedMaterial]['color'].r, editorMaterials[selectedMaterial]['color'].g, editorMaterials[selectedMaterial]['color'].b)}
                                            disabled
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>}
                        <div className="material-editor-container mt-[20px]">
                        {
                                selectedMaterial && editorMaterials[selectedMaterial] &&
                                Object.keys(editorMaterials[selectedMaterial]).filter(el => EDITOR_MATERIAL_KEYS.find(m => m.key === el && m.key !== "emissiveMap" && m.key !== "color")).map((el, index) => {
                                    let controlInfo = EDITOR_MATERIAL_KEYS.find(m => m.key === el)
                                    
                                    return <>
                                        <Row gutter={[16, 16]} key={el} className="items-center">
                                            {
                                                controlInfo.valueType !== MATERIAL_VALUE_TYPES.TEXTURE &&
                                                <Col span={8} className="text-left">
                                                    {controlInfo.name}
                                                </Col>
                                            }
                                            {
                                                controlInfo.valueType !== MATERIAL_VALUE_TYPES.TEXTURE &&
                                                <Col span={16}>
                                                    {
                                                        controlInfo.valueType === MATERIAL_VALUE_TYPES.BOOL &&
                                                        <div className="flex justify-center items-center">
                                                            <Checkbox 
                                                                className="admin-material-checkbox"
                                                                checked={editorMaterials[selectedMaterial][el]}
                                                                onChange={(e) => {onMaterialValueChange(el, e.target.checked)}}
                                                            />
                                                        </div>
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
                                                                    value={editorMaterials[selectedMaterial][el]}
                                                                />
                                                                <InputNumber
                                                                    min={controlInfo.min}
                                                                    max={controlInfo.max}
                                                                    step={controlInfo.step}
                                                                    className="w-[100px] admin-form-input"
                                                                    value={editorMaterials[selectedMaterial][el]}
                                                                    onChange={(value) => {onMaterialValueChange(el, value)}}
                                                                />
                                                                <img src={ResetEditorIcon} alt="" className="cursor-pointer" onClick={() => {onMaterialValueChange(el, 1)}}/>
                                                            </div>
                                                        </>
                                                    }
                                                    {
                                                        controlInfo.valueType === MATERIAL_VALUE_TYPES.SELECT &&
                                                        <Select 
                                                            className="admin-form-select w-full"
                                                            popupClassName="admin-form-select-popup"
                                                            value={editorMaterials[selectedMaterial][el]}
                                                            options={controlInfo.options}
                                                            onChange={(e) => {onMaterialValueChange(el, e)}}
                                                        />
                                                    }
                                                    {
                                                        controlInfo.valueType === MATERIAL_VALUE_TYPES.COLOR &&
                                                        <div className="flex justify-center gap-[10px] items-center">
                                                            <ColorPicker
                                                                className="w-full material-color-picker"
                                                                value={`rgb(${editorMaterials[selectedMaterial][el].r}, ${editorMaterials[selectedMaterial][el].g}, ${editorMaterials[selectedMaterial][el].b})`}
                                                                format={'rgb'}
                                                                onChange={(e) => {onMaterialValueChange(el, e, MATERIAL_VALUE_TYPES.COLOR)}}
                                                            />
                                                            <span className="text-left">
                                                                Hex
                                                            </span>
                                                            <Input
                                                                className="w-[100px] admin-form-input"
                                                                value={rgbToHex(editorMaterials[selectedMaterial][el].r, editorMaterials[selectedMaterial][el].g, editorMaterials[selectedMaterial][el].b)}
                                                                disabled
                                                            />
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
                    <div className="mt-[20px] material-editor-divider"></div>
                    <div className="mt-[20px] px-[15px]">
                        <AdminTemplateAnimationCollapse />
                    </div>
                </div>
            </div>
        </Drawer>
    </>
})
export default DrawerAdminTemplateObjectDetail