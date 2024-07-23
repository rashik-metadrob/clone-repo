import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import _ from "lodash"
import React, { useEffect, useRef, useState } from "react"
import { Vector3 } from "three"
import "./styles.scss"

import DetailIcon from "../../../../assets/images/textures/icon-detail.svg"
import CopyIcon from "../../../../assets/images/textures/icon-copy.svg"
import DuplicateIcon from "../../../../assets/images/textures/icon-duplicate-2.svg"
import PasteIcon from "../../../../assets/images/textures/icon-duplicate.svg"
import PasteActiveIcon from "../../../../assets/images/textures/icon-duplicate-active.svg"
import DeleteIcon from "../../../../assets/images/textures/icon-delete.svg"
import LockIcon from "../../../../assets/icons/LockIcon"
import NoLockIcon from "../../../../assets/icons/NoLockIcon"
import { getAssetsUrl } from "../../../../utils/util"

const EditorMenuHtml = ({
    productPosition = [0, 0, 0],
    visible,
    objectBox,
    item,
    onShowObjectDetail = () => {},
    onCopy = () => {},
    onPaste = () => {},
    onDelete = () => {},
    onLock = () => {},
    onDuplicate = () => {}
}) => {
    const [position, setPosition] = useState([0.5, 1, 0])
    const { camera } = useThree()
    const [isActiveDuplicate, setIsActiveDuplicate] = useState(false)
    const [shouldShow, setShouldShow] = useState(false)
    const boardRef = useRef()
    const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false)

    useEffect(() => {
        if(visible && objectBox){
            let topDirection = Math.abs(objectBox.max.y) >  Math.abs(objectBox.min.y) > 0 ? 1 : -1;
            let sideTranslate = Math.sqrt(Math.pow((objectBox.max.x - objectBox.min.x) / 2, 2) + Math.pow((objectBox.max.z - objectBox.min.z) / 2, 2))

            let cameraDirection = new Vector3(productPosition[0] - camera.position.x, productPosition[1] -  camera.position.y, productPosition[2] -  camera.position.z)
            cameraDirection.y = 1;
            cameraDirection.normalize();

            let cameraDirectionSide = cameraDirection.clone().cross(camera.up);
            cameraDirectionSide.normalize()
            // cameraDirectionSide.y = 0;
            // cameraDirectionSide.x = 0;
            // cameraDirectionSide.z = 0;
            cameraDirectionSide.multiplyScalar(sideTranslate)

            let newPos = cameraDirectionSide.applyQuaternion(boardRef.current.parent.quaternion.clone().invert());

            boardRef.current.quaternion.copy(boardRef.current.parent.quaternion.clone().invert()).multiply(camera.quaternion);
            boardRef.current.position.set(newPos.x, topDirection * (Math.abs(objectBox.max.y - objectBox.min.y) / 2), newPos.z)

            setPosition([newPos.x, topDirection * (Math.abs(objectBox.max.y - objectBox.min.y) / 2), newPos.z])
            setShouldShow(true)
        }
    }, [visible, productPosition, objectBox, camera])

    const handleDeleteObject = () => {
        setIsShowDeleteConfirm(true)
    }

    return <>
        <group visible={visible && shouldShow} ref={boardRef}> 
        </group>

        {isShowDeleteConfirm && <Html
            as="div"
            zIndexRange={[1000, 0]}
            calculatePosition = {(group, cam, size) => {
                return [0 , 0];
            }}
            className="!transform-none"
        >
            <div className="editor-delete-mask" onClick={() => {setIsShowDeleteConfirm(false)}}>
                <div className="editor-delete-wrapper">
                    <div className="editor-delete-container" onClick={(e) => {e.stopPropagation()}}>
                        <div className="flex gap-[4px] items-center">
                            <img src={getAssetsUrl(item.image)} alt="" className="h-[clamp(40px,7.2vh,80px)] w-auto"/>
                            <div className="flex-auto flex flex-wrap gap-[24px] justify-between items-center">
                                <div className="text-left">
                                    <div className="font-inter font-[700] text-[clamp(12px,1vw,20px)] leading-[24.2px] text-[#FFF]">
                                        Are you sure you want to delete this?
                                    </div>
                                    <div className="font-inter font-[400] text-[clamp(12px,0.8vw,16px)] leading-[19.36px] text-[#C5C5C5] mt-[3px]">
                                        You can undo this by pressing <span className="text-[#00F6FF] font-[700]">Ctrl+Z</span>
                                    </div>
                                </div>
                                <div className="flex-auto justify-center flex flex-nowrap items-center gap-[9px]">
                                    <button 
                                        className="px-[clamp(15px,2vw,40px)] py-[clamp(5px,1vh,11px)] font-inter font-[700] text-[12px] leading-[14.15px] bg-[#FFF] rounded-[5px]" 
                                        onClick={() => {
                                            onDelete()
                                            setIsShowDeleteConfirm(false)
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        className="px-[clamp(15px,2vw,40px)] py-[clamp(5px,1vh,11px)] font-inter font-[700] text-[12px] leading-[14.15px] bg-[transparent] rounded-[5px] border-[1px] border-[#fff] text-[#FFF]"
                                        onClick={() => {
                                            setIsShowDeleteConfirm(false)
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Html>}

        <Html
            as="div"
            position={new Vector3(position[0], position[1], position[2])}
            className="editor-menu-canvas-wrapper top-[-250px]"
            zIndexRange={[10, 0]}
        >
            {_.get(item, 'name', '') && <div className="editor-name">
                {_.get(item, 'name', '')}
            </div>}
        </Html>
        <Html
            as="div"
            position={new Vector3(position[0], position[1], position[2])}
            className="editor-menu-canvas-wrapper !gap-[0px]"
            zIndexRange={[10, 0]}
        >
            <div 
                className="icon-container icon-start" 
                onClick={onShowObjectDetail}
            >
                <div className="icon">
                    <img src={DetailIcon} alt="" />
                </div>
                <div className="description">
                    Object detail
                </div>
            </div>
            <div 
                className="icon-container item-middle" 
                onClick={
                    () => {
                        onLock()
                    }
                }
            >
                <div className="icon icon-lock">
                    {_.get(item, ['isLock'], false) ? <LockIcon /> : <NoLockIcon />}
                </div>
                <div className="description">
                    {_.get(item, ['isLock'], false) ? 'Unlock' : 'Lock'} Object
                </div>
            </div>
            <div 
                className="icon-container item-middle" 
                onClick={
                    () => {
                        onDuplicate()
                    }
                }
            >
                <div className="icon">
                    <img src={DuplicateIcon} alt="" />
                </div>
                <div className="description">
                    Duplicate
                </div>
            </div>
            <div 
                className="icon-container item-middle" 
                onClick={
                    () => {
                        setIsActiveDuplicate(true)
                        onCopy()
                    }
                }
            >
                <div className="icon">
                    <img src={CopyIcon} alt="" />
                </div>
                <div className="description">
                    Copy
                </div>
            </div>
            <div 
                className={`icon-container icon-end ${isActiveDuplicate ? '' : 'disabled'}`}
                onClick={onPaste}
            >
                <div className="icon">
                    <img src={isActiveDuplicate ? PasteActiveIcon : PasteIcon} alt="" />
                </div>
                <div className="description">
                    Paste
                </div>
            </div>
            <div 
                className="icon-container mt-[4px]"
                onClick={() => {handleDeleteObject()}}
            >
                <div className="icon">
                    <img src={DeleteIcon} alt="" />
                </div>
                <div className="description">
                    Delete
                </div>
            </div>
        </Html>
    </>
}
export default React.memo(EditorMenuHtml)