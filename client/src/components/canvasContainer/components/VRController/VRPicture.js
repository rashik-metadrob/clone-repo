import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getSelectedObject } from "../../../../redux/modelSlice";
import { useLoader, useThree } from "@react-three/fiber";
import { Box3, DoubleSide, TextureLoader } from "three";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment"
import { createTracking } from "../../../../api/tracking.api";
import { PRODUCT_TYPES, TRACKING_ACTION_NAME, TRACKING_TYPE } from "../../../../utils/constants";
import { Interactive } from "@react-three/xr";
import VRDescriptionBoard from "./VRDescriptionBoard";
import { Center } from "@react-three/drei";
import { getAssetsUrl, is3DFile, mergeScale } from "../../../../utils/util";
import _ from "lodash"

const VRPicture = ({
    item,
    onSelectObject = () => {},
    onAddToCart = () => {},
    index,
    onLoaded = () => {}
}) => {
    const {id: projectId} = useParams()
    const clickTimeRef = useRef(0)
    const timeoutRef = useRef()
    let location = useLocation();

    const imageRef = useRef()

    const [objectBox, setObjectBox] = useState()

    const [position, setPosition] = useState([0, 0, 0])
    const [rotation, setRotation] = useState([0, 0, 0])
    const [scale, setScale] = useState([1, 1, 1])

    const productRef = useRef()

    const selectedObject = useSelector(getSelectedObject)

    const pictureUrl = useMemo(() => {
        let assetUrl = item.url
        let galleryId = _.get(item, ['selectedGalleryId'], '')
        if(galleryId){
            const selectedGallery = _.find(_.get(item, ['gallery'], []), (el) => el?.id === galleryId)
            if(selectedGallery && selectedGallery.image && !is3DFile(selectedGallery.image)){
                assetUrl = selectedGallery.image
            }
        }

        return assetUrl
    }, [item?.selectedGalleryId])

    const usedTexture = useLoader(TextureLoader, getAssetsUrl(pictureUrl))

    const materialConfigs = useMemo(() => {
        let galleryId = _.get(item, ['selectedGalleryId'], '')
        const gallery = _.find(_.get(item, ['gallery'], []), (el) => el?.id === galleryId)
        return _.pick(gallery?.materialConfigs, ["envMapIntensity"]);
    }, [JSON.stringify(_.get(item, ['gallery'], ''))])

    // Always in preview mode
    const isDecor = useMemo(() => { return item.type === PRODUCT_TYPES.DECORATIVES || item.type === PRODUCT_TYPES.ELEMENT}, [item])

    useEffect(() => {
        if(usedTexture && usedTexture.source.data){
            const {naturalWidth, naturalHeight} = usedTexture.source.data;
            imageRef.current.scale.set(1, naturalHeight / naturalWidth, 10)
            setObjectBox(new Box3().setFromObject(productRef.current))

            onLoaded(index)
        }
    }, [usedTexture])

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
        setTimeout(() => {
            if(productRef.current){
                setObjectBox(new Box3().setFromObject(productRef.current))
            }
        }, 200)
    }, [scale])

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
                    // position={[0, 0, 0.1]}
                >
                    {/* <Center top>
                        <Image ref={imageRef} url={getAssetsUrl(item.url)}/>
                    </Center> */}

                    <Center top>
                        <mesh ref={imageRef}>
                            <planeGeometry args={[1, 1]} />
                            <meshStandardMaterial map={usedTexture} side={DoubleSide} transparent={true} {...materialConfigs}/>
                        </mesh>
                    </Center>
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
    </>
}
export default VRPicture;