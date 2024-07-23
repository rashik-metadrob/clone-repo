import { Col, Input, Row, Select, Spin, notification } from "antd"
import { useEffect, useRef, useState } from "react"
import ArrowIcon from "../../assets/images/products/arrow.svg"
import DefaultThumnailImage from "../../assets/images/admin/hdri-default-thumnail.png"
import { getAssetsUrl } from "../../utils/util"
import { ASSET_TYPES, LOGO, UPLOADS_FOLDER } from "../../utils/constants"
import assetApi from "../../api/asset.api"
import UploadImage from "../uploadImage/UploadImage"
import UploadImageIcon from "../../assets/icons/UploadImage"
import PlusIcon from "../../assets/icons/PlusIcon"
import { uploadFile } from "../../api/upload.api"
import _ from "lodash"
import "./styles.scss"

const SelectLogo = ({
    value,
    onChange = () => {},
    selectClassName = "select-logo",
    selectPopupClassName = "select-logo-popup-with-image",
    inputClassName = "shared-first-login-input",
    uploaderClassname = "logo-upload"
}) => {
    const [isShowSelectLogo, setIsShowSelectLogo] = useState(false)
    const [selectedLogo, setSelectedLogo] = useState(LOGO.CUSTOM)
    const [listLogos, setListLogos] = useState([])
    const [logoName, setLogoName] = useState('')
    const uploadImageRef = useRef()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(value){
            setSelectedLogo(value)
        } else {
            setSelectedLogo(LOGO.CUSTOM)
        }
    },[value])

    useEffect(() => {
        loadListLogos()
    }, [])

    const onLogoChange = (value) => {
        setIsShowSelectLogo(false)
        if(value !== LOGO.CUSTOM){
            onChange(value)
        } else{
            setLogoName('')
        }

        setSelectedLogo(value)
    }

    const loadListLogos = () => {
        assetApi.getAllAsset({
            type: ASSET_TYPES.LOGO
        }).then(data => {
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

                setListLogos(newList)
            }
        })
    }

    const onSaveLogo = async () => {
        let imageFile = uploadImageRef.current.getFile()
        if(!imageFile){
            notification.warning({
                message: "Thumnail can't be null!"
            })
            return
        }

        if(!logoName){
            notification.warning({
                message: "Logo name can't be null!"
            })
            return
        }

        setLoading(true)

        const formImageThumnailData = new FormData();
        formImageThumnailData.append("file", imageFile);
        const imageThumnailResult = await uploadFile(formImageThumnailData, 1, UPLOADS_FOLDER.BRAND_LOGO_THUMNAIL)
        if(imageThumnailResult.status && imageThumnailResult.status !== 200){
            notification.error({
                message: imageThumnailResult.data.message
            })
            setLoading(false)
            return
        }

        const imageResult = await uploadFile(formImageThumnailData, 1, UPLOADS_FOLDER.BRAND_LOGO, 250, 250)
        if(imageResult.status && imageResult.status !== 200){
            notification.error({
                message: imageResult.data.message
            })
            setLoading(false)
            return
        }

        const newLogo = await assetApi.createAsset({
            name: logoName,
            thumnail: imageThumnailResult.results,
            filePath: imageResult.results,
            size: _.get(imageResult, 'size', 0),
            type: ASSET_TYPES.LOGO
        })

        if(newLogo && newLogo.id){
            onChange(newLogo.id)
            setSelectedLogo(newLogo.id)
            loadListLogos()
            setLoading(false)
        } else {
            notification.error({
                message: "Can't create new logo!"
            })
            setLoading(false)
        }
    }

    return <>
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Select
                    placeholder="Select Logo"
                    className={`${selectClassName} w-full`}
                    popupClassName={selectPopupClassName}
                    dropdownRender={() => (
                        <>
                            <div className="popup-content">
                                <div className="item" onClick={(e) => {onLogoChange(LOGO.CUSTOM)}}>
                                    <span>
                                        Upload Logo
                                    </span>
                                </div>
                                <div className="item-divider"></div>
                                {
                                    listLogos.map(el => (
                                        <div className="item" onClick={(e) => {onLogoChange(el.value)}}>
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
                        listLogos.concat([{
                            label: "Upload",
                            value: LOGO.CUSTOM
                        }])
                    }
                    value={selectedLogo}
                    open={isShowSelectLogo}
                    onDropdownVisibleChange={(open) => {setIsShowSelectLogo(open)}}
                />
            </Col>

            {
                selectedLogo === LOGO.CUSTOM && <>
                    <Col span={24}>
                        <Input 
                            placeholder={'Logo name'} 
                            value={logoName} 
                            className={inputClassName}
                            onChange={(e) => {setLogoName(e.target.value)}}
                        />
                    </Col>
                    <Col span={24}>
                        <UploadImage 
                            ref={uploadImageRef}
                            title={"Logo"}
                            extraText=""
                            className={uploaderClassname}
                            uploadImage={<UploadImageIcon />}
                        />
                    </Col>
                    <Col span={24} className="flex justify-end">
                        <Spin spinning={loading}>
                            <button className="btn-admin-add" onClick={() => {onSaveLogo()}}>
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
export default SelectLogo