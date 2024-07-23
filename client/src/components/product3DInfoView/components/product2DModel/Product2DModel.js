import { useFrame, useLoader } from "@react-three/fiber"
import { MODEL_BLOCK } from "../../../../utils/constants"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Suspense, useEffect, useMemo, useRef } from "react"
import { Center } from "@react-three/drei"
import _ from "lodash"
import { Box3, DoubleSide, PlaneGeometry, TextureLoader } from "three"
import { getAssetsUrl, is3DFile } from "../../../../utils/util"

const Product2DModel = ({
    item,
    onFitToObject = () => {},
    isAutoRotate
}) => {
    const productRef = useRef()
    const imageRef = useRef()
    const planeImageGeo = useMemo(() => { return new PlaneGeometry(1, 1) }, [])

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

    console.log('pictureUrl', pictureUrl)

    const usedTexture = useLoader(TextureLoader, getAssetsUrl(pictureUrl))
   
    useEffect(() => {
        if(usedTexture && usedTexture.source.data){
            const {naturalWidth, naturalHeight} = usedTexture.source.data;
            imageRef.current.scale.set(1, naturalHeight / naturalWidth, 10)

            onFitToObject(new Box3().setFromObject(productRef.current))
        }
    }, [usedTexture])

    useFrame(() => {
        if(isAutoRotate && productRef.current){
            productRef.current.rotation.y = productRef.current.rotation.y + Math.PI / 200
        }
    })

    return <>
        <Suspense fallback={null}>
            <group ref={productRef}>
                <Center>
                    <mesh ref={imageRef} geometry={planeImageGeo}>
                        <meshStandardMaterial map={usedTexture} side={DoubleSide} transparent={true}/>
                    </mesh>
                </Center>
            </group>
        </Suspense>
    </>
}

const Product2DModelContainer = (props) => {
    if(!props?.item?.block || props?.item?.block === MODEL_BLOCK["3D"] || props?.selectedBackground !== "3D"){
        return null
    }

    return <Product2DModel {...props} />
}

export default Product2DModelContainer