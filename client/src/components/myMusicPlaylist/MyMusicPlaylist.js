import { useDispatch, useSelector } from "react-redux";
import "./styles.scss"
import { getSpotifyAccessToken, getSpotifyUserProfile } from "../../redux/appSlice";
import { setSpotifyUserPlayList, getSpotifyUserPlayList } from "../../redux/spotifySlice"
import { useEffect } from "react";
import spotifyApi from "../../api/spotify.api";
import PlayListCard from "./components/playListCard/PlayListCard";

const MyMusicPlaylist = ({
    onLoginSpotify = () => {}
}) => {
    const dispatch = useDispatch()
    const spotifyUser = useSelector(getSpotifyUserProfile)
    const spotifyAccessToken = useSelector(getSpotifyAccessToken)
    const spotifyUserPlayList = useSelector(getSpotifyUserPlayList)

    useEffect(() => {
        if(spotifyUser?.id && spotifyAccessToken){
            spotifyApi.getSpotifyUserPlaylist(spotifyUser.id, spotifyAccessToken).then(rs => {
                if(rs.items){
                    dispatch(setSpotifyUserPlayList(rs.items))
                }
            })
        }
    }, [spotifyUser, spotifyAccessToken])
    
    return <>
        <div className="my-music-playlist-wrapper">
            {!spotifyUser?.id && <div className="login-container">
                <div className="login-text">
                    Ohh snap you forget to login. Login now   
                </div>
                <div className="buttons-container mt-[18px]">
                    <button className="btn-signup">
                        Signup
                    </button>
                    <button className="btn-login" onClick={() => {onLoginSpotify()}}>
                        Login
                    </button>
                </div>
            </div>}
            <div className="music-list-wrapper mt-[8px]">
                {
                    spotifyUserPlayList && spotifyUserPlayList.map(el => (
                        <PlayListCard key={el.id} playListInfo={el}/>
                    ))
                }
                </div>
        </div>
    </>
}
export default MyMusicPlaylist;