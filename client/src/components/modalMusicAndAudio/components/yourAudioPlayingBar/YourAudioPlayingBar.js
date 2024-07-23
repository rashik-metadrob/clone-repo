import { useSelector } from "react-redux"
import CurrentAlbumImage from "../../../../assets/images/project/music/currentYourPlaylistAlbum.png"
import { getIsMusicPaused, setMusicIsPaused } from "../../../../redux/spotifySlice"
import { useAppDispatch } from "../../../../redux"
import PlayListIcon from "../../../../assets/images/project/music/playList.svg"
import { getListAudios } from "../../../../redux/audioSlice"
import { useMemo } from "react"
import _ from "lodash"


const YourAudioPlayingBar = () => {
    const dispatch = useAppDispatch()
    const musicIsPaused = useSelector(getIsMusicPaused)
    const listAudios = useSelector(getListAudios)

    const playingAudioName = useMemo(() => {
        return _.get(_.find(listAudios, {isPlaying: true}), ['name'], '')
    }, [listAudios])

    const ontogglePlay = () => {
        dispatch(setMusicIsPaused(!musicIsPaused))
    }

    return <>
        <div className="playing-bar-container">
            <div className="playing-bar">
                <div className="current-play-album">
                    <img src={CurrentAlbumImage} alt="" className={`w-[48px] h-[48px] rounded-[50%] ${musicIsPaused ? '' : 'animation-rotate'}`} />
                    <div className="album-info">
                        <div className="title">
                            {playingAudioName}
                        </div>
                        <div className="action" onClick={ontogglePlay}>
                            {musicIsPaused ? 'Play' : 'Pause' }
                        </div>
                    </div>
                </div>
                <img src={PlayListIcon} alt="Play List" className="w-[32px] h-[32px]" />
            </div>
        </div>
    </>
}
export default YourAudioPlayingBar