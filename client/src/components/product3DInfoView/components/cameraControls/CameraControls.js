import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import CameraHelper from "../../../canvasContainer/components/cameraControls/CameraHelper"
import { useThree } from "@react-three/fiber"
import _ from "lodash"

const CameraControls = forwardRef(({
}, ref) => {
    const cameraRef = useRef()

    const { gl, size } = useThree()
    window.extraGL = gl

    useEffect(() => {
        const debounce = _.debounce(() => {
            const container = document.querySelector(".product-3d-info-canvas-container")
            if(container){
                const bounds = container.getBoundingClientRect()
                gl.setSize(bounds.width, bounds.height)
            }
        }, 500)
        debounce()
    },[gl, size])

    useImperativeHandle(ref, () => ({
        fitToBox: (box) => {
            cameraRef.current.fitToBox(box, true, {
                paddingLeft: 0.1, 
                paddingRight: 0.1,
                paddingBottom: 0.2,
                paddingTop: 0.2
            })
        }
    }), [])

    return <>
        <CameraHelper 
            ref={cameraRef}
        />
    </>
})
export default CameraControls