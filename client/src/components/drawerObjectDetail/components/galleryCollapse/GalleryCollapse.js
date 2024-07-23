import { Checkbox, Collapse, Input, Modal, Spin, notification } from "antd";
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"

import "./styles.scss"
import _ from "lodash";
import Dragger from "antd/es/upload/Dragger";
import { uploadFile } from "../../../../api/upload.api";
import TrashIcon from "../../../../assets/icons/TrashIcon";
import { getAssetsUrl, is3DFile, uuidv4 } from "../../../../utils/util";
import { useEffect, useMemo, useState } from "react";
import { userApi } from "../../../../api/user.api";
import { MODEL_BLOCK } from "../../../../utils/constants";
import ThreeDIcon from "../../../../assets/images/products/ThreeDIcon.svg"
import ExitIcon from "../../../../assets/images/project/exit.svg"
import ModalUploadAsset from "../../../modalUploadAsset/ModalUploadAsset";
import Lottie from "lottie-react";
import loadingAnimation from "../../../../assets/json/Add Products.json"
import assetApi from "../../../../api/asset.api";

const GalleryCollapse = ({
    gallery,
    selectedObject,
    onGalleryChange = () => {},
    objectDetail,
    onSelectedGalleryChange = () => {}
}) => {
    const [isShowModalUploadAsset, setIsShowModalUploadAsset] = useState(false)
    const [uploadAccept, setUploadAccept] = useState('.png,.jpg')
    const [loading, setIsLoading] = useState(false)

    const selectedGalleryId = useMemo(() => {
        let assetUrl = objectDetail.id
        let galleryId = _.get(objectDetail, ['selectedGalleryId'], '')
        return galleryId || assetUrl
    }, [objectDetail])

    useEffect(() => {
        userApi.getListUploadBlocks().then(data => {
            const canAdd3D = _.find(data , el => _.get(el, 'value', '') === MODEL_BLOCK["3D"])
            if(canAdd3D){
                setUploadAccept('.png,.jpg,.glb')
            }
        })
    }, [])

    const removeGallery = (gal) => {
        Modal.confirm({
            title: "Are you sure to delete gallery",
            centered: true,
            className: "dialog-confirm",
            onOk: () => {
                if(selectedGalleryId === gal.id){
                    onSelectedGalleryChange(_.get(gallery, [0, 'id'], null))
                }
                if(gal.assetId){
                    setIsLoading(true)

                    assetApi.deleteAsset(gal.assetId).then(rs => {
                        notification.success({
                            message: "Delete successfully!"
                        })
                        if(gal.image){
                            onGalleryChange(gallery.filter(o => o.image !== gal.image))
                        }
                        if(gal.object){
                            onGalleryChange(gallery.filter(o => o.object !== gal.object))
                        }
                        setIsLoading(false)
                    }).catch(err => {
                        notification.error({
                            message: _.get(err, ['response', 'data', 'message'], `Delete fail!`)
                        })
                        setIsLoading(false)
                    })
                } else {
                    if(gal.image){
                        onGalleryChange(gallery.filter(o => o.image !== gal.image))
                    }
                    if(gal.object){
                        onGalleryChange(gallery.filter(o => o.object !== gal.object))
                    }
                }
            }
        })
    }

    const onSuccess = (asset) => {
        let data = {
            image: asset.filePath,
            thumnail: asset.thumnail,
            assetId: asset.id,
            id: uuidv4()
        }
        if(is3DFile(asset.filePath)){
            delete data.image
            data = {
                ...data,
                object: asset.filePath
            }
        }

        onGalleryChange([..._.cloneDeep(gallery || []), data])
        setIsShowModalUploadAsset(false)
    }

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="gallery-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex justify-between w-full">
                        <span>
                            Gallery
                        </span>
                    </div>,
                    children: <>
                        {loading && <Spin spinning={true} className="loading-indicator-wrapper-no-translate" indicator={<Lottie animationData={loadingAnimation} />}>
                        </Spin> }
                        {!loading && <div className="gallery-collapse-content">
                            {
                                !_.isEmpty(gallery) && gallery.map((el, index) => (
                                    <div className="gallery-item" key={`picture-${index}`}>
                                        {el.thumnail && <img src={getAssetsUrl(el.thumnail)} alt="" className="gallery-image"/>}
                                        {(!el.thumnail && el.image && !is3DFile(el.image)) && <img src={getAssetsUrl(el.image)} alt="" className="gallery-image"/>}
                                        {(!el.thumnail && el.object && is3DFile(el.object)) && <img src={ThreeDIcon} alt="" className="gallery-image"/>}
                                        {(!el?.id || el?.id !== selectedObject) && <div className="trash-container" onClick={() => {removeGallery(el)}}>
                                            <img src={ExitIcon} alt="" />
                                        </div>}
                                        <>
                                            <Checkbox checked={el?.id === selectedGalleryId} className="checkbox-gallery-container" onChange={() => {onSelectedGalleryChange(el.id)}}/>
                                        </>
                                    </div>
                                ))
                            }
                            <div className="gallery-item">
                                <div className="add-button" onClick={() => {setIsShowModalUploadAsset(true)}}>
                                    + Add
                                </div>
                            </div>
                        </div>}
                    </>,
                },
            ]}
        />

        <ModalUploadAsset 
            open={isShowModalUploadAsset}
            onClose={() => {setIsShowModalUploadAsset(false)}}
            onSuccess={asset => {onSuccess(asset)}}
        />
    </>
}
export default GalleryCollapse;