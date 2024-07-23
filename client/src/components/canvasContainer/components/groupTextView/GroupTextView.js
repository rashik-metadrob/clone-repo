import React, { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { getIsPreviewModel, getSelectedObject, getTreeData } from "../../../../redux/modelSlice"
import { Select } from "@react-three/postprocessing"
import { Center } from "@react-three/drei"
import _ from "lodash"
import TextContainerView from "../textContainerView/TextContainerView"
import { useGesture } from "@use-gesture/react"
import { useThree } from "@react-three/fiber"
import { Box3, Euler, Matrix3, Matrix4, Vector2, Vector3 } from "three"
import EditorMenuHtml from "../editorMenuHtml/EditorMenuHtml"
import { getSnapPoint, isPublishModeLocation, isRightClick, mergeScale } from "../../../../utils/util"
import { useLocation } from "react-router-dom"
import { findNodeOfTreeData, traverseTreeData } from "../../../../utils/treeData.util"
import { TREE_DATA_NODE_TYPE } from "../../../../utils/constants"
const GroupTextView = ({
    item,
    cameraControl,
    onSelectObject = () => {},
    onChangePosition = () => {},
    snapPoints,
    onChangeRotation = () => {},
    onShowObjectDetail = () => {},
    onCopy = () => {},
    onPaste = () => {},
    onDelete = () => {},
    onLock = () => {},
    onDuplicate = () => {}
}) => {
    const groupContainerRef = useRef()
    const location = useLocation()
    const { gl, raycaster, camera, scene } = useThree()
    const isPreviewMode = useSelector(getIsPreviewModel)
    const groupTextRef = useRef()
    const treeData = useSelector(getTreeData)
    const position = useMemo(() => {
        return [item.position.x ?? 0, item.position.y ?? 0, item.position.z ?? 0]
    }, [item.position.x, item.position.y, item.position.z])
    const isAxesHelper = useMemo(() => { return _.get(item, ['axesHelper'], false) }, [item])

    // const [rotation, setRotation] = useState([0, 0, 0])
    // const [scale, setScale] = useState([1, 1, 1])
    const selectedObject = useSelector(getSelectedObject)

    const [objectBox, setObjectBox] = useState()

    const isSelectCurrentObject = useMemo(() => {
        if(selectedObject && selectedObject === item.id){
            return true
        } else {
            return false
        }
    }, [selectedObject, item.id])

    const isSelectGroupContainItem = useMemo(() => {
        if(selectedObject){
            const node = findNodeOfTreeData(treeData, selectedObject)
            if(node && _.get(node, ['nodeType']) === TREE_DATA_NODE_TYPE.FOLDER){
                const keys = traverseTreeData([], node)
                return keys.includes(item.id)
            }
            return false
        } else {
            return false
        }
    }, [selectedObject, item.id, treeData])

    useEffect(() => {
        if(groupContainerRef.current && !groupContainerRef.current.userData?.isDragging){
            groupContainerRef.current.position.set(item.position.x ?? 0, item.position.y ?? 0, item.position.z ?? 0)
        }
    }, [item.position.x, item.position.y, item.position.z])

    useEffect(() => {
        if(groupContainerRef.current){
            groupContainerRef.current.rotation.set(item.rotation.x ?? 0, item.rotation.y ?? 0, item.rotation.z ?? 0)
        }
    }, [item.rotation.x, item.rotation.y, item.rotation.z])

    useEffect(() => {
        const scaleValue = mergeScale(item?.scale, _.get(item, ['uniformScale'], 0))
        groupTextRef.current.scale.set(scaleValue[0],scaleValue[1], scaleValue[2])
        setTimeout(() => {
            if(groupTextRef.current){
                groupTextRef.current.updateWorldMatrix(true, true)
                setObjectBox(new Box3().setFromObject(groupTextRef.current))
            }
        }, 200)
    }, [item?.scale?.x, item?.scale?.y, item?.scale?.z, item?.uniformScale])

    const texts = useMemo(() => {
        return _.get(item, "texts", [])
    }, [item])

    const onPointerDown = (e) => {
        if(e.event.srcElement.tagName !== "CANVAS"){
            return
            // onSelectObject("")
        }
        if(e.event.intersections.length === 0 || !_.get(item, ['visible'], true)){
            return
        }
        if(
            !((e.event?.distance && (e.event?.distance === e.event.intersections[0].distance)) 
            || (e.event?.intersection?.distance && (e.event?.intersection?.distance === e.event.intersections[0].distance)))
        ){
            return
        }
        if(isRightClick(e.event)){
            onLock()
        }
        onSelectObject(item.id)
    }

    const bind = useGesture({
        onPointerDown,
        onDragStart: (e) => {
            if(isAxesHelper){
                return
            }
            if(isPreviewMode){
                return
            }
            if(selectedObject === item.id && _.get(item, ['isLock'], false)){
                return
            }
            if(selectedObject === item.id){
                if(cameraControl.current && cameraControl.current.cameraRef()){
                    let cameraRef = cameraControl.current.cameraRef()
                    cameraRef.enabled = false;
                    cameraRef.saveState();
                }
            }
        },
        onDrag: (e) => {
            if(isAxesHelper){
                return
            }
            if(isPublishModeLocation(location) || isPreviewMode){
                return
            }
            if(e.movement && e.movement.length === 2){
                if(e.movement[0] === 0 && e.movement[1] === 0){
                    return
                }
            }
            if(selectedObject === item.id && _.get(item, ['isLock'], false)){
                return
            }
            if(selectedObject === item.id){
                if(cameraControl.current && cameraControl.current.cameraRef()){
                    let cameraRef = cameraControl.current.cameraRef()
                    if(cameraRef && cameraRef.enabled){
                        cameraRef.enabled = false;
                        cameraRef.saveState();
                    }
                }
            }
            if(selectedObject === item.id){
                const event = e.event
                const rect = gl.domElement.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                let canvasPointer = new Vector2()
                canvasPointer.x = ( x / gl.domElement.clientWidth ) *  2 - 1;
                canvasPointer.y = ( y / gl.domElement.clientHeight) * - 2 + 1
                raycaster.setFromCamera(canvasPointer, camera);

                if(scene){
                    let listObjectCanBeIntersect = scene.children.filter(el => !el.userData?.id && !el.isTransformControls);
                    let intersects = raycaster.intersectObjects([...listObjectCanBeIntersect], true);

                    if(intersects.length && intersects.findIndex(el => el.object.visible) >= 0){
                        let indexVisible = intersects.findIndex(el => el.object.visible)
                        let point = getSnapPoint(intersects[indexVisible].point, snapPoints.current)
                        const target = calculateTargetForNewPosition(intersects[indexVisible])
                        calculateNewRotation(intersects[indexVisible].point, target, groupTextRef.current.up)
                        calculateNewPosition(intersects[indexVisible], point)
                    }
                }
            }
        },
        onDragEnd: () => {
            if(isAxesHelper){
                return
            }
            if(isPreviewMode){
                return
            }
            if(selectedObject === item.id && _.get(item, ['isLock'], false)){
                return
            }
            
            if(selectedObject === item.id){
                if(cameraControl.current && cameraControl.current.cameraRef()){
                    let cameraRef = cameraControl.current.cameraRef()
                    cameraRef.enabled = true;
                    cameraRef.saveState();
                }
            }
        },
    })

    // Calculate new rotation with object non have parent
    const calculateNewRotation = (_position, _target, _up) => {
        const m1 = new Matrix4()
        m1.lookAt(_position, _target, _up)
        const rot = new Euler().setFromRotationMatrix(m1)
        // rot.set(rot.x + Math.PI, rot.y + Math.PI, rot.z + Math.PI)
        onChangeRotation(item.id, {x: rot.x, y: rot.y + Math.PI, z: rot.z})
    }

    const calculateNewPosition = (intersect, point) => {
        let normalMatrix = new Matrix3();
        let worldNormal = new Vector3();
        normalMatrix.getNormalMatrix( intersect.object.matrixWorld );
        worldNormal.copy( intersect.face.normal ).applyMatrix3( normalMatrix ).normalize();

        onChangePosition(item.id, point.clone().add(worldNormal.normalize().multiplyScalar(0.02)))
    }

    const calculateTargetForNewPosition = (intersect) => {
        let normalMatrix = new Matrix3();
        let worldNormal = new Vector3();
        normalMatrix.getNormalMatrix( intersect.object.matrixWorld );
        worldNormal.copy( intersect.face.normal ).applyMatrix3( normalMatrix ).normalize();

        return intersect.point.clone().add(worldNormal)
    }

    return <>
        <group
            ref={groupContainerRef}
            userData={{
                id: item.id,
                type: item.type
            }}
            visible={_.get(item, ['visible'], true)}
        >
            <Select 
                enabled={isSelectCurrentObject || isSelectGroupContainItem}
                userData={{
                    id: item.id,
                    type: item.type
                }}
            >
                <group
                    {...bind()}
                    ref={groupTextRef}
                    name={`text-${item.id}`}
                >
                    {/* <Center top> */}
                        {
                            texts.map(el => (
                                <TextContainerView text={el} key={el.id} />
                            ))
                        }
                    {/* </Center> */}
                </group>
            </Select>
            {(!isPreviewMode && isSelectCurrentObject) && 
            <EditorMenuHtml 
                productPosition={position}
                item={item}
                visible={isSelectCurrentObject}
                objectBox={objectBox}
                onShowObjectDetail={onShowObjectDetail}
                onCopy={onCopy}
                onPaste={onPaste}
                onDelete={onDelete}
                onLock={onLock}
                onDuplicate={onDuplicate}
            />}
        </group>
    </>
}
export default GroupTextView