import { useLoader, useThree } from "@react-three/fiber"
import { DoubleSide, PlaneGeometry, TextureLoader } from "three"
import { getAssetsUrl } from "../../../../../../utils/util"
import { useEffect, useMemo, useRef } from "react"
import { Center } from "@react-three/drei"

const Placeholder2D = ({
    selectedProductToShow
}) => {
    const imageRef = useRef()
    const { invalidate } = useThree()
    const pictureUrl = useMemo(() => {
        let assetUrl = selectedProductToShow.objectUrl
        return assetUrl
    }, [selectedProductToShow])

    const usedTexture = useLoader(TextureLoader, getAssetsUrl(pictureUrl))

    const planeImageGeo = useMemo(() => { return new PlaneGeometry(1, 1) }, [])

    useEffect(() => {
        if(usedTexture && usedTexture.source.data){
            invalidate()
            const {naturalWidth, naturalHeight} = usedTexture.source.data;
            imageRef.current.scale.set(1, naturalHeight / naturalWidth, 10)
        }
    }, [usedTexture])

    return <>
        <Center>
            <mesh ref={imageRef} geometry={planeImageGeo}>
                <meshStandardMaterial map={usedTexture} side={DoubleSide} transparent={false}/>
            </mesh>
        </Center>

    </>
}
export default Placeholder2D