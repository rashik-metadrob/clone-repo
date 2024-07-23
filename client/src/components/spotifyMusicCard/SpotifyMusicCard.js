import _ from "lodash"
import { useDispatch, useSelector } from "react-redux"
import { getSpotifyAccessToken, setSpotifyLastSelectedPlaylist } from "../../redux/appSlice"
import { getSpotifyDeviceId } from "../../redux/spotifySlice"
import { notification } from "antd"
import spotifyApi from "../../api/spotify.api"

const SpotifyMusicCard = ({
    info
}) => {
    const dispatch = useDispatch()
    const spotifyAccessToken = useSelector(getSpotifyAccessToken)
    const spotifyDeviceId = useSelector(getSpotifyDeviceId)
    const onPlayPlaylist = () => {
        const uri = info.uri
        if(!spotifyAccessToken || !spotifyDeviceId){
            notification.warning({
                'message': "Can't play this playlist!"
            })
            return
        }
        spotifyApi.playPlayList(uri, spotifyDeviceId, spotifyAccessToken).then(data => {
            dispatch(setSpotifyLastSelectedPlaylist(uri))
        }).catch(err => {
            notification.warning({
                'message': "Can't play this playlist!"
            })
        })
    }

    return <>
        <div className="music-card" onClick={onPlayPlaylist}>
            <div className="image-container">
                <img src={_.get(info, ['images', 0, 'url'], '')} alt={info.name} />
            </div>
            <div className="title mt-[13px]">
                {info.name}
            </div>
            <div className="description mt-[8px]">
                {info.description}
            </div>
        </div>
    </>
}
export default SpotifyMusicCard