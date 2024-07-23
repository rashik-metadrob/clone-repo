import { Checkbox, Modal, notification } from "antd"
import { useState } from "react"
import ModalUploadMusic from "../../../modalUploadMusic/ModalUploadMusic"
import { useSelector } from "react-redux"
import { fetchUserPlaylist, getListAudios, setListAudios } from "../../../../redux/audioSlice"
import MusicIcon from "../../../../assets/images/project/music-icon.svg"
import NowPlayingIcon from "../../../../assets/images/project/now-playing-icon.svg"
import DeleteMusicIcon from "../../../../assets/images/project/delete-music-icon.svg"
import "./styles.scss"
import { ASSET_TYPES, MUSIC_AND_AUDIO_SOURCE } from "../../../../utils/constants"
import assetApi from "../../../../api/asset.api"
import { useAppDispatch } from "../../../../redux"
import PlayIcon from "../../../../assets/images/spotify/play.png"
import PauseIcon from "../../../../assets/images/spotify/pause.png"
import { getShouldShufflePlaylist, setMusicAndAudioSource, setShouldShufflePlaylist } from "../../../../redux/appSlice"
import { getIsMusicPaused, setMusicIsPaused } from "../../../../redux/spotifySlice"
import _ from "lodash"
import ModalUploadedMedia from "../../../drawerObjectDetail/components/modalUploadedMedia/ModalUploadedMedia"
import { userApi } from "../../../../api/user.api"
import userAudioApi from "../../../../api/userAudio.api"

const YourAudioTab = () => {
    const dispatch = useAppDispatch()
    const [isShowModalUploadMusic, setIsShowModalUploadMusic] = useState(false)
    const listAudios = useSelector(getListAudios)
    const musicIsPaused = useSelector(getIsMusicPaused)
    const shouldShufflePlaylist = useSelector(getShouldShufflePlaylist)

    const onReloadListMusic = () => {
        dispatch(fetchUserPlaylist())
    }

    const onDeleteRecord = (record) => {
        Modal.confirm({
            title: "Are you sure to delete this audio?",
            centered: true,
            className: "dialog-confirm",
            onOk: () => {
                // Should delete file
                userAudioApi.deleteUserAudio(record.id).then(() => {
                    notification.success({
                        message: "Removed audio successfully!"
                    })
                    onReloadListMusic()
                }).catch(err => {
                    notification.error({
                        message: _.get(err, ['response', 'data', 'message'], `Can't remove audio to playlist!`)
                    })
                })
            }
        })
    }

    const onPlayYourPlaylist = () => {
        dispatch(setMusicAndAudioSource(MUSIC_AND_AUDIO_SOURCE.YOUR_AUDIO))
        dispatch(setMusicIsPaused(!musicIsPaused))
    }

    const onAddAudio = (media) => {
        userAudioApi.addUserAudio({asset: media.id}).then(rs => {
            notification.success({
                message: "Added audio successfully!"
            })
            onReloadListMusic()
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't add audio to playlist!`)
            })
        })

        setIsShowModalUploadMusic(false)
    }

    return <>
        <div className="px-[52px] pb-[0px] pt-[40px] flex-auto h-[0px] flex flex-col your-audio-tab">
            <div className="your-audio-tab-header pb-[10px]">
                <div className="text-title">
                    Upload and play music and voiceovers
                </div>
                <div className="flex gap-[40px]">
                    <Checkbox
                        className="autoplay-checkbox shared-checkbox"
                        checked={shouldShufflePlaylist}
                        onChange={(e) => {dispatch(setShouldShufflePlaylist(e.target.checked))}}
                    >
                        <span className="checkbox-content">Shuffle</span>
                    </Checkbox>
                    <button className="btn-add-media" onClick={() => {setIsShowModalUploadMusic(true)}}>
                        + Add media
                    </button>
                </div>
            </div>
            <div className="your-audio-tab-content py-[12px] flex-auto overflow-y-auto">
                <div className="flex items-center gap-[30px] mb-[8px]">
                    <div className="text-media-playlist">
                        Media Playlist
                    </div>
                    {listAudios.length > 0 && <div className="play-button" onClick={() => {onPlayYourPlaylist()}}>
                        <img src={musicIsPaused ? PlayIcon : PauseIcon} alt="" className="w-[30px] h-[30px]"/>
                        {musicIsPaused ? "Play" : "Pause"}
                    </div>}
                </div>
                
                {listAudios.length > 0 && <div className="audio-item-container">
                    {
                        listAudios &&
                        listAudios.map((el) => (
                            <div className={`audio-item ${el.isPlaying ? 'playing' : ''}`} key={el.id}>
                                <div className="flex gap-[12px] items-center">
                                    <img src={MusicIcon} alt="" />
                                    <span className="audio-name">
                                        {el.name}
                                    </span>
                                </div>
                                <div className="flex gap-[18px] items-center">
                                    {
                                        el.isPlaying && <>
                                            <span className="whitespace-nowrap text-now-playing">
                                                Now playing
                                            </span>
                                            <img src={NowPlayingIcon} alt="" />
                                        </>
                                    }
                                    <img src={DeleteMusicIcon} alt="" className="cursor-pointer" onClick={() => {onDeleteRecord(el)}}/>
                                </div>
                            </div>
                        ))
                    }
                </div>}
                
            </div>
        </div>

        <ModalUploadedMedia
            open={isShowModalUploadMusic}
            onClose={() => {setIsShowModalUploadMusic(false)}}
            filterExts=".mp3,.wav"
            onSelectMedia={(media) => {onAddAudio(media)}}
        />
    </>
}

export default YourAudioTab