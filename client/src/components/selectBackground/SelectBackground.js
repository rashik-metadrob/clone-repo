import { Col, Input, Row, Select, Spin, notification } from "antd"
import { useEffect, useRef, useState } from "react"
import ArrowIcon from "../../assets/images/products/arrow.svg"
import DefaultThumnailImage from "../../assets/images/admin/hdri-default-thumnail.png"
import { getAssetsUrl } from "../../utils/util"
import { ASSET_TYPES, BACKGROUND, UPLOADS_FOLDER } from "../../utils/constants"
import assetApi from "../../api/asset.api"
import UploadImage from "../uploadImage/UploadImage"
import UploadImageIcon from "../../assets/icons/UploadImage"
import PlusIcon from "../../assets/icons/PlusIcon"
import { uploadFile } from "../../api/upload.api"
import _ from "lodash"
import "./styles.scss"

const SelectBackground = ({
    value,
    onChange = () => {},
    selectClassName = "select-background",
    selectPopupClassName = "select-background-popup-with-image",
    inputClassName = "shared-first-login-input",
    uploaderClassname = "background-upload"
}) => {
    const [isShowSelectBackground, setIsShowSelectBackground] = useState(false)
    const [selectedBackground, setSelectedBackground] = useState(BACKGROUND.CUSTOM)
    const [listBackgrounds, setListBackgrounds] = useState([])
    const [backgroundName, setBackgroundName] = useState('')
    const uploadImageRef = useRef()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(value){
            setSelectedBackground(value)
        } else {
            setSelectedBackground(BACKGROUND.CUSTOM)
        }
    },[value])

    useEffect(() => {
        loadListBackgrounds()
    }, [])

    const onBackgroundChange = (value) => {
        setIsShowSelectBackground(false)
        if(value !== BACKGROUND.CUSTOM){
            onChange(value)
        } else{
            setBackgroundName('')
        }

        setSelectedBackground(value)
    }

    const loadListBackgrounds = () => {
        assetApi.getAllAsset({
            type: ASSET_TYPES.BACKGROUND
        }).then(data => {
            if(data && data.length > 0){
                const newList = [
                    ...data.map(el => {
                        return {
                            label: el.name,
                            thumnail: el.thumnail ?? "",
                            value: el.filePath
                        }
                    }),
                ]

                setListBackgrounds(newList)
            }
        })
    }

    const onSaveBackground = async () => {
        let imageFile = uploadImageRef.current.getFile()
        if(!imageFile){
            notification.warning({
                message: "Thumnail can't be null!"
            })
            return
        }

        if(!backgroundName){
            notification.warning({
                message: "Background name can't be null!"
            })
            return
        }

        setLoading(true)

        const formImageThumnailData = new FormData();
        formImageThumnailData.append("file", imageFile);
        const imageThumnailResult = await uploadFile(formImageThumnailData, 1, UPLOADS_FOLDER.STORE_THEME_BACKGROUND_THUMNAIL)
        if(imageThumnailResult.status && imageThumnailResult.status !== 200){
            notification.error({
                message: imageThumnailResult.data.message
            })
            setLoading(false)
            return
        }

        const imageResult = await uploadFile(formImageThumnailData, 1, UPLOADS_FOLDER.STORE_THEME_BACKGROUND, 1920, 1080)
        if(imageResult.status && imageResult.status !== 200){
            notification.error({
                message: imageResult.data.message
            })
            setLoading(false)
            return
        }

        const newBackground = await assetApi.createAsset({
            name: backgroundName,
            thumnail: imageThumnailResult.results,
            filePath: imageResult.results,
            size: _.get(imageResult, 'size', 0),
            type: ASSET_TYPES.BACKGROUND
        })

        if(newBackground && newBackground.filePath){
            onChange(newBackground.filePath)
            setSelectedBackground(newBackground.filePath)
            loadListBackgrounds()
            setLoading(false)
        } else {
            notification.error({
                message: "Can't create new background!"
            })
            setLoading(false)
        }
    }

    return <>
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Select
                    placeholder="Select Background"
                    className={`${selectClassName} w-full`}
                    popupClassName={selectPopupClassName}
                    dropdownRender={() => (
                        <>
                            <div className="popup-content">
                                <div className="item" onClick={(e) => {onBackgroundChange(BACKGROUND.CUSTOM)}}>
                                    <span>
                                        Upload Background
                                    </span>
                                </div>
                                <div className="item-divider"></div>
                                {
                                    listBackgrounds.map(el => (
                                        <div className="item" onClick={(e) => {onBackgroundChange(el.value)}}>
                                            <div className="image-container">
                                                <img src={el.thumnail ? getAssetsUrl(el.thumnail) : DefaultThumnailImage} alt="" className="w-[89px] h-[64px]"/>
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
                    options={
                        listBackgrounds.concat([{
                            label: "Upload",
                            value: BACKGROUND.CUSTOM
                        }])
                    }
                    value={selectedBackground}
                    open={isShowSelectBackground}
                    onDropdownVisibleChange={(open) => {setIsShowSelectBackground(open)}}
                />
            </Col>

            {
                selectedBackground === BACKGROUND.CUSTOM && <>
                    <Col span={24}>
                        <Input 
                            placeholder={'Background name'} 
                            value={backgroundName} 
                            className={inputClassName}
                            onChange={(e) => {setBackgroundName(e.target.value)}}
                        />
                    </Col>
                    <Col span={24}>
                        <UploadImage 
                            ref={uploadImageRef}
                            title={"Background"}
                            extraText=""
                            className={uploaderClassname}
                            uploadImage={<UploadImageIcon />}
                        />
                    </Col>
                    <Col span={24} className="flex justify-end">
                        <Spin spinning={loading}>
                            <button className="btn-admin-add" onClick={() => {onSaveBackground()}}>
                                <PlusIcon />
                                <span>Add new</span>
                            </button>
                        </Spin>
                    </Col>
                </>
            }
        </Row>
    </>
}
export default SelectBackground