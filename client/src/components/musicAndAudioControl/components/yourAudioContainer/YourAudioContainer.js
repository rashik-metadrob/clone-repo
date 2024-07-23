import { useSelector } from "react-redux"
import { getIsMusicPaused, setMusicIsPaused } from "../../../../redux/spotifySlice"
import { useEffect, useMemo, useRef } from "react"
import { useAppDispatch } from "../../../../redux"
import { getListAudios, setListAudios } from "../../../../redux/audioSlice"
import _ from "lodash"
import { getAssetsUrl } from "../../../../utils/util"


const YourAudioContainer = () => {
    const dispatch = useAppDispatch()
    const audioRef = useRef()
    const intervalRef = useRef()
    const musicIsPaused = useSelector(getIsMusicPaused)
    const listAudios = useSelector(getListAudios)
    const playingAudioSrc = useMemo(() => {
        return  _.get(_.find(listAudios, {isPlaying: true}), ['filePath'], '')
    }, [listAudios])
    
    useEffect(() => {
        return () => {
            dispatch(setMusicIsPaused(true))
        }
    }, [])

    useEffect(() => {
        onPlayAudio()
    }, [musicIsPaused])

    const onNextAudio = () => {
        if(listAudios.length === 1){
            onPlayAudio()
            return
        }
        const currentIndex = _.findIndex(listAudios, {isPlaying: true})
        const nextIndex = currentIndex + 1

        let cloneAudios = _.cloneDeep(listAudios)
        cloneAudios = cloneAudios.map((el, index) => {
            if(index !== nextIndex % listAudios.length){
                el.isPlaying = false
            } else {
                el.isPlaying = true
            }
            return el
        })

        dispatch(setListAudios(cloneAudios))
    }

    const clearIntervalPlayMusic = () => {
        if(intervalRef.current) {
            clearInterval(intervalRef.current)
        }
    }

    const onPlayAudio = () => {
        clearIntervalPlayMusic()
        if(!audioRef.current){
            return
        }
        if(musicIsPaused){
            audioRef.current.pause()
            return
        }
        audioRef.current.play().then(rs => {
        }).catch(err => {
            // intervalRef.current = setInterval(() => {
            //     console.log('PLAY MUSIC')
            //     audioRef.current.play().then(rs => {
            //         clearIntervalPlayMusic()
            //     })
            // }, 2000)
        })
    }

    return <>
        {playingAudioSrc && <audio 
            ref={audioRef}
            src={getAssetsUrl(playingAudioSrc)}
            hidden
            onLoadedData={() => {
                onPlayAudio()
            }}
            onEnded={() => {
                onNextAudio()
            }}
        >
        </audio>}
    </>
}

export default YourAudioContainer