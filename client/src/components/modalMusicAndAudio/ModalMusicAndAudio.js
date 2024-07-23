import "./styles.scss"
import ExitIcon from "../../assets/images/project/exit.svg"
import { Checkbox, Col, Modal, Row, Tabs, notification } from "antd"

import SpotifyImage from "../../assets/images/project/music/spotify.png"
import SoundCloudImage from "../../assets/images/project/music/soundcloud.png"
import { useMemo, useState } from "react"
import TrendingMusic from "../trendingMusic/TrendingMusic"
import CurrentAlbumImage from "../../assets/images/project/music/currentAlbum.png"
import PlayListIcon from "../../assets/images/project/music/playList.svg"
import MyMusicPlaylist from "../myMusicPlaylist/MyMusicPlaylist"
import spotifyApi from "../../api/spotify.api"
import { uuidv4 } from "../../utils/util"
import { useDispatch, useSelector } from "react-redux"
import { getMusicAndAudioSource, getSpotifyUserProfile, logoutSpotify, setSpotifyLastSelectedPlaylist, setSpotifyRedirectInfo } from "../../redux/appSlice"
import _ from "lodash"
import { getSpotifyCurrentTrack, getIsMusicPaused, setSpotifyDeviceId, setSpotifyUserPlayList } from "../../redux/spotifySlice"
import { MUSIC_AND_AUDIO_SOURCE, MUSIC_AND_AUDIO_TAB } from "../../utils/constants"
import ModalUploadMusic from "../modalUploadMusic/ModalUploadMusic"
import YourAudioTab from "./components/yourAudioTab/YourAudioTab"
import YourAudioPlayingBar from "./components/yourAudioPlayingBar/YourAudioPlayingBar"

const ModalMusicAndAudio = ({
    open,
    onClose = () => {}
}) => {
    const dispatch = useDispatch()
    const spotifyUser = useSelector(getSpotifyUserProfile)
    const spotifyCurrentTrack = useSelector(getSpotifyCurrentTrack)
    const musicIsPaused = useSelector(getIsMusicPaused)
    const musicAndAudioSource = useSelector(getMusicAndAudioSource)
   
    const [platforms] = useState([
        {
            id: MUSIC_AND_AUDIO_TAB.YOUR_AUDIO,
            name: "Play your audio"
        },
        {
            id: MUSIC_AND_AUDIO_TAB.SPOTIFY,
            name: "Spotify",
            image: SpotifyImage
        },
        {
            id: MUSIC_AND_AUDIO_TAB.CLOUD_SOUND,
            name: "SoundCloud",
            image: SoundCloudImage
        }
    ])
    const [activeKey, setActiveKey] = useState("1")
    const [activeTab, setActiveTab] = useState(MUSIC_AND_AUDIO_TAB.YOUR_AUDIO)

    const isShowPlayingBar = useMemo(() => {
        if(activeTab === MUSIC_AND_AUDIO_TAB.SPOTIFY && activeKey !== '1'){
            return false
        }

        return true
    }, [activeKey, activeTab])

    const OperationsSlot = {
        right: <>
            {
                !spotifyUser?.id && <div className="buttons-container">
                    <button className="btn-signup">
                        Signup
                    </button>
                    <button className="btn-login" onClick={() => {onLoginSpotify()}}>
                        Login
                    </button>
                </div>
            }
            {
                spotifyUser?.id && <div className="profile-container">
                    <div className="name cursor-pointer" onClick={() => {onRedirectToSpotify()}}>
                        {spotifyUser.display_name}
                    </div>
                    <button className="btn-logout" onClick={() => {onLogoutSpotify()}}>
                        Logout
                    </button>
                </div>
            }
        </>,
    };

    const onLogoutSpotify = () => {
        dispatch(logoutSpotify())
        dispatch(setSpotifyUserPlayList([]))
        dispatch(setSpotifyDeviceId(""))
        dispatch(setSpotifyLastSelectedPlaylist(""))
    }

    const onRedirectToSpotify = () => {
        if(_.get(spotifyUser, ['external_urls', 'spotify'], '')){
            const a  = document.createElement('a')
            a.href = _.get(spotifyUser, ['external_urls', 'spotify'], '')
            a.target = '_blank'
            a.click()
        }
    }

    const onLoginSpotify = () => {
        const newSpotifyState = uuidv4()
        dispatch(setSpotifyRedirectInfo({spotifyState: newSpotifyState, spotifyRedirectUrl: window.location.href}))
        spotifyApi.getSpotifyLoginUrl(newSpotifyState).then(rs => {
            console.log('newSpotifyState', rs)
            if(rs.url){
                window.isRequiredTracking = false
                window.location = rs.url
            } else {
                notification.error({
                    message: "Can't connect to Spotify!"
                })
            }
        }).catch(err => {
            notification.error({
                message: "Can't connect to Spotify!"
            })
        })
    }

    const items = [
        {
            key: "1",
            label: `Trending`,
            children: <>
                <TrendingMusic  onLoginSpotify={onLoginSpotify}/>
            </>,
        },
        {
            key: "2",
            label: `My Playlist`,
            children: <>
                <MyMusicPlaylist onLoginSpotify={onLoginSpotify}/>
            </>,
        },
    ]

    const ontogglePlay = () => {
        if(musicAndAudioSource === MUSIC_AND_AUDIO_SOURCE.SPOTIFY && window.spotifyPlayer){
            window.spotifyPlayer.togglePlay()
        }
    }

    return <>
        <Modal
            open={open}
            closable={false}
            title={null}
            footer={null}
            onCancel={onClose}
            width={1192}
            className="modal-music-and-animation"
            centered
        >
            <div className="modal-music-and-animation-content">
                <div className="modal-title-container">
                    <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                        <img src={ExitIcon} alt="" />
                        <div className="text-close">Close</div>
                    </div>
                </div>
                <Row className="modal-content">
                    <Col lg={5} md={6} span={24}>
                        <div className="music-and-audio-source h-full">
                            <div className="title">
                                Music/ Audio
                            </div>
                            <div className="list-platform mt-[40px]">
                                {
                                    platforms.map(el => (
                                        <div key={el.id} className={`image-container ${activeTab === el.id ? 'active' : ''}`} onClick={() => {setActiveTab(el.id)}}>
                                            {el.image && <img src={el.image} alt={el.name} />}
                                            {!el.image && <span>{el.name}</span>}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </Col>
                    <Col lg={19} md={18} span={24} className="h-[610px]">
                        <div className="h-full music-content">
                            { activeTab === MUSIC_AND_AUDIO_TAB.YOUR_AUDIO && 
                                <YourAudioTab />
                            }
                            {activeTab === MUSIC_AND_AUDIO_TAB.SPOTIFY && <div className="pl-[52px] pb-[0px] pt-[40px] flex-auto h-[0px]">
                                <Tabs
                                    className="music-tabs h-full"
                                    tabBarExtraContent={OperationsSlot}
                                    activeKey={activeKey}
                                    onChange={(key) => {setActiveKey(key.toString())}}
                                >
                                    {items.map((tab) => {
                                        const { key, label, children } = tab;
                                        return (
                                            <Tabs.TabPane
                                            key={key}
                                            tab={label}
                                            >
                                                {children}
                                            </Tabs.TabPane>
                                        );
                                    })}
                                </Tabs>
                            </div>}
                            {isShowPlayingBar && <>
                                {
                                    musicAndAudioSource === MUSIC_AND_AUDIO_SOURCE.SPOTIFY && <div className="playing-bar-container">
                                        <div className="playing-bar">
                                            <div className="current-play-album">
                                                <img src={spotifyCurrentTrack?.album?.images[0]?.url || CurrentAlbumImage} alt="" className={`w-[48px] h-[48px] rounded-[50%] ${musicIsPaused ? '' : 'animation-rotate'}`} />
                                                <div className="album-info">
                                                    <div className="title">
                                                    { spotifyCurrentTrack?.name || 'No track' }
                                                    </div>
                                                    <div className="action" onClick={ontogglePlay}>
                                                        {musicIsPaused ? 'Play' : 'Pause' }
                                                    </div>
                                                </div>
                                            </div>
                                            <img src={PlayListIcon} alt="Play List" className="w-[32px] h-[32px]" />
                                        </div>
                                    </div>
                                }
                                {
                                    musicAndAudioSource === MUSIC_AND_AUDIO_SOURCE.YOUR_AUDIO &&
                                    <YourAudioPlayingBar />
                                }
                            </>}
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
        
    </>
}
export default ModalMusicAndAudio;