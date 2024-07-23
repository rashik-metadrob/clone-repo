import { OrbitControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Vector3 } from "three"

const ModelControl = () => {
    const {camera} = useThree()
    const orbitRef = useRef()

    useEffect(() => {
    }, [])

    return <>
        <OrbitControls 
            ref={orbitRef}
            enabled={true}
            enableRotate={true}
        />
    </>
}
export default ModelControl