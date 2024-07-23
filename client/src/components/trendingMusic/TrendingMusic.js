import "./styles.scss"
import { useEffect, useRef, useState } from "react"

import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { useDispatch, useSelector } from "react-redux"
import { getSpotifyAccessToken, getSpotifyUserProfile } from "../../redux/appSlice"
import { getSpotifyFocusPlayList, getSpotifyHitPopPlayList, getSpotifyUserPlayList, setSpotifyFocusPlayList, setSpotifyHitPopPlayList } from "../../redux/spotifySlice"
import spotifyApi from "../../api/spotify.api"
import _ from "lodash"
import SpotifyMusicCard from "../spotifyMusicCard/SpotifyMusicCard"

const TrendingMusic = ({
    onLoginSpotify = () => {}
}) => {
    const dispatch = useDispatch()
    const containerRef = useRef()
    const [isDisabledWheel, setIsDisabledWheel] = useState(false)

    const spotifyUser = useSelector(getSpotifyUserProfile)
    const spotifyAccessToken = useSelector(getSpotifyAccessToken)
    const spotifyHitPopPlayList = useSelector(getSpotifyHitPopPlayList)
    const spotifyFocusPlayList = useSelector(getSpotifyFocusPlayList)

    useEffect(() => {
        if(spotifyUser?.id && spotifyAccessToken){
            spotifyApi.getSpotifyCategoryPlaylist(spotifyAccessToken, 'pop').then(rs => {
                if(_.get(rs, ['playlists', 'items'], [])){
                    dispatch(setSpotifyHitPopPlayList(_.get(rs, ['playlists', 'items'], [])))
                }
            })
            spotifyApi.getSpotifyCategoryPlaylist(spotifyAccessToken, 'focus').then(rs => {
                if(_.get(rs, ['playlists', 'items'], [])){
                    dispatch(setSpotifyFocusPlayList(_.get(rs, ['playlists', 'items'], [])))
                }
            })
        }
    }, [spotifyUser, spotifyAccessToken])

    useEffect(() => {
        containerRef.current.addEventListener("mousewheel", onContainerWheel, {passive: false})
    }, [isDisabledWheel])

    const onContainerWheel = (e) => {
        if(isDisabledWheel){
            e.preventDefault();
        }
    }

    function onWheel(apiObj, ev) {
        // ev.preventDefault();
        // ev.stopPropagation();
        const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;
      
        if (isThouchpad) {
          ev.stopPropagation();
          return;
        }
      
        if (ev.deltaY < 0) {
          apiObj.scrollNext();
        } else if (ev.deltaY > 0) {
          apiObj.scrollPrev();
        }
    }

    return <>
        <div className="trending-music-wrapper" ref={containerRef}>
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
            {
                spotifyUser?.id && <>
                    <div className="music-container">
                        <div className="title">
                            Hit Pop
                        </div>
                        <div className="music-list-wrapper mt-[8px]" onPointerEnter={() => {setIsDisabledWheel(true)}} onPointerLeave={() => {setIsDisabledWheel(false)}}>
                            <ScrollMenu onWheel={onWheel} key={_.map(spotifyHitPopPlayList, el => el.id).join(',')}>
                                {
                                    spotifyHitPopPlayList && spotifyHitPopPlayList.map(el => (
                                        <SpotifyMusicCard key={`Hit-${el.id}`} info={el}/>
                                    ))
                                }
                            </ScrollMenu>
                        </div>
                    </div>
                    <div className="music-container mt-[10px]">
                        <div className="title">
                            Focus
                        </div>
                        <div className="music-list-wrapper mt-[8px]" onPointerEnter={() => {setIsDisabledWheel(true)}} onPointerLeave={() => {setIsDisabledWheel(false)}}>
                            <ScrollMenu onWheel={onWheel}>
                                {
                                    spotifyFocusPlayList && spotifyFocusPlayList.map(el => (
                                        <SpotifyMusicCard key={`Hit-${el.id}`} info={el}/>
                                    ))
                                }
                            </ScrollMenu>
                        </div>
                    </div>
                </>
            }
            
        </div>
    </>
}
export default TrendingMusic;