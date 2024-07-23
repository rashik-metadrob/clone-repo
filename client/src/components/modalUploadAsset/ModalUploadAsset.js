import { Col, Input, Modal, Row, Spin, notification } from "antd"
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"
import "./styles.scss"
import { useEffect, useMemo, useRef, useState } from "react"
import UploadImage from "../uploadImage/UploadImage"
import UploadImageIcon from "../../assets/icons/UploadImage"
import { userApi } from "../../api/user.api"
import { ASSET_TYPES, MODEL_BLOCK, UPLOADS_FOLDER } from "../../utils/constants"
import _ from "lodash"
import SaveIcon from "../../assets/images/products/save.svg"
import UploadModel from "../uploadModel/UploadModel"
import { uploadFile } from "../../api/upload.api"
import assetApi from "../../api/asset.api"

const ModalUploadAsset = ({
    open,
    item = null,
    onClose = () => {},
    onSuccess = () => {},
    assetType = ASSET_TYPES.GALLERY
}) => {
    const uploadImageRef = useRef()
    const uploadModelRef = useRef()
    const [formData, setFormData] = useState({})
    const [uploadAccept, setUploadAccept] = useState('.png,.jpg')
    const [loading, setLoading] = useState(false)

    const uploadAssetValue = useMemo(() => {
        if(assetType === ASSET_TYPES.GALLERY){
            return uploadAccept
        } else {
            return "image/*,video/*"
        }
    }, [uploadAccept, assetType])

    useEffect(() => {
        if(open){
            if(item){
                setFormData(
                    _.pick(item, ['name', 'filePath', 'thumnail'])
                )
            } else {
                setFormData({})
            }
        }
    }, [item, open])

    useEffect(() => {
        userApi.getListUploadBlocks().then(data => {
            const canAdd3D = _.find(data , el => _.get(el, 'value', '') === MODEL_BLOCK["3D"])
            if(canAdd3D){
                setUploadAccept('.png,.jpg,.glb')
            }
        })
    }, [])

    const onSave = async () => {
        if(!item){
            let imageFile = uploadImageRef.current.getFile()
            if(!imageFile){
                notification.warning({
                    message: "Thumnail can't be null!"
                })
                return
            }
    
            let objectFile = uploadModelRef.current.getFile()
            if(!objectFile){
                notification.warning({
                    message: "Object file can't be null!"
                })
                return
            }
    
            if(!formData?.name){
                notification.warning({
                    message: "Asset name can't be null!"
                })
                return
            }
    
            setLoading(true)
    
            const formImageThumnailData = new FormData();
            formImageThumnailData.append("file", imageFile);
            const imageThumnailResult = await uploadFile(formImageThumnailData, 1, UPLOADS_FOLDER.ASSET_THUMNAIL)
            if(imageThumnailResult.status && imageThumnailResult.status !== 200){
                notification.error({
                    message: imageThumnailResult.data.message
                })
                setLoading(false)
                return
            }
    
            const formObjectData = new FormData();
            formObjectData.append("file", objectFile);
            const objectResult = await uploadFile(formObjectData, 0, assetType === ASSET_TYPES.GALLERY ? UPLOADS_FOLDER.GALLERY : UPLOADS_FOLDER.ASSET)
            if(objectResult.status && objectResult.status !== 200){
                notification.error({
                    message: objectResult.data.message
                })
                setLoading(false)
                return
            }
    
            const newAsset = await assetApi.createAsset({
                name: formData.name,
                thumnail: imageThumnailResult.results,
                filePath: objectResult.results,
                size: _.get(objectResult, 'size', 0),
                type: assetType
            })
    
            if(newAsset && newAsset.filePath){
                onSuccess(newAsset)
                setLoading(false)
            } else {
                notification.error({
                    message: "Can't create new asset!"
                })
                setLoading(false)
            }
        } else {
            if(!formData?.name){
                notification.warning({
                    message: "Asset name can't be null!"
                })
                return
            }

            setLoading(true)

            let assetThumnail = formData.thumnail
    
            let imageFile = uploadImageRef.current.getFile()
            if(imageFile){
                const formImageThumnailData = new FormData();
                formImageThumnailData.append("file", imageFile);
                const imageThumnailResult = await uploadFile(formImageThumnailData, 1, UPLOADS_FOLDER.ASSET_THUMNAIL)
                if(imageThumnailResult.status && imageThumnailResult.status !== 200){
                    notification.error({
                        message: imageThumnailResult.data.message
                    })
                    setLoading(false)
                    return
                }

                assetThumnail = imageThumnailResult.results
            }
            
            let assetFilePath = formData.filePath
            let assetSize = formData.size
    
            let objectFile = uploadModelRef.current.getFile()
            if(objectFile){
                const formObjectData = new FormData();
                formObjectData.append("file", objectFile);
                const objectResult = await uploadFile(formObjectData, 0, assetType === ASSET_TYPES.GALLERY ? UPLOADS_FOLDER.GALLERY : UPLOADS_FOLDER.ASSET)
                if(objectResult.status && objectResult.status !== 200){
                    notification.error({
                        message: objectResult.data.message
                    })
                    setLoading(false)
                    return
                }

                assetFilePath = objectResult.results
                assetSize = _.get(objectResult, 'size', 0)
            }
            
            const data = {
                name: formData.name,
                thumnail: assetThumnail,
                filePath: assetFilePath,
                size: assetSize,
                type: assetType
            }

            assetApi.updateAsset(item.id, data).then(rs => {
                onSuccess(rs)
                setLoading(false)
            }).catch(err => {
                notification.error({
                    message: "Can't update asset!"
                })
                setLoading(false)
            })
        }
    }

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }
    
    return <Modal
        open={open}
        width={794}
        footer={null}
        closeIcon={<img src={ModalExitIcon} alt="" />}
        destroyOnClose={true}
        closable={true}
        className="modal-upload-asset"
        onCancel={() => {onClose()}}
        title={`${item ? 'Update' : 'Upload'} asset`}
    > 
        <Row gutter={[16, 16]} className="mt-[24px]">
            <Col span={24}>
                <Input 
                    placeholder={'Asset name'} 
                    value={formData?.name} 
                    className="admin-form-input" 
                    onChange={(e) => {handleFormDataChange( 'name', e.target.value)}}
                />
            </Col>
            <Col span={24}>
                <UploadImage 
                    ref={uploadImageRef}
                    placeholderFileName={formData?.thumnail}
                    title={"Thumnail"}
                    extraText=""
                    className="admin-image-uploader"
                    uploadImage={<UploadImageIcon />}
                />
            </Col>
            <Col span={24}>
                <UploadModel 
                    ref={uploadModelRef}
                    placeholderFileName={formData?.filePath}
                    title={"Object"}
                    extraText={`Add your asset (upload in format ${uploadAssetValue})`}
                    className="admin-model-uploader"
                    accept={uploadAssetValue}
                />
            </Col>
            <Col span={24} className="flex justify-end">
                <Spin spinning={loading}>
                    <button className="btn-save" onClick={onSave}>
                        <img src={SaveIcon} alt="" />
                        Save
                    </button>
                </Spin>
            </Col>
        </Row>
    </Modal>
}

export default ModalUploadAsset