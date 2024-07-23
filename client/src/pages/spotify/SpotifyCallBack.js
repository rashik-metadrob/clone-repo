import { useDispatch, useSelector } from "react-redux"
import { getSpotifyRedirectUrl, getSpotifyState, setSpotifyAccessToken, setSpotifyRefeshToken } from "../../redux/appSlice"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import spotifyApi from "../../api/spotify.api"
import { notification } from "antd"

const SpotifyCallback = () => {
    const dispatch = useDispatch()
    const spotifyState = useSelector(getSpotifyState)
    const spotifyRedirectUrl = useSelector(getSpotifyRedirectUrl)
    const navigate = useNavigate()
    const isGetToken = useRef(false)

    useEffect(() => {
        const state = new URLSearchParams(window.location.search).get(
            "state"
        );
        const code = new URLSearchParams(window.location.search).get(
            "code"
        );

        if (state === null || state !== spotifyState) {
            navigate("/404")
        } else {
            if(isGetToken.current){
                return
            }
            isGetToken.current = true
            spotifyApi.getSpotifyAccessToken(code).then(rs => {
                if(rs.access_token && rs.refresh_token){
                    dispatch(setSpotifyAccessToken(rs.access_token))
                    dispatch(setSpotifyRefeshToken(rs.refresh_token))
                    window.location = spotifyRedirectUrl
                } else {
                    notification.error({
                        message: "Can't connect to Spotify!"
                    })
                    navigate("/404")
                }
            }).catch(err => {
                notification.error({
                    message: "Can't connect to Spotify!"
                })
                navigate("/404")
            })
        }
    }, [spotifyState, spotifyRedirectUrl])

    return <>
    </>
}
export default SpotifyCallback