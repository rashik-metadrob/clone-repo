import { useEffect, useRef, useState } from "react";
import "./styles.scss"
import AudioIcon from "../../../../assets/images/project/audio.png"
import NoAudioIcon from "../../../../assets/images/project/no-audio.png"
import { useSelector } from "react-redux";
import { getIsMusicPaused, setMusicIsPaused } from "../../../../redux/spotifySlice";
import { useAppDispatch } from "../../../../redux";
import { getMusicAndAudioSource } from "../../../../redux/appSlice";
import { MUSIC_AND_AUDIO_SOURCE } from "../../../../utils/constants";

const playersList = [
    `${process.env.REACT_APP_HOMEPAGE}/musics/bestsongs.mp3`
]
// SPOTIFY LOGIC
const SongsPlayer = () => {
    const dispatch = useAppDispatch()
    const musicIsPaused = useSelector(getIsMusicPaused)
    const musicAndAudioSource = useSelector(getMusicAndAudioSource)

    const ontogglePlay = () => {
        if(musicAndAudioSource === MUSIC_AND_AUDIO_SOURCE.SPOTIFY && window.spotifyPlayer){
            window.spotifyPlayer.togglePlay()
        } else {
            dispatch(setMusicIsPaused(!musicIsPaused))
        }
    }

    return <>
        <button className="btn-mute-background-music" onClick={() => {ontogglePlay()}}>
            <img src={!musicIsPaused ? AudioIcon : NoAudioIcon} alt="" />
        </button>
    </>
}
export default SongsPlayer;