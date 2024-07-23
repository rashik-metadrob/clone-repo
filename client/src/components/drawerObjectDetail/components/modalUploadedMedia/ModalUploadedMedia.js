import { Col, Input, Modal, Row, Select } from "antd"
import "./styles.scss"

import PluginIcon from "../../../../assets/images/project/plugin.svg"
import ExitIcon from "../../../../assets/images/project/exit.svg"
import TriangleIcon from "../../../../assets/images/products/triangle.svg"
import SearchIcon from "../../../../assets/images/project/search.svg"
import ViewAllIcon from "../../../../assets/images/project/view-all.svg"
import { useEffect, useState } from "react"
import { ASSET_TYPES, PRODUCT_TYPES } from "../../../../utils/constants"
import _ from "lodash"
import assetApi from "../../../../api/asset.api"
import PreviewAsset from "../../../previewAsset/PreviewAsset"

const ModalUploadedMedia = ({
    open,
    onClose = () => {},
    onSelectMedia = () => {},
    filterExts = ''
}) => {
    const [ListModel, setListModel] = useState([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        if(open){
            loadListMedias()
        }
    }, [open])

    const loadListMedias = () => {
        let filter = {
            page: 1, 
            limit: 1000, 
            isOnlyNonDisable: true,
            // type: ASSET_TYPES.MEDIA
        }
        if(filterExts){
            filter.filterExts = filterExts
        }
        assetApi.getAssets(filter).then(data => {
            setListModel(data.results)
        }).catch(err => {
        })
    }

    const onSelect = (el) => {
        const media = _.cloneDeep(el)
        delete el.createdAt
        delete el.updatedAt
        delete el.__v

        onSelectMedia(media)
    }

    return <>
        <Modal
            open={open}
            closable={false}
            title={null}
            footer={null}
            onCancel={onClose}
            width={1100}
            className="modal-uploaded-media"
            centered
        >
            <div className="modal-uploaded-media-content">
                <div className="modal-title-container">
                    <div className="title-container">
                        <img src={PluginIcon} alt="" />
                        Uploaded Media
                    </div>
                    
                    <div className="flex items-center gap-[40px]">
                        <Input
                            placeholder="Search"
                            suffix={<img src={SearchIcon} alt=""/>}
                            className="input-search"
                            value={search}
                            onChange={(e) => {setSearch(e.target.value)}}
                        />
                        <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                            <img src={ExitIcon} alt="" />
                            <div className="text-close">Close</div>
                        </div>
                    </div>
                </div>
                <div className="media-list-container">
                    {
                        ListModel && ListModel.filter(el => el?.name?.toLowerCase().includes(_.toLower(search))).map(el => (
                            <div className="upload-item" key={el.id} onClick={() => {onSelect(el)}}>
                                <div>
                                    <PreviewAsset fileName={el.thumnail} />
                                </div>
                                <div className="upload-name">
                                    {el.name}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Modal>
    </>
}
export default ModalUploadedMedia