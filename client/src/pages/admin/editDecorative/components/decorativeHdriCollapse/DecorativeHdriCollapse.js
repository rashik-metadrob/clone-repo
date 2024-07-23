import { Col, Collapse, Input, InputNumber, Row, Select, Slider, notification } from "antd"
import ArrowDownIcon from "../../../../../assets/images/project/arrow-down.svg"
import "./styles.scss"
import { useEffect, useRef, useState } from "react"
import { getAssetsUrl } from "../../../../../utils/util"
import HdriDefaultThumnailImage from "../../../../../assets/images/admin/hdri-default-thumnail.png"
import UploadImageIcon from "../../../../../assets/icons/UploadImage"
import { HDRI } from "../../../../../utils/constants"
import ArrowIcon from "../../../../../assets/images/products/arrow.svg"
import UploadImage from "../../../../../assets/icons/UploadImage"
import UploadFile from "../../../../../components/uploadFile/UploadFile"
import hdriApi from "../../../../../api/hdri.api"
import { uploadFile } from "../../../../../api/upload.api"
import ModalAddEditHdri from "../../../../../components/adminComponents/modalAddEditHdri/ModalAddEditHdri"
import { useDispatch, useSelector } from "react-redux"
import { getDecorativeSelectedHdriOfAdminTemplate, getDecorativeTemplateToneMappingExposure, setDecorativeSelectedHdriOfAdminTemplate, setDecorativeTemplateToneMappingExposure } from "../../../../../redux/decorativeEditorSlice"
import _ from "lodash"

const DecorativeHdriCollapse = () => {
    const dispatch = useDispatch()
    const [isShowSelectHDRI, setIsShowSelectHDRI] = useState(false)
    const [listHDRi, setListHDRi] = useState([])
    const [isShowModalAdd , setIsShowModalAdd] = useState(false)
    const decorativeSelectedHdriOfAdminTemplate = useSelector(getDecorativeSelectedHdriOfAdminTemplate)

    const decorativeTemplateToneMappingExposure = useSelector(getDecorativeTemplateToneMappingExposure)

    useEffect(() => {
        loadListHdri(true)
    }, [])

    const loadListHdri = (isSetSelected = false) => {
        hdriApi.getAllHdri({ isOnlyNonDisable: true }).then(data => {
            if(data && data.length > 0){
                const newList = [
                    ...data.map(el => {
                        return {
                            label: el.name,
                            thumnail: el.thumnail ?? "",
                            value: el.id
                        }
                    }),
                ]

                if(isSetSelected && newList.length > 0){
                    dispatch(setDecorativeSelectedHdriOfAdminTemplate(newList[0].value))
                }

                setListHDRi(newList)
            }
        })
    }

    const onHdriChange = (value) => {
        setIsShowSelectHDRI(false)
        if(value.value !== HDRI.CUSTOM){
            dispatch(setDecorativeSelectedHdriOfAdminTemplate(value.value))
        }
    }

    const onToneExposureChange = (value) => {
        dispatch(setDecorativeTemplateToneMappingExposure(value))
    }

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['']}
            bordered={false}
            className="decorative-hdri-collapse-container w-full"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <span>
                        HDRI
                    </span>,
                    children: <>
                        <div className="decorative-hdri-collapse-container-content">
                            <Row gutter={[16, 16]} className="items-center">
                                <Col span={24}>
                                    <Select
                                        placeholder="Select HDRI"
                                        className="edit-decorative-form-select w-full"
                                        popupClassName="admin-form-select-popup-with-image"
                                        dropdownRender={() => (
                                            <>
                                                <div className="popup-content">
                                                    {
                                                        listHDRi.map(el => (
                                                            <div className="item" onClick={(e) => {onHdriChange(el)}}>
                                                                <div className="image-container">
                                                                    <img src={el.thumnail ? getAssetsUrl(el.thumnail) : HdriDefaultThumnailImage} alt="" className="w-[89px] h-[64px]"/>
                                                                </div>
                                                                <span>
                                                                    {el.label}
                                                                </span>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </>
                                        )}
                                        suffixIcon={<img src={ArrowIcon} alt="" />}
                                        options={listHDRi}
                                        value={decorativeSelectedHdriOfAdminTemplate}
                                        open={isShowSelectHDRI}
                                        onDropdownVisibleChange={(open) => {setIsShowSelectHDRI(open)}}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className="hdri-preview">
                                        <img src={_.get(listHDRi.find(el => el.value === decorativeSelectedHdriOfAdminTemplate), ['thumnail'], null) ? getAssetsUrl(_.get(listHDRi.find(el => el.value === decorativeSelectedHdriOfAdminTemplate), ['thumnail'], null)) : HdriDefaultThumnailImage} alt="" className="w-full mb-[10px]"/>
                                        <button className="btn-upload-new-hdri" onClick={() => {setIsShowModalAdd(true)}}>
                                            + Upload New
                                        </button>
                                    </div>
                                </Col>
                                <Col span={6} className="text-left font-inter font-[600] text-[12px] leading-[14.52px] text-[#FFF]">
                                    Env Intensity
                                </Col>
                                <Col span={18}>
                                    <div className="flex gap-[12px] flex-nowrap items-center">
                                        <Slider
                                            min={0}
                                            max={10}
                                            step={0.1}
                                            className="w-full edit-decorative-form-slider"
                                            value={decorativeTemplateToneMappingExposure}
                                            onChange={(value) => {onToneExposureChange(value)}}
                                        />
                                        <InputNumber
                                            min={0}
                                            max={10}
                                            step={0.1}
                                            className="w-[34px] edit-decorative-form-number-input"
                                            value={decorativeTemplateToneMappingExposure}
                                            onChange={(value) => {onToneExposureChange(value)}}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </>,
                },
            ]}
        />

        <ModalAddEditHdri 
            title="Add hdri"
            open={isShowModalAdd}
            onClose={() => {setIsShowModalAdd(false)}}
            item={null}
            onSuccess={() => {
                setIsShowModalAdd(false)
                loadListHdri()
            }}
        />
    </>
}
export default DecorativeHdriCollapse