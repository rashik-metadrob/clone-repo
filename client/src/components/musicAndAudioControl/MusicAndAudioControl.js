import { useSelector } from "react-redux"
import { getMusicAndAudioSource } from "../../redux/appSlice"
import { MUSIC_AND_AUDIO_SOURCE } from "../../utils/constants"
import SpotifyContainer from "./components/spotifyContainer/SpotifyContainer"
import YourAudioContainer from "./components/yourAudioContainer/YourAudioContainer"

const MusicAndAudioControl = () => {
    const musicAndAudioSource = useSelector(getMusicAndAudioSource)

    return <>
        {
            musicAndAudioSource === MUSIC_AND_AUDIO_SOURCE.SPOTIFY && <SpotifyContainer />
        }
        {
            musicAndAudioSource === MUSIC_AND_AUDIO_SOURCE.YOUR_AUDIO && <YourAudioContainer />
        }
    </>
}

export default MusicAndAudioControl