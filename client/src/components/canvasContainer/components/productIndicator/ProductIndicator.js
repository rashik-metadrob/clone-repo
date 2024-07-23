import { useFrame, useThree } from "@react-three/fiber"
import React, { useEffect, useRef, useState } from "react"
import { Vector2, Vector3 } from "three"
import { loadTexture } from "../../../../utils/util"
import _ from "lodash"

const ProductIndicator = ({
    productPosition = [0, 0, 0],
    objectBox,
    is2D = false
}) => {
    const [position, setPosition] = useState([0.5, 1, 0])
    const { camera } = useThree()
    const [shouldShow, setShouldShow] = useState(false)
    const boardRef = useRef()
    const [indicatorTexture, setIndicatorTexture] = useState(null)
    const [farIndicatorTexture, setFarIndicatorTexture] = useState(null)
    const [isFarAwayFromTheCamera, setIsFarAwayFromTheCamera] = useState(true)
    const distanceRef = useRef(0)
    const vecRef = useRef(new Vector3())

    useEffect(() => {
        loadTexture(`${process.env.REACT_APP_HOMEPAGE}/textures/product-indication-icon.png`).then(texture => {
            setIndicatorTexture(texture)
        })
        loadTexture(`${process.env.REACT_APP_HOMEPAGE}/textures/product-indication-far-icon.png`).then(texture => {
            setFarIndicatorTexture(texture)
        })
    }, [])

    useFrame(() => {
        try{
            boardRef.current.getWorldPosition(vecRef.current)
            distanceRef.current = camera.position.distanceTo(vecRef.current)

            if(distanceRef.current > 8 && !isFarAwayFromTheCamera){
                setIsFarAwayFromTheCamera(true)
            } else if (distanceRef.current <= 8 && isFarAwayFromTheCamera) {
                setIsFarAwayFromTheCamera(false)
            }
        }  
        catch (err) {
        }
    })

    useEffect(() => {
        if(objectBox){
            let topDirection = Math.abs(objectBox.max.y) >  Math.abs(objectBox.min.y) > 0 ? 1 : -1;
            let sideTranslate = Math.sqrt(Math.pow((objectBox.max.x - objectBox.min.x) / 2, 2) + Math.pow((objectBox.max.z - objectBox.min.z) / 2, 2))

            let cameraDirection = new Vector3(productPosition[0] - camera.position.x, productPosition[1] -  camera.position.y, productPosition[2] -  camera.position.z)
            cameraDirection.y = 1;
            cameraDirection.normalize();

            let cameraDirectionSide = cameraDirection.clone().cross(camera.up);
            cameraDirectionSide.normalize()
            cameraDirectionSide.y = 0;
            cameraDirectionSide.x = 0;
            cameraDirectionSide.z = 0;
            cameraDirectionSide.multiplyScalar(sideTranslate)

            let newPos = cameraDirectionSide.applyQuaternion(boardRef.current.parent.quaternion.clone().invert());

            boardRef.current.quaternion.copy(boardRef.current.parent.quaternion.clone().invert()).multiply(camera.quaternion);
            boardRef.current.position.set(newPos.x, (Math.abs(objectBox.max.y - objectBox.min.y) / (is2D ? 2 : 1)), newPos.z)

            setPosition([newPos.x, (Math.abs(objectBox.max.y - objectBox.min.y) / (is2D ? 2 : 1)), newPos.z])
            setShouldShow(true)
        }
    }, [JSON.stringify(productPosition), objectBox, camera])

    return <>
        <group visible={shouldShow} ref={boardRef}> 
        </group>

        {/* <Html
            as="div"
            position={new Vector3(position[0], position[1], position[2])}
            className="product-highlight-canvas-wrapper"
        >
            <div className="absolute top-[0px] translate-y-[-100%] translate-x-[-50%] w-[14px] h-[49px]">
                <img src={ProductIndicatorIcon} alt="" className="w-[14px] h-[49px]"/>
            </div>
        </Html> */}

        {indicatorTexture && farIndicatorTexture && <sprite 
            position={new Vector3(position[0], position[1], position[2])}
            scale={isFarAwayFromTheCamera ? new Vector3(0.01, 0.01, 0.01) : new Vector3(0.05, 0.05, 0.05)}
            center={new Vector2(0.5, 0)}
        >
            <spriteMaterial 
                attach="material" 
                map={isFarAwayFromTheCamera ? farIndicatorTexture : indicatorTexture } 
                sizeAttenuation={false} 
                transparent={true}
                opacity={1}
                // depthTest={false}
                // depthWrite={false}
            />
        </sprite>}
    </>
}
export default React.memo(ProductIndicator)