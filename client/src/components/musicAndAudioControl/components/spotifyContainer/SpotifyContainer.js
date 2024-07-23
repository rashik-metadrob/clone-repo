import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSpotifyAccessToken, getSpotifyRefeshToken, logoutSpotify, setSpotifyAccessToken, setSpotifyLastSelectedPlaylist, setSpotifyRefeshToken, setSpotifyUserProfile } from "../../../../redux/appSlice"
import spotifyApi from "../../../../api/spotify.api"
import { notification } from "antd"
import _ from "lodash"
import SpotifyPlayer from "../spotifyPlayer/SpotifyPlayer"
import { setSpotifyDeviceId, setSpotifyUserPlayList } from "../../../../redux/spotifySlice"

const SpotifyContainer = () => {
    const dispatch = useDispatch()
    const shouldLoadProfile = useRef(true)
    const spotifyAccessToken = useSelector(getSpotifyAccessToken)
    const spotifyRefreshToken = useSelector(getSpotifyRefeshToken)

    // dispatch(setSpotifyUserProfile(null))
    // dispatch(setSpotifyAccessToken(null))
    // dispatch(setSpotifyRefeshToken(null))
    // dispatch(setSpotifyUserPlayList([]))

    useEffect(() => {
        if(spotifyAccessToken && shouldLoadProfile.current){
            shouldLoadProfile.current = false
            onGetSpotifyUserProfile()
        }
    }, [spotifyAccessToken])

    const onGetSpotifyUserProfile = () => {
        spotifyApi.getSpotifyUser(spotifyAccessToken).then(rs => {
            dispatch(setSpotifyUserProfile(rs))
        }).catch(err => {
            if(err?.response?.data?.error?.status == 401){
                onRequireRefreshToken()
            } else {
                notification.warning({
                    message: _.get(err, ['response', 'data'], `Can't get Spotify data!`)
                })
                dispatch(setSpotifyUserProfile(null))
            }
        })
    }

    const onRequireRefreshToken = () => {
        spotifyApi.refreshSpotifyAccessToken(spotifyRefreshToken).then(rs => {
            if(rs.access_token){
                dispatch(setSpotifyAccessToken(rs.access_token))
                shouldLoadProfile.current = true
            } else {
                dispatch(logoutSpotify())
                dispatch(setSpotifyUserPlayList([]))
                dispatch(setSpotifyDeviceId(""))
                dispatch(setSpotifyLastSelectedPlaylist(""))
            }
        }).catch(err => {
            dispatch(logoutSpotify())
            dispatch(setSpotifyUserPlayList([]))
            dispatch(setSpotifyDeviceId(""))
            dispatch(setSpotifyLastSelectedPlaylist(""))
        })
    }

    return <>
        <SpotifyPlayer />
    </>
}

export default SpotifyContainer