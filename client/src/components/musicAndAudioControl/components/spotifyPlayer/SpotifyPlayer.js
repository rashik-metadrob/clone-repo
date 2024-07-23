import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotifyAccessToken, getSpotifyLastSelectedPlaylist, getSpotifyUserProfile } from "../../../../redux/appSlice";
import { notification } from "antd";
import _ from "lodash";
import { setSpotifyCurrentTrack, setSpotifyDeviceId, setSpotifyIsActive, setMusicIsPaused } from "../../../../redux/spotifySlice";
import spotifyApi from "../../../../api/spotify.api";

const SpotifyPlayer = (props) => {
    const dispatch = useDispatch()
    const spotifyUser = useSelector(getSpotifyUserProfile)
    const spotifyAccessToken = useSelector(getSpotifyAccessToken)
    const isLoaded = useRef(false)
    const spotifyLastSelectedPlaylist = useSelector(getSpotifyLastSelectedPlaylist)

    useEffect(() => {
        if(!spotifyAccessToken || isLoaded.current || !spotifyUser){
            return
        }
        if(window.spotifyPlayer && isLoaded.current){
            window.spotifyPlayer.connect()
            return
        }
        isLoaded.current = true
        if(window.Spotify){
            if(window.spotifyPlayer) {
                window.spotifyPlayer.disconnect()
            }
            initSpotifyPlayer()
        } else {
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
            window.onSpotifyWebPlaybackSDKReady = () => {
                initSpotifyPlayer()
            };
        }
    }, [spotifyAccessToken, spotifyUser]);

    useEffect(() => {
        return () => {
            if(window.spotifyPlayer){
                window.spotifyPlayer.disconnect()
            }
        }
    }, [])

    const initSpotifyPlayer = () => {
        const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { cb(spotifyAccessToken); },
            volume: 0.5
        });

        window.spotifyPlayer = player

        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            dispatch(setSpotifyDeviceId(device_id))

            playLastPlayList(device_id)
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.addListener('player_state_changed', ( state => {
            if (!state) {
                return;
            }
            dispatch(setSpotifyCurrentTrack(_.cloneDeep(state.track_window.current_track)))
            dispatch(setMusicIsPaused(state.paused))
        
            player.getCurrentState().then( state => { 
                (!state)? dispatch(setSpotifyIsActive(false)) : dispatch(setSpotifyIsActive(true))
            });
        
        }));            

        player.addListener('account_error', (data) => {
            console.log('account_error', data);
            const message = _.get(data, ['message'], '')
            if(message){
                notification.warning({
                    message
                })
            }
        });

        player.addListener('authentication_error', (data) => {
            console.log('authentication_error', data);
            isLoaded.current = false
        });

        player.addListener('autoplay_failed', (data) => {
            console.log('autoplay_failed', data);
        });

        player.addListener('progress', (data) => {
            // console.log('progress', data);
        });

        player.addListener('playback_error', (data) => {
            console.log('playback_error', data);
        });

        player.addListener('initialization_error', (data) => {
            console.log('initialization_error', data);
        });

        player.connect();
    }

    const playLastPlayList = (deviceId) => {
        if(spotifyLastSelectedPlaylist && spotifyAccessToken){
            spotifyApi.playPlayList(spotifyLastSelectedPlaylist, deviceId, spotifyAccessToken).then(data => {
                
            }).catch(err => {
            })
        }
    }

    return <>
    </>
}

export default SpotifyPlayer