import { Col, Input, Row, Select, Spin, notification } from "antd"
import { useEffect, useRef, useState } from "react"
import ArrowIcon from "../../assets/images/products/arrow.svg"
import DefaultThumnailImage from "../../assets/images/admin/hdri-default-thumnail.png"
import { getAssetsUrl } from "../../utils/util"
import { ASSET_TYPES, TEXTURE, UPLOADS_FOLDER } from "../../utils/constants"
import assetApi from "../../api/asset.api"
import UploadImage from "../uploadImage/UploadImage"
import UploadImageIcon from "../../assets/icons/UploadImage"
import PlusIcon from "../../assets/icons/PlusIcon"
import { uploadFile } from "../../api/upload.api"
import _ from "lodash"

const SelectTexture = ({
    value,
    onChange = () => {}
}) => {
    const [isShowSelectTexture, setIsShowSelectTexture] = useState(false)
    const [selectedTexture, setSelectedTexture] = useState(TEXTURE.AVAILABLE)
    const [listTextures, setListTextures] = useState([])
    const [textureName, setTextureName] = useState('')
    const uploadImageRef = useRef()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(value){
            setSelectedTexture(value)
        } else {
            setSelectedTexture(TEXTURE.AVAILABLE)
        }
    },[value])

    useEffect(() => {
        loadListTextures()
    }, [])

    const onTextureChange = (value) => {
        setIsShowSelectTexture(false)
        if(value !== TEXTURE.CUSTOM){
            onChange(value)
        } else{
            setTextureName('')
        }

        setSelectedTexture(value)
    }

    const loadListTextures = () => {
        assetApi.getAllAsset({
            type: ASSET_TYPES.TEXTURE
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

                setListTextures(newList)
            }
        })
    }

    const onSaveTexture = async () => {
        let imageFile = uploadImageRef.current.getFile()
        if(!imageFile){
            notification.warning({
                message: "Thumnail can't be null!"
            })
            return
        }

        if(!textureName){
            notification.warning({
                message: "Texture name can't be null!"
            })
            return
        }

        setLoading(true)

        const formImageThumnailData = new FormData();
        formImageThumnailData.append("file", imageFile);
        const imageThumnailResult = await uploadFile(formImageThumnailData, 1, UPLOADS_FOLDER.TEXTURE_THUMNAIL)
        if(imageThumnailResult.status && imageThumnailResult.status !== 200){
            notification.error({
                message: imageThumnailResult.data.message
            })
            setLoading(false)
            return
        }

        const imageResult = await uploadFile(formImageThumnailData, 1, UPLOADS_FOLDER.TEXTURE, 250, 250)
        if(imageResult.status && imageResult.status !== 200){
            notification.error({
                message: imageResult.data.message
            })
            setLoading(false)
            return
        }

        const newTexture = await assetApi.createAsset({
            name: textureName,
            thumnail: imageThumnailResult.results,
            filePath: imageResult.results,
            size: _.get(imageResult, 'size', 0),
            type: ASSET_TYPES.TEXTURE
        })

        if(newTexture && newTexture.filePath){
            onChange(newTexture.filePath)
            setSelectedTexture(newTexture.filePath)
            loadListTextures()
            setLoading(false)
        } else {
            notification.error({
                message: "Can't create new texture!"
            })
            setLoading(false)
        }
    }

    return <>
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Select
                    placeholder="Select Texture"
                    className="admin-form-select w-full"
                    popupClassName="admin-form-select-popup-with-image"
                    dropdownRender={() => (
                        <>
                            <div className="popup-content">
                                <div className="item" onClick={(e) => {onTextureChange(TEXTURE.CUSTOM)}}>
                                    <span>
                                        Upload Texture
                                    </span>
                                </div>
                                <div className="item" onClick={(e) => {onTextureChange(TEXTURE.AVAILABLE)}}>
                                    <span>
                                        Available texture
                                    </span>
                                </div>
                                <div className="item-divider"></div>
                                {
                                    listTextures.map(el => (
                                        <div className="item" onClick={(e) => {onTextureChange(el.value)}}>
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
                        listTextures.concat([{
                            label: "Custom",
                            value: TEXTURE.CUSTOM
                        },
                        {
                            label: "Available",
                            value: TEXTURE.AVAILABLE
                        }])
                    }
                    value={selectedTexture}
                    open={isShowSelectTexture}
                    onDropdownVisibleChange={(open) => {setIsShowSelectTexture(open)}}
                />
            </Col>

            {
                selectedTexture === TEXTURE.CUSTOM && <>
                    <Col span={24}>
                        <Input 
                            placeholder={'Texture name'} 
                            value={textureName} 
                            className="admin-form-input" 
                            onChange={(e) => {setTextureName(e.target.value)}}
                        />
                    </Col>
                    <Col span={24}>
                        <UploadImage 
                            ref={uploadImageRef}
                            title={"Texture"}
                            extraText=""
                            className="admin-image-uploader"
                            uploadImage={<UploadImageIcon />}
                        />
                    </Col>
                    <Col span={24} className="flex justify-end">
                        <Spin spinning={loading}>
                            <button className="btn-admin-add" onClick={() => {onSaveTexture()}}>
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
export default SelectTexture