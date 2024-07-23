import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import CameraHelper from "./CameraHelper";
import { Box3, Euler, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Capsule } from "three/addons/math/Capsule.js";
import {isMobile} from 'react-device-detect';
import { DESKTOP_CAMERA_SPEED, EVENT_NAME, MOBILE_CAMERA_SPEED, TREE_DATA_NODE_TYPE } from "../../../../utils/constants";
import { useSelector } from "react-redux";
import { getListSpawnPoints, getSelectedObject, getTreeData } from "../../../../redux/modelSlice";
import CameraControlsDefault from 'camera-controls';
import { findNodeOfTreeData, traverseTreeData } from "../../../../utils/treeData.util";
import _ from "lodash";

const CAMERA_TARGET_OFFSET = 0.5;
const CameraControls = forwardRef(({
}, ref) => {
    const cameraRef = useRef()
    window.cameraRef = cameraRef
    const {scene, gl} = useThree()

    const keyStates = useRef({});
    const playerCollider = useRef(
        new Capsule(new Vector3(0, 1, 5), new Vector3(0, 1.5, 5), 0.35)
    );

    const onSelectWallAnimation = useRef()

    const selectedObject = useSelector(getSelectedObject)
    const spawnPoints = useSelector(getListSpawnPoints)
    const treeData = useSelector(getTreeData)

    useImperativeHandle(ref, () => ({
        // This function zoom camera to wall
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

            // camera.setRotationFromMatrix(new Matrix4().fromArray(el.matrixWorld))
            // camera.position.set(el.position.x, el.position.y, el.position.z)
        },
        cameraRef: () => {return cameraRef.current},
        onMove: (keyW, keyS, keyA, keyD) => {
            keyStates.current["KeyW"] = keyW;
            keyStates.current["KeyS"] = keyS;
            keyStates.current["KeyA"] = keyA;
            keyStates.current["KeyD"] = keyD;      
        },
        onEndMove: () => {
            keyStates.current["KeyW"] = false;
            keyStates.current["KeyS"] = false;
            keyStates.current["KeyA"] = false;
            keyStates.current["KeyD"] = false;     
        },
        focusToSelectedObject: () => {
            focusToSelectedObject()
        }
    }));

    useEffect(() => {
        if(cameraRef.current){
            cameraRef.current.setLookAt( 0, 1.5, 5, 0, 1.5, 4, false )
            cameraRef.current.minZoom = 1;
            cameraRef.current.maxZoom = 1;
            cameraRef.current.azimuthRotateSpeed= isMobile ? 0.2 : 1
            cameraRef.current.polarRotateSpeed= isMobile ? 0.2 : 1
            cameraRef.current.truckSpeed = 5;
            // cameraRef.current.minDistance = 1;
            // cameraRef.current.maxDistance = 1;
            cameraRef.current.mouseButtons.wheel = CameraControlsDefault.ACTION.NONE
            setInitCameraPositionWithRandomSpawnPoint()
            if(cameraRef.current){
                cameraRef.current.saveState();
            }
        }
    },[])

    useEffect(() => {
        setInitCameraPositionWithRandomSpawnPoint()
    }, [spawnPoints])

    const onHighlightObject = (id) => {
        console.log('onHighlightObject', id)
    }

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

    const onWheel = e => {
        if(!cameraRef.current){
            return
        }
        if(e.deltaY < 0){
            cameraRef.current.forward( 0.4, true )
        } else {
            cameraRef.current.forward( -0.4, true )
        }
    }

    const focusToSelectedObject = () => {
        if(selectedObject){
            const object = scene.getObjectByName(`prod-${selectedObject}`)
            if(object){
                object.updateWorldMatrix(true, true)
                const objectBox = new Box3().setFromObject(object)

                if(cameraRef.current){
                    cameraRef.current.fitToBox(objectBox, true, {
                        paddingTop: 0.2,
                        paddingRight: 0.2,
                        paddingBottom: 0.2,
                        paddingLeft: 0.2
                    })
                }
            } else {
                const node = findNodeOfTreeData(treeData, selectedObject)
                if(node && _.get(node, ['nodeType']) === TREE_DATA_NODE_TYPE.FOLDER){
                    const keys = traverseTreeData([], node)
                    
                    const box = new Box3()
                    let shouldFocus = false

                    keys.forEach(key => {
                        const obj = scene.children.find(o => o?.userData?.id === key)
                        if(obj){
                            box.expandByObject(obj)
                            shouldFocus = true
                        }
                    })
                    
                    if(shouldFocus && cameraRef.current){
                        cameraRef.current.fitToBox(box, true, {
                            paddingTop: 0.2,
                            paddingRight: 0.2,
                            paddingBottom: 0.2,
                            paddingLeft: 0.2
                        })
                    }
                }
            }
        }
    }

    const activeKeyState = useCallback((event) => {
        if(event.code === "KeyF" && checkKeydownTargetIsNotInput(event)){
            focusToSelectedObject()
        }
        if(checkKeydownInCanvas(event)){
            keyStates.current[event.code] = true;
        }
    }, [treeData, selectedObject])
    
    const deActiveKeyState = (event) => {
        keyStates.current[event.code] = false;
    };

    useEffect(() => {
        document.addEventListener("keydown", activeKeyState);
        document.addEventListener("keyup", deActiveKeyState);

        return () => {
            document.removeEventListener("keydown", activeKeyState);
            document.removeEventListener("keyup", deActiveKeyState);
        };
    }, [selectedObject, activeKeyState]);
    
    useEffect(() => {
        gl.domElement.addEventListener('wheel', onWheel)
        document.addEventListener("visibilitychange", onTabActiveChange)
        return () => {
            gl.domElement.removeEventListener('wheel', onWheel)
            document.removeEventListener("visibilitychange", onTabActiveChange)
        }
    }, [])

    const onTabActiveChange = () => {
        if(document.hidden){
            keyStates.current = {}
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

    const checkKeydownTargetIsNotInput = (e) => {
        return e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA"
    }

    function controls(deltaTime) {
        if(!cameraRef.current){
            return
        }
        let damping = Math.exp(-4 * deltaTime * (isMobile ? MOBILE_CAMERA_SPEED : DESKTOP_CAMERA_SPEED) / (2 * DESKTOP_CAMERA_SPEED)) - 1;
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
        if (keyStates.current["KeyQ"] && !selectedObject) {
            cameraRef.current.truck( 0, damping, true )
        }
        if (keyStates.current["KeyE"] && !selectedObject) {
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
export default CameraControls;