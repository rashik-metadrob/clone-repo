import _ from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"
import { getAssetsUrl } from "../../../../../../utils/util"
import { Vector3 } from "three"

const MediaTexturePlaylist = ({
    item,
    selectedObject,
    distanceToCamera= 0,
    onChangeMedia = () => {},
    onVideoSourceChange = () => {}
}) => {
    const mediaRef = useRef()
    const listMedias = useMemo(() => {
        return _.get(item, ['media', 'listMedias'], [])
    }, [item?.media])

    const playingMedia = useMemo(() => {
        return listMedias.length > 0 && _.find(listMedias, { isPlaying: true })
    }, [listMedias])

    const playingMediaSrc = useMemo(() => {
        return  _.get(playingMedia, ['filePath'], '')
    }, [playingMedia])

    const isEnablePlayingAudio = useMemo(() => {
        return  _.get(playingMedia, ['isEnableAudio'], '')
    }, [playingMedia])

    const isSpatialAudio = useMemo(() => {
        return  _.get(item, ['media', 'isSpatialAudio'], false)
    }, [item])

    const isPausedMedia = useMemo(() => {
        if(selectedObject === item.id && !!!item?.media?.isAutoPlay){
            return false
        } else {
            if(!!item?.media?.isAutoPlay){
                return false
            }
        }

        return true
    }, [item, selectedObject])

    const mediaVolume = useMemo(() => {
        if(isEnablePlayingAudio) {
            if(!isSpatialAudio) {
                return 1
            } else {
                if(distanceToCamera < 2) {
                    return 1
                } else if(distanceToCamera > 8) {
                    return 0
                } else {
                    return (8 - distanceToCamera) / 6
                }
            }
        } else {
            return 0
        }
    }, [isSpatialAudio, distanceToCamera, isEnablePlayingAudio])

    useEffect(() => {
        if(mediaRef.current) {
            mediaRef.current.volume = mediaVolume
        }
    }, [mediaVolume, playingMediaSrc])

    useEffect(() => {
        if(playingMediaSrc) {
            onVideoSourceChange(mediaRef.current)
        } else {
            onVideoSourceChange(null)
        }
    }, [playingMediaSrc])

    useEffect(() => {

    }, [isEnablePlayingAudio])

    useEffect(() => {
        onPlayMedia()
    }, [isPausedMedia])

    const onNextMedia = () => {
        if(listMedias.length === 1){
            onPlayMedia()
            return
        }
        const currentIndex = _.findIndex(listMedias, {isPlaying: true})
        const nextIndex = currentIndex + 1

        let cloneMedias = _.cloneDeep(listMedias)
        cloneMedias = cloneMedias.map((el, index) => {
            if(index !== nextIndex % listMedias.length){
                el.isPlaying = false
            } else {
                el.isPlaying = true
            }
            return el
        })

        onChangeMedia(selectedObject, {..._.cloneDeep(_.get(item, ['media'], {})), listMedias: cloneMedias})
    }

    const onPlayMedia = () => {
        if(!mediaRef.current){
            return
        }
        if(isPausedMedia){
            mediaRef.current.pause()
            return
        }
        mediaRef.current.play().then(rs => {
        }).catch(err => {
        })
    }

    return <>
        {playingMediaSrc && <video 
            ref={(value) => {
                mediaRef.current = value
                onVideoSourceChange(mediaRef.current)
            }}
            src={getAssetsUrl(playingMediaSrc)}
            hidden
            onLoadedData={() => {
                onPlayMedia()
            }}
            onEnded={() => {
                onNextMedia()
            }}
            crossOrigin="Anonymous"
            muted={true}
            style={{
                display: 'none'
            }}
        >
        </video>}
    </>
}
export default MediaTexturePlaylist