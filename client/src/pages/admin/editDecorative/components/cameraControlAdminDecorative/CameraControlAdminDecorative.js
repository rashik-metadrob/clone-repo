import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import CameraControlsDefault from 'camera-controls';
import CameraHelper from "../../../../../components/canvasContainer/components/cameraControls/CameraHelper";

const CameraControlAdminDecorative = forwardRef(({
}, ref) => {
    const cameraRef = useRef()
    const keyStates = useRef({});
    const { gl } = useThree()

    useImperativeHandle(ref, () => ({
        selectWall: (el) => {},
        cameraRef: () => {return cameraRef.current},
        fitToBox: (box) => {
            cameraRef.current.fitToBox(box, true, {
                paddingLeft: 0.1, 
                paddingRight: 0.1,
                paddingBottom: 0.2,
                paddingTop: 0.2
            })
        }
    }));

    useEffect(() => {
        cameraRef.current.setLookAt( 0, 1.5, 5, 0, 0, 0, false )
        // cameraRef.current.minZoom = 1;
        // cameraRef.current.maxZoom = 1;
        // cameraRef.current.truckSpeed = 5;
        // cameraRef.current.mouseButtons.wheel = CameraControlsDefault.ACTION.NONE
        if(cameraRef.current){
            cameraRef.current.saveState();
        }
    },[])

    useEffect(() => {
        document.addEventListener("keydown", activeKeyState);
        document.addEventListener("keyup", deActiveKeyState);
        document.addEventListener("visibilitychange", onTabActiveChange)
        // gl.domElement.addEventListener('wheel', onWheel)

        return () => {
            document.removeEventListener("keydown", activeKeyState);
            document.removeEventListener("keyup", deActiveKeyState);
            document.removeEventListener("visibilitychange", onTabActiveChange)
            // gl.domElement.removeEventListener('wheel', onWheel)
        };
    }, []);

    const onTabActiveChange = () => {
        if(document.hidden){
            keyStates.current = {}
        }
    }

    // const onWheel = e => {
    //     if(e.deltaY < 0){
    //         cameraRef.current.forward( 0.4, true )
    //     } else {
    //         cameraRef.current.forward( -0.4, true )
    //     }
    // }

    // useFrame((state, delta) => {
    //     const deltaTime = Math.min(0.05, delta);
    //     controls(deltaTime);
    // });

    const checkKeydownInCanvas = (e) => {
        return e.target.tagName === "BODY"
    }

    const activeKeyState = (event) => {
        if(checkKeydownInCanvas(event)){
            keyStates.current[event.code] = true;
        }
    };
    
    const deActiveKeyState = (event) => {
        keyStates.current[event.code] = false;
    };

    function controls(deltaTime) {
        if(!cameraRef.current){
            return
        }
        let damping = Math.exp(-4 * deltaTime) - 1;
        if (keyStates.current["KeyW"] || keyStates.current["ArrowUp"]) {
            cameraRef.current.forward( -damping, true )
        }
        if (keyStates.current["KeyS"] || keyStates.current["ArrowDown"]) {
            cameraRef.current.forward( damping, true ) 
        }
        if (keyStates.current["KeyA"] || keyStates.current["ArrowLeft"]) {
            cameraRef.current.truck( damping, 0, true )
        }
        if (keyStates.current["KeyD"] || keyStates.current["ArrowRight"]) {
            cameraRef.current.truck( -damping, 0, true )
        }
        if (keyStates.current["KeyQ"]) {
            cameraRef.current.truck( 0, damping, true )
        }
        if (keyStates.current["KeyE"]) {
            cameraRef.current.truck( 0, -damping, true )
        }
    }

    return <>
        <CameraHelper 
            ref={cameraRef}
            smoothTime={1}
        />
    </>
})
export default CameraControlAdminDecorative;