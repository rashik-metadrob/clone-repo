import React, { useEffect, useRef, useState } from "react";

import { useThree } from "@react-three/fiber";
import EditorMenuButtonAction from "../editorMenuButtonAction/EditorMenuButtonAction";
import { Vector3 } from "three";
import EditorMenuName from "../editorMenuName/EditorMenuName";
import _ from "lodash";

//Remove this component. No used
const EditorMenu = ({
    productPosition = [0, 0, 0],
    visible,
    objectBox,
    item,
    onShowObjectDetail = () => {},
    onCopy = () => {},
    onPaste = () => {},
    onDelete = () => {}
}) => {
    const boardRef = useRef()
    const { camera } = useThree()
    const [position, setPosition] = useState([0.5, 1, 0])
    const [isActiveDuplicate, setIsActiveDuplicate] = useState(false)
    const [shouldShow, setShouldShow] = useState(false)

    useEffect(() => {
        if(visible && objectBox){
            let topDirection = Math.abs(objectBox.max.y) >  Math.abs(objectBox.min.y) > 0 ? 1 : -1;
            let sideTranslate = Math.sqrt(Math.pow((objectBox.max.x - objectBox.min.x) / 2, 2) + Math.pow((objectBox.max.z - objectBox.min.z) / 2, 2))

            let cameraDirection = new Vector3(productPosition[0] - camera.position.x, productPosition[1] -  camera.position.y, productPosition[2] -  camera.position.z)
            cameraDirection.y = 1;
            cameraDirection.normalize();

            let cameraDirectionSide = cameraDirection.clone().cross(camera.up);
            cameraDirectionSide.normalize()
            cameraDirectionSide.y = 0;
            cameraDirectionSide.multiplyScalar(sideTranslate)

            let newPos = cameraDirectionSide.applyQuaternion(boardRef.current.parent.quaternion.clone().invert());
            setPosition([newPos.x, topDirection * (Math.abs(objectBox.max.y - objectBox.min.y) + 0.1), newPos.z])

            boardRef.current.quaternion.copy(boardRef.current.parent.quaternion.clone().invert()).multiply(camera.quaternion);

            setShouldShow(true)
        }
    }, [visible, productPosition, objectBox, camera])
    
    return <>
        <group position={position} visible={visible && shouldShow} ref={boardRef}>
            {/* Editor Name */}
            <EditorMenuName
                visible={visible} 
                position={[0, 0.88, 0]}
                name={_.get(item, 'name', '')}
            />
            {/* Button object detail */}
            <EditorMenuButtonAction 
                visible={visible} 
                position={[0, 0.66, 0]}
                activeTextureUrl={`${process.env.REACT_APP_HOMEPAGE}/textures/icon-detail.jpg`}
                nonactiveTextureUrl={`${process.env.REACT_APP_HOMEPAGE}/textures/icon-detail.jpg`}
                tooltipWidth={0.42}
                tooltipText="Object detail"
                onClick={onShowObjectDetail}
            />
            {/* Button copy */}
            <EditorMenuButtonAction 
                visible={visible} 
                position={[0, 0.44, 0]}
                activeTextureUrl={`${process.env.REACT_APP_HOMEPAGE}/textures/icon-copy.jpg`}
                nonactiveTextureUrl={`${process.env.REACT_APP_HOMEPAGE}/textures/icon-copy.jpg`}
                onClick={
                    () => {
                        setIsActiveDuplicate(true)
                        onCopy()
                    }
                }
                tooltipWidth={0.22}
                tooltipText="Copy"
            />
            {/* Button duplicate */}
            <EditorMenuButtonAction 
                visible={visible} 
                position={[0, 0.22, 0]}
                activeTextureUrl={`${process.env.REACT_APP_HOMEPAGE}/textures/icon-duplicate-active.jpg`}
                nonactiveTextureUrl={`${process.env.REACT_APP_HOMEPAGE}/textures/icon-duplicate.jpg`}
                isActive={isActiveDuplicate}
                tooltipWidth={0.34}
                tooltipText="Duplicate"
                onClick={onPaste}
            />
            {/* Button delete */}
            <EditorMenuButtonAction 
                visible={visible}
                activeTextureUrl={`${process.env.REACT_APP_HOMEPAGE}/textures/icon-delete.jpg`}
                nonactiveTextureUrl={`${process.env.REACT_APP_HOMEPAGE}/textures/icon-delete.jpg`}
                normalTextureUrl={`${process.env.REACT_APP_HOMEPAGE}/textures/icon-delete-normal-map.jpg`}
                tooltipWidth={0.25}
                tooltipText="Delete"
                onClick={onDelete}
            />
        </group>
    </>
}
export default React.memo(EditorMenu);