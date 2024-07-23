import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Euler, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Capsule } from "three/addons/math/Capsule.js";
import CameraHelper from "../../../canvasContainer/components/cameraControls/CameraHelper";
import CameraControlsDefault from 'camera-controls';
import { useSelector } from "react-redux";
import { getListSpawnPoints } from "../../../../redux/modelSlice";

const CAMERA_TARGET_OFFSET = 0.5;
const CameraControlsAdmin = forwardRef(({
}, ref) => {
    const cameraRef = useRef()
    const keyStates = useRef({});
    const { gl } = useThree()
    const spawnPoints = useSelector(getListSpawnPoints)
    const onSelectWallAnimation = useRef()

    useImperativeHandle(ref, () => ({
        selectWall: (el) => {
            if(cameraRef.current){
                onSelectWallAnimation.current = true;
                
                // Default see -z
                let lookDirection = new Vector3(0, 0, CAMERA_TARGET_OFFSET);
                lookDirection.applyEuler(new Euler(el.rotation.x, el.rotation.y, el.rotation.z, 'XYZ'))

                cameraRef.current.setLookAt( 
                    el.position.x, 
                    el.position.y, 
                    el.position.z, 
                    el.position.x - lookDirection.x, 
                    el.position.y - lookDirection.y, 
                    el.position.z - lookDirection.z, 
                    true 
                ).then(() => {
                    onSelectWallAnimation.current = false;
                })
            }
        },
        cameraRef: () => {return cameraRef.current}
    }));

    useEffect(() => {
        cameraRef.current.setLookAt( 0, 1.5, 5, 0, 1.5, 4, false )
        cameraRef.current.minZoom = 1;
        cameraRef.current.maxZoom = 1;
        cameraRef.current.truckSpeed = 5;
        cameraRef.current.mouseButtons.wheel = CameraControlsDefault.ACTION.NONE
        setInitCameraPositionWithRandomSpawnPoint()
        if(cameraRef.current){
            cameraRef.current.saveState();
        }
    },[])

    useEffect(() => {
        setInitCameraPositionWithRandomSpawnPoint()
    }, [spawnPoints])

    const setInitCameraPositionWithRandomSpawnPoint = () => {
        if(spawnPoints && spawnPoints.length > 0 && cameraRef.current){
            const pointIndex = Math.floor(Math.random() * spawnPoints.length)
            const spawnPoint = spawnPoints[pointIndex]
      
            // Default see -z
            let lookDirection = new Vector3(0, 0, 1);
            lookDirection.applyEuler(new Euler(spawnPoint.rotation.x, spawnPoint.rotation.y, spawnPoint.rotation.z, 'XYZ'))
      
            const targetPoint = new Vector3(spawnPoint.position.x - lookDirection.x, spawnPoint.position.y - lookDirection.y, spawnPoint.position.z - lookDirection.z)

            cameraRef.current.setLookAt( spawnPoint.position.x, spawnPoint.position.y, spawnPoint.position.z, targetPoint.x, targetPoint.y, targetPoint.z, false )
            if(cameraRef.current){
                cameraRef.current.saveState();
            }
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", activeKeyState);
        document.addEventListener("keyup", deActiveKeyState);
        document.addEventListener("visibilitychange", onTabActiveChange)
        gl.domElement.addEventListener('wheel', onWheel)

        return () => {
            document.removeEventListener("keydown", activeKeyState);
            document.removeEventListener("keyup", deActiveKeyState);
            document.removeEventListener("visibilitychange", onTabActiveChange)
            gl.domElement.removeEventListener('wheel', onWheel)
        };
    }, []);

    const onTabActiveChange = () => {
        if(document.hidden){
            keyStates.current = {}
        }
    }

    const onWheel = e => {
        if(e.deltaY < 0){
            cameraRef.current.forward( 0.4, true )
        } else {
            cameraRef.current.forward( -0.4, true )
        }
    }

    useFrame((state, delta) => {
        if(onSelectWallAnimation.current){
            return
        }
        const deltaTime = Math.min(0.05, delta);
        controls(deltaTime);
    });

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
export default CameraControlsAdmin;