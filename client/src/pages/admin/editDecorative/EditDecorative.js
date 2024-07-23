import { Col, Input, Row } from "antd"
import "./styles.scss"
import AutosavingIcon from "../../../assets/images/project/auto.svg"
import EditDecorativeCanvasContainer from "./components/editDecorativeCanvasContainer/EditDecorativeCanvasContainer"
import { useEffect, useRef, useState } from "react"
import DecorativeHdriCollapse from "./components/decorativeHdriCollapse/DecorativeHdriCollapse"
import EditNameIcon from "../../../assets/images/admin/edit-name.svg"
import DecorativeMaterialEditorAdmin from "./components/decorativeMaterialEditorAdmin/DecorativeMaterialEditorAdmin"
import { useDispatch, useSelector } from "react-redux"
import { getDecorative, getDecorativeSelectedMaterial, setDecorative, setDecorativeSelectedMaterial } from "../../../redux/decorativeEditorSlice"
import { getProductById } from "../../../api/product.api"
import { useParams } from "react-router-dom"

const EditDecorative = () => {
    const dispatch = useDispatch()
    const materialsEditorRef = useRef()
    const canvasContainerRef = useRef()
    const {id: decorativeId} = useParams()
    const decorative = useSelector(getDecorative)
    const decorativeSelectedMaterial = useSelector(getDecorativeSelectedMaterial)

    useEffect(() => {
        getProductById(decorativeId).then(rs => {
            dispatch(setDecorative(rs))
        })
    }, [decorativeId])

    useEffect(() => {
        onSelectMaterial(decorativeSelectedMaterial)
    }, [decorativeSelectedMaterial])

    const onLoadMaterials = (materials) => {
        materialsEditorRef.current.loadMaterials(materials)
    }

    const onSelectedMaterialChange = (value) => {
        dispatch(setDecorativeSelectedMaterial(value))
    }

    const onSelectMaterial = (materialName) => {
        canvasContainerRef.current.highlightMaterial(materialName)
    }

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 h-full edit-decorative-container bg-[#F3F3F3]">
            <Col lg={17} md={17} sm={24} xs={24} className="!p-0 h-full">
                <EditDecorativeCanvasContainer onLoadMaterials={(m) => {onLoadMaterials(m)}} ref={canvasContainerRef} decorative={decorative}/>
            </Col>
            <Col lg={7} md={7} sm={24} xs={24} className="!p-0 h-full flex flex-col overflow-y-auto bg-[rgba(0,0,0,0.2)]">
                <div className="p-[24px] flex flex-col h-full">
                    <DecorativeHdriCollapse />
                    <hr className="mt-[16px] mb-[16px]"/>
                    <div className="w-full pl-[16px] flex gap-[12px] items-center">
                        <div className="font-inter font-[600] text-[16px] leading-[19.36px] text-[#FFF]">
                            Name:
                        </div>
                        <div className="flex-auto rounded-[5px]">
                            <Input 
                                className="input-name" 
                                addonAfter={<div className="w-[14px]"><img src={EditNameIcon} alt="" className="w-[14px] h-[14px]"/></div>}
                                value={decorative?.name}
                            />
                        </div>
                    </div>
                    <div className="flex-auto flex flex-col pt-[12px] pb-[24px]">
                        <DecorativeMaterialEditorAdmin ref={materialsEditorRef} onSelectedMaterialChange={(value) => {onSelectedMaterialChange(value)}}/>
                    </div>
                </div>
            </Col>
        </Row>
    </>
}
export default EditDecorative