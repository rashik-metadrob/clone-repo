import { Canvas } from "@react-three/fiber"
import Product3DModelContainer from "./components/product3DModel/Product3DModel"
import { AdaptiveDpr, AdaptiveEvents, OrbitControls } from "@react-three/drei"
import "./styles.scss"
import Product2DModelContainer from "./components/product2DModel/Product2DModel"
import CameraControls from "./components/cameraControls/CameraControls"
import { useEffect, useRef } from "react"
import { LinearToneMapping, Vector3 } from "three"

const Product3DInfoView = ({
    product,
    isAutoRotate,
    selectedBackground = "3D"
}) => {
    const cameraControlRef = useRef()

    // useEffect(() => {
    //     if(cameraControlRef.current){
    //         cameraControlRef.current.resetCamera()
    //     }
    // },[product?.url])

    const onFitToObject = (box) => {
        if(cameraControlRef.current){
            cameraControlRef.current.fitToBox(box)
        }
    }

    return <>
        <Canvas
            style={{
                width: "100%",
                height: "100%"
            }}
            camera={{ 
                fov: 45,
                near: 0.05,
                far: 100
            }}
            orthographic={false}
            gl={{
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: false,
                toneMappingExposure: 1,
                toneMapping: LinearToneMapping,
                useLegacyLights: true
            }}
            className="product-3d-info-canvas-container"
            frameloop='always'
        >
            <color args={["#FFF"]} attach={'background'} />
            <ambientLight intensity={0.5}/>
            <directionalLight position={[0, 10, 0]} intensity={0.8}/>

            <CameraControls ref={cameraControlRef}/>

            <Product3DModelContainer item={product} onFitToObject={onFitToObject} isAutoRotate={isAutoRotate} selectedBackground={selectedBackground}/>
            <Product2DModelContainer item={product} onFitToObject={onFitToObject} isAutoRotate={isAutoRotate} selectedBackground={selectedBackground}/>
        </Canvas>
    </>
}

const Product3DInfoViewContainer = (props) => {
    if(!props?.product?.url){
        return null
    }

    return <Product3DInfoView {...props} />
}

export default Product3DInfoViewContainer