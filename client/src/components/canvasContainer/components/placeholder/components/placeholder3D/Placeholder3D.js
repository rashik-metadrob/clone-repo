import { useLoader, useThree } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { getAssetsUrl } from "../../../../../../utils/util"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { Center } from "@react-three/drei"
import { MeshoptDecoder } from'three/addons/libs/meshopt_decoder.module.js'

const Placeholder3D = ({
    selectedProductToShow
}) => {
    const { invalidate } = useThree()
    const objectUrl = useMemo(() => {
        let assetUrl = selectedProductToShow.objectUrl
        return assetUrl
    }, [selectedProductToShow])

    const model = useLoader(
        GLTFLoader, 
        getAssetsUrl(objectUrl), 
        loader => {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath( `${process.env.REACT_APP_HOMEPAGE}/draco/` );
            dracoLoader.setDecoderConfig({type: "js"})
            loader.setDRACOLoader(dracoLoader);
            loader.setMeshoptDecoder(MeshoptDecoder)
        }
    )

    const object = useMemo(() => {
        if(!model){
            return null
        }
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
        if(object){
            invalidate()
        }
    }, [object])

    return <>
        {object && <primitive
            object={object}
        />}
    </>
}

export default Placeholder3D