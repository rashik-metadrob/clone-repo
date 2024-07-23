import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useThree } from "@react-three/fiber";
import CameraHelper from "../../canvasContainer/components/cameraControls/CameraHelper";
import _ from "lodash";

const CameraControlsTextEditor = forwardRef(({
}, ref) => {
    const cameraRef = useRef()
    const { gl, size, camera, setSize } = useThree()
    window.abcGL = size

    useImperativeHandle(ref, () => ({
        cameraRef: () => {return cameraRef.current},
        fitToBox: (box) => {
            return cameraRef.current.fitToBox(box, true, {
                paddingLeft: 0.2, 
                paddingRight: 0.2,
                paddingBottom: 0.2,
                paddingTop: 0.2
            })
        }
    }));

    useEffect(() => {
        cameraRef.current.minZoom = 1;
        cameraRef.current.maxZoom = 1;
        cameraRef.current.truckSpeed = 5;
        if(cameraRef.current){
            cameraRef.current.saveState();
        }
    },[])

    useEffect(() => {
        const debounce = _.debounce(() => {
            const container = document.querySelector(".canvas-text-editor-container")
            if(container){
                const bounds = container.getBoundingClientRect()
                console.log('bounds.height', bounds.height,  bounds.width)
                if(size.width !== bounds.width || size.height !== bounds.height){
                    gl.setSize(bounds.width, bounds.height)
                    setSize(bounds.width, bounds.height)
                }
            }
        }, 200)
        debounce()
    },[camera, gl, size])

    return <>
        <CameraHelper 
            ref={cameraRef}
            smoothTime={1}
        />
    </>
})
export default CameraControlsTextEditor;