import { useFrame, useLoader } from "@react-three/fiber"
import { MODEL_BLOCK } from "../../../../utils/constants"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Suspense, useEffect, useMemo, useRef } from "react"
import { Center } from "@react-three/drei"
import _ from "lodash"
import { Box3 } from "three"
import { apllyMaterials, buildGraph, getAssetsUrl, is3DFile } from "../../../../utils/util"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { MeshoptDecoder } from'three/addons/libs/meshopt_decoder.module.js'

const Product3DModel = ({
    item,
    onFitToObject = () => {},
    isAutoRotate,
    selectedBackground = "3D"
}) => {
    const productRef = useRef()
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

    const model = useLoader(
        GLTFLoader, 
        getAssetsUrl(is3DFile(selectedBackground) ? selectedBackground : productUrl), 
        loader => {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath( `${process.env.REACT_APP_HOMEPAGE}/draco/` );
            dracoLoader.setDecoderConfig({type: "js"})
            loader.setDRACOLoader(dracoLoader);
            loader.setMeshoptDecoder(MeshoptDecoder)
    })

    const object = useMemo(() => {
        const clone = model.scene.clone();
        if(clone){
            clone.traverse(el => {
                if(el.isMesh){
                    el.material = el.material.clone()
                }
            })
        }
        return clone;
    },[model])

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
        if(model){
            const debounce = _.debounce(() => {
                if(productRef.current){
                    onFitToObject(new Box3().setFromObject(productRef.current))
                }
            }, 200)

            debounce()
        }
    }, [model])

    useFrame(() => {
        if(isAutoRotate && productRef.current){
            productRef.current.rotation.y = productRef.current.rotation.y + Math.PI / 200
        }
    })

    return <>
        <Suspense fallback={null}>
            <group ref={productRef}>
                <Center>
                    <primitive
                        object={object}
                    />
                </Center>
            </group>
        </Suspense>
    </>
}

const Product3DModelContainer = (props) => {
    if(props?.item?.block && props?.item?.block === MODEL_BLOCK["2D"] && props?.selectedBackground === "3D"){
        return null
    }

    return <Product3DModel {...props} />
}

export default Product3DModelContainer