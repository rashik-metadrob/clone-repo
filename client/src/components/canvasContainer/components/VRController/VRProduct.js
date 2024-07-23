import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getSelectedObject } from "../../../../redux/modelSlice";
import { useFrame, useThree } from "@react-three/fiber";
import { AnimationMixer, Box3, DoubleSide, LoopOnce, LoopRepeat, PMREMGenerator, Raycaster, RepeatWrapping, Vector2, Vector3, VideoTexture } from "three";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment"
import { createTracking } from "../../../../api/tracking.api";
import { AVAILABLE_ANIMATION, EDITOR_MATERIAL_KEYS, PRODUCT_TYPES, PUBLISH_ROLE, TRACKING_ACTION_NAME, TRACKING_TYPE } from "../../../../utils/constants";
import { apllyMaterials, buildGraph, getAssetsUrl, is3DFile, loadModel, mergeScale } from "../../../../utils/util";
import { Interactive } from "@react-three/xr";
import VRDescriptionBoard from "./VRDescriptionBoard";
import _ from "lodash";
import { Html } from "@react-three/drei";
import MediaTexturePlaylist from "../product/components/mediaTexturePlaylist/MediaTexturePlaylist";

const VRProduct = ({
    item,
    onSelectObject = () => {},
    onAddToCart = () => {},
    index,
    onLoaded = () => {},
    onChangeMedia = () => {}
}) => {
    const [model, setModel] = useState()
    const [isPlayAnimation, setIsPlayAnimation] = useState(false);
    const {id: projectId} = useParams()
    const clickTimeRef = useRef(0)
    const timeoutRef = useRef()
    let location = useLocation();

    const { gl, camera } = useThree()

    const [object, setObject] = useState()
    const [objectBox, setObjectBox] = useState()

    const [position, setPosition] = useState([0, 0, 0])
    const [rotation, setRotation] = useState([0, 0, 0])
    const [scale, setScale] = useState([1, 1, 1])
    const [mediaSource, setMediaSource] = useState(null)
    const [distanceToCamera, setDistanceToCamera] = useState()

    const productRef = useRef()

    const selectedObject = useSelector(getSelectedObject)

    const productUrl = useMemo(() => {
        let assetUrl = item.url
        let galleryId = _.get(item, ['selectedGalleryId'], '')
        if(galleryId){
            const selectedGallery = _.find(_.get(item, ['gallery'], []), (el) => el?.id === galleryId)
            if(selectedGallery && selectedGallery.object && is3DFile(selectedGallery.object)){
                assetUrl = selectedGallery.object
            }
        }

        return assetUrl
    }, [item?.selectedGalleryId])

    // Always in preview mode
    const isDecor = useMemo(() => { return item.type === PRODUCT_TYPES.DECORATIVES || item.type === PRODUCT_TYPES.ELEMENT}, [item])

    const productPosition = useMemo(() => {
        return new Vector3(_.get(item, ['position', 'x'], 0), _.get(item, ['position', 'y'], 0), _.get(item, ['position', 'z'], 0))
    }, [item?.position])
    
    const mixer = useMemo(() => {
        if(object){
            let newMixer = new AnimationMixer(object);
            return newMixer
        } else {
            return null
        }
        
    }, [object])

    // const mediaSource = useMemo(() => {
    //     if(item?.media?.filePath?.includes(".mp4")){
    //         const vid = document.createElement("video");
    //         vid.id = item.id
    //         vid.src = getAssetsUrl(item.media.filePath);
    //         vid.crossOrigin = "Anonymous";
    //         vid.loop = !!item?.media?.isLoopVideo;
    //         vid.muted = true;
    //         if(!!item?.media?.isAutoPlay){
    //             vid.play();
    //         }
    //         return vid;
    //     } else {
    //         return null
    //     }
    // }, [item?.media?.filePath, item?.media?.isLoopVideo, item?.media?.isAutoPlay])

    const videoTexture = useMemo(() => {
        if(mediaSource){
            const texture = new VideoTexture(mediaSource)
            texture.wrapS = RepeatWrapping
            texture.wrapT = RepeatWrapping

            texture.repeat.set(1, 1)

            return texture
        } else {
            return null
        }
    }, [mediaSource])

    const action = useMemo(() => {
        if(mixer && model?.animations.length > 0){
            return mixer.clipAction(model.animations[0])
        } else {
            return null
        }
    }, [mixer, model])

    // useEffect(() => {
    //     return () => {
    //         if(mediaSource){
    //             mediaSource.pause()
    //             mediaSource.remove()
    //         }
    //     }
    // }, [mediaSource])

    // useEffect(() => {
    //     if(mediaSource && selectedObject === item.id && !!!item?.media?.isAutoPlay){
    //         mediaSource.play()
    //     } else {
    //         if(mediaSource && !!!item?.media?.isAutoPlay){
    //             mediaSource.pause()
    //         }
    //     }
    // },[mediaSource, selectedObject, item])

    useEffect(() => {
        loadModel(getAssetsUrl(productUrl), () => {}, gl)
        .then(model => {
            console.log('MODEL DOWNLOAD DONE')
            setModel(model)
        })
        .catch(err => {
            console.log('MODEL DOWNLOAD ERR')
        })
    },[productUrl])

    useFrame((a, delta) => {
        if(mixer && action){
            mixer.update(delta)
        }

        if(_.get(item, ['media', 'isSpatialAudio'], false)){
            setDistanceToCamera(_.round(camera.position.distanceTo(productPosition), 2))
        }
    })

    useEffect(() => {
        if(action && item?.availableAnimation !== AVAILABLE_ANIMATION.PLAY_NEVER){
            action.reset()
            if(item.availableAnimation === AVAILABLE_ANIMATION.LOOP_ONE){
                action.loop = LoopOnce
            } else {
                action.loop = LoopRepeat
            }
            action.play()
        }
    },[isPlayAnimation, action, item?.availableAnimation])

    useEffect(() => {
        if(selectedObject === item.id){
            setIsPlayAnimation(true)
        } else {
            setIsPlayAnimation(false)
        }
    },[item, selectedObject])

    useEffect(() => {
        setPosition([item.position.x, item.position.y, item.position.z])
        setRotation([item.rotation.x, item.rotation.y, item.rotation.z])
        setScale(mergeScale(item?.scale, _.get(item, ['uniformScale'], 0)))
    }, [item])

    useEffect(() => {
        setRotation([item.rotation.x, item.rotation.y, item.rotation.z])
    }, [item.rotation.x, item.rotation.y, item.rotation.z])

    useEffect(() => {
        setPosition([item.position.x, item.position.y, item.position.z])
    }, [item.position.x, item.position.y, item.position.z])

    useEffect(() => {
        setScale(mergeScale(item?.scale, _.get(item, ['uniformScale'], 0)))
    }, [item?.scale?.x, item?.scale?.y, item?.scale?.z, item?.uniformScale])

    useEffect(() => {
        if(object){
            setTimeout(() => {
                if(productRef.current){
                    setObjectBox(new Box3().setFromObject(productRef.current))
                }
            }, 200)
        }
    }, [scale, object])

    useEffect(() => {
        if(model?.scene){
            const clone = model.scene.clone();
            clone.traverse(el => {
                if(el.isMesh){
                    el.material = el.material.clone()
                }
            })
            if(clone){
                clone.traverse(el => {
                    if(el.isMesh){
                        if(videoTexture){
                            el.material = el.material.clone()
                        }
                        el.material.envMapIntensity = 2;
                        el.material.needsUpdate = true;

                        if(videoTexture){
                            const selectedMaterial = _.get(item, ['media', 'selectedMaterial'])
                            if(selectedMaterial === el.material?.name) {
                                el.material.map = videoTexture
                                el.material.side = DoubleSide
                            }
                        }
                    }
                })
            }
            setObject(clone)
        }
    }, [model, videoTexture, item?.media?.selectedMaterial])

    useEffect(() => {
        const selectedGalleryId = _.get(item, ['selectedGalleryId'], '')
        let savedMaterials = {}
        if(selectedGalleryId){
            const selectedGallery = _.find(_.get(item, ['gallery'], []), (el) => el.id === selectedGalleryId)
            savedMaterials = _.get(selectedGallery, ['materials'], {})
        }
        const material = buildGraph(object)
        apllyMaterials(material.materials, savedMaterials)
    }, [object, item?.gallery])

    useEffect(() => {
        if(object){
            onLoaded(index)
        }
    },[index, object, onLoaded])

    const handleCreateTracking = () => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            let traking = {
                trackingContainerId: projectId,
                type: TRACKING_TYPE.STORE,
                track: {
                    actionName: TRACKING_ACTION_NAME.CLICK_PRODUCT,
                    actionTime: moment().toString(),
                    actionValue: clickTimeRef.current,
                    actionTrackingId: item.objectId,
                    actionUnit: "time"
                }
            }
            createTracking(traking).then(rs => {
                clickTimeRef.current = 0
            })
        }, 1000)
    }

    const trackingClickItem = () => {
        if(!location.pathname.includes('publish')){
            return
        }
        clickTimeRef.current = clickTimeRef.current + 1

        handleCreateTracking()
    }

    const onPointerDown = (e) => {
        if(e.event.srcElement.tagName !== "CANVAS"){
            return
        }
        if(isDecor){
            return
        }
        
        if(e.event.intersections.length === 0){
            return
        }
        if(
            !((e.event?.distance && (e.event?.distance === e.event.intersections[0].distance)) 
            || (e.event?.intersection?.distance && (e.event?.intersection?.distance === e.event.intersections[0].distance)))
        ){
            return
        }
        trackingClickItem()
        onSelectObject(item.id)
    }

    const onCloseDescriptionBoard = () => {
        onSelectObject(null)
    }

    const onXRClick = useCallback((event) => {
        onPointerDown({
            event: event
        })
    }, [])

    return <>
        <group
            position={position}
            rotation={rotation}
            userData={{
                id: item.id
            }}
        >
            <Interactive
                onSelect={onXRClick}
            >
                <group
                    ref={productRef}
                    scale={scale}
                >
                    {object && <primitive
                        object={object}
                    />}
                </group>
            </Interactive>
            
            {!isDecor && <VRDescriptionBoard 
                productPosition={position}
                item={item} 
                onAddToCart={onAddToCart}
                onCloseDescriptionBoard={onCloseDescriptionBoard}
                visible={selectedObject === item.id}
                objectBox={objectBox}
            />}
        </group>

        <Html>
            <MediaTexturePlaylist 
                item={item}
                distanceToCamera={distanceToCamera}
                selectedObject={selectedObject}
                onChangeMedia={onChangeMedia}
                onVideoSourceChange={(video) => {setMediaSource(video)}}
            />
        </Html>
    </>
}
export default VRProduct;