import { AdaptiveDpr, AdaptiveEvents, Line } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { LinearToneMapping, Vector3 } from "three"
import CameraControlsTextEditor from "../cameraControls/CameraControlsTextEditor"
import GroupTextContainer from "../groupTextContainer/GroupTextContainer"

const TextEditorCanvasContainer = forwardRef(({
    texts
}, ref) => {
    const cameraControl = useRef()
    const textGroupRef = useRef()
    const canvasRef = useRef()
    const [isPreviewText, setIsPreviewText] = useState(false)

    useImperativeHandle(ref, () => ({
        getCanvasPicture: () => {
            setIsPreviewText(true)
            const box = textGroupRef.current.getBox()
            const cameraRef = cameraControl.current.cameraRef()
            cameraRef.setPosition(0, 0, 5, false)
            return cameraControl.current.fitToBox(box).then(rs => {
                const imgData = textGroupRef.current.getCanvasImage()
                setIsPreviewText(false)

                return imgData
            })
        },
        getTextsInfo: () => {
            return textGroupRef.current.getTextsInfo()
        }
    }));

    return <>
        <Canvas
            camera={{ 
                fov: 45,
                position: new Vector3(0, 0, 5),
                near: 0.005,
                far: 1000
            }}
            orthographic={false}
            gl={{
                antialias: false,
                alpha: true,
                preserveDrawingBuffer: true,
                toneMappingExposure: 1,
                toneMapping: LinearToneMapping,
            }}
            ref={canvasRef}
            frameloop='always'
            className="canvas-text-editor-container"
        >
            <ambientLight intensity={1} />

            <Line 
                points={[[-10, 0, 0], [10, 0, 0]]}
                color="#FFF"
                lineWidth={1}
                visible={!isPreviewText}
            >
            </Line>
            <Line 
                points={[[0, -10, 0], [0, 10, 0]]}
                color="#FFF"
                lineWidth={1}
                visible={!isPreviewText}
            >
            </Line>

            <GroupTextContainer texts={texts} cameraControl={cameraControl} isPreviewText={isPreviewText} ref={textGroupRef}/>

            <CameraControlsTextEditor ref={cameraControl} />
        </Canvas>
    </>
})

export default React.memo(TextEditorCanvasContainer)