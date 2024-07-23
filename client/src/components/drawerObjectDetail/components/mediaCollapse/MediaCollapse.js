import { Checkbox, Collapse, Modal, Select, Upload, notification } from "antd"
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"
import MusicIcon from "../../../../assets/images/project/music-icon.svg"
import EnableAudioIcon from "../../../../assets/images/project/now-playing-icon.svg"
import DisableAudioIcon from "../../../../assets/images/project/disable-audio-icon.svg"
import DeleteMusicIcon from "../../../../assets/images/project/delete-music-icon.svg"
import DraggableIcon from "../../../../assets/images/project/draggable-icon.png"
import "./styles.scss"
import { useMemo, useRef, useState } from "react"
import _ from "lodash"
import ModalUploadMedia from "../../../modalUploadMedia/ModalUploadMedia"
import { getAssetsUrl, uuidv4 } from "../../../../utils/util"
import DraggableList from "react-draggable-list"
import assetApi from "../../../../api/asset.api"
import ModalUploadedMedia from "../modalUploadedMedia/ModalUploadedMedia"

const MediaCollapse = ({
    onSelectMedia = () => {},
    media,
    objectEditorMaterials
}) => {
    const [isShowModalUploadMedia, setIsShowModalUploadMedia] = useState(false)
    const mediaDraggableRef = useRef()

    const listMedias = useMemo(() => {
        return _.get(media, ['listMedias'], [])
    }, [media])

    const playingMedia = useMemo(() => {
        return listMedias.length > 0 && _.find(listMedias, { isPlaying: true })
    }, [listMedias])

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

    const onToggleAudio = (item) => {
        let newListMedias = _.cloneDeep(listMedias)
        newListMedias = newListMedias.map(el => {
            if(item.id === el.id) {
                el.isEnableAudio = !_.get(el, ['isEnableAudio'], true)
            }
            return el
        })

        onSelectMedia({...media, listMedias: newListMedias})
    }

    const onDeleteRecord = (record) => {
        let newListMedias = _.cloneDeep(listMedias)
        newListMedias = newListMedias.filter(el => el.id !== record.id)

        if(newListMedias.length > 0 && !_.find(newListMedias, {isPlaying: true})){
            newListMedias[0].isPlaying = true
        }

        onSelectMedia({...media, listMedias: newListMedias})
    }

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="media-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex">Media</div>,
                    children: <>
                        <div className="media-collapse-content">
                            <div className="media-content-header flex items-center justify-end gap-[10px]">
                                <div className="text-material-name">
                                    Material Name
                                </div>
                                <Select
                                    value={media?.selectedMaterial}
                                    onChange={(value) => {onSelectMedia({...media, selectedMaterial: value})}}
                                    className="retailer-form-select w-[150px]"
                                    popupClassName="retailer-form-select-popup"
                                    options={Object.keys(objectEditorMaterials).map(el => {
                                        return {
                                            label: formatMaterialName(objectEditorMaterials[el].name),
                                            value: objectEditorMaterials[el].name
                                        }
                                    })}
                                />
                            </div>
                            {playingMedia && <div className="now-playing-media-thumnail mt-[3px]">
                                <div className="now-playing-media-container">
                                    <img src={getAssetsUrl(playingMedia.thumnail)} alt="" className="w-full"/>
                                </div>
                            </div>}
                            <div className="autoplay-checkbox-container mt-[16px]">
                                <Checkbox 
                                    className="shared-checkbox"
                                    checked={_.get(media, ['isAutoPlay'], false)}
                                    onChange={(e) => {onSelectMedia({...media, isAutoPlay: e.target.checked})}}
                                >
                                    <span className="autoplay-checkbox-content">Autoplay feature video</span>
                                </Checkbox>
                                <Checkbox 
                                    className="shared-checkbox" 
                                    checked={_.get(media, ['isSpatialAudio'], false)}
                                    onChange={(e) => {onSelectMedia({...media, isSpatialAudio: e.target.checked})}}
                                >
                                    <span className="autoplay-checkbox-content">Spatial Audio</span>
                                </Checkbox>
                            </div>
                            <div className="autoplay-divider mt-[16px]"></div>
                            <div className="mt-[9px] flex items-center justify-between">
                                <div className="text-media-playlist">
                                    Media Playlist
                                </div>
                                <button className="btn-add-media" onClick={() => {setIsShowModalUploadMedia(true)}}>
                                    + Add Media
                                </button>
                            </div>
                            {listMedias.length > 0 && <div className="media-list mt-[16px]" ref={mediaDraggableRef}>
                                <DraggableList
                                    itemKey="name"
                                    template={({item, dragHandleProps }) => (
                                        <div className={`audio-item ${item.isPlaying ? 'playing' : ''}`}>
                                            <div className="flex gap-[12px] items-center">
                                                <div className="drag-handle" {...dragHandleProps} >
                                                    <img src={DraggableIcon} alt="" />
                                                </div>
                                                <img src={MusicIcon} alt="" />
                                                <span className="audio-name">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div className="flex gap-[18px] items-center">
                                                {
                                                    item.isPlaying && <>
                                                        <span className="whitespace-nowrap text-now-playing">
                                                            Now playing
                                                        </span>
                                                    </>
                                                }
                                                <img 
                                                    src={item.isEnableAudio ? EnableAudioIcon : DisableAudioIcon} 
                                                    alt="" 
                                                    className="cursor-pointer"
                                                    onClick={() => {onToggleAudio(item)}}
                                                />
                                                <img src={DeleteMusicIcon} alt="" className="cursor-pointer" onClick={() => {onDeleteRecord(item)}}/>
                                            </div>
                                        </div>  
                                    )}
                                    list={listMedias}
                                    onMoveEnd={(newList) => { onSelectMedia({...media, listMedias: newList})}}
                                    container={() => mediaDraggableRef.current}
                                    commonProps={{}}
                                >

                                </DraggableList>
                            </div>}
                        </div>
                    </>,
                },
            ]}
        />

        <ModalUploadedMedia 
            open={isShowModalUploadMedia}
            onClose={() => {setIsShowModalUploadMedia(false)}}
            onSelectMedia={(data) => {
                let newListMedias = _.cloneDeep(listMedias)
                newListMedias.push({
                    ...data,
                    isEnableAudio: true,
                    isPlaying: false,
                    assetId: data.id,
                    id: uuidv4()
                })

                if(newListMedias.length > 0 && !_.find(newListMedias, {isPlaying: true})){
                    newListMedias[0].isPlaying = true
                }

                onSelectMedia({...media, listMedias: newListMedias})
                setIsShowModalUploadMedia(false)
            }}
            filterExts=".mp4"
        />
    </>
}
export default MediaCollapse