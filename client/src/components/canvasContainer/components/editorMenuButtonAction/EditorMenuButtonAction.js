import { RoundedBox, Text, useTexture } from "@react-three/drei"
import { useEffect, useMemo, useState } from "react"
import { Box3, DoubleSide, Float32BufferAttribute, RepeatWrapping, Shape, ShapeGeometry, Vector3 } from "three"
import { roundedRect } from "../../../../utils/util"
import fonts from "../descriptionBoard/fonts"

const EditorMenuButtonAction = ({
    visible,
    position = [0, 0, 0],
    activeTextureUrl = `${process.env.REACT_APP_HOMEPAGE}/textures/delete.jpg`,
    nonactiveTextureUrl = `${process.env.REACT_APP_HOMEPAGE}/textures/delete.jpg`,
    normalTextureUrl,
    isActive = true,
    onClick = () => {},
    tooltipWidth = 0.5,
    tooltipText = "Object detail"
}) => {
    const [isHover, setIsHover] = useState(false)

    const [buttonActionShape, setButtonActionShape] = useState(new Shape())
    const shapeButtonActionGeo = useMemo(() => {
        return new ShapeGeometry(buttonActionShape)
    },[buttonActionShape])

    const [buttonActionTooltipShape, setButtonActionTooltipShape] = useState(new Shape())
    const shapeButtonActionTooltipGeo = useMemo(() => {
        return new ShapeGeometry(buttonActionTooltipShape)
    },[buttonActionTooltipShape])

    const [buttonActionIconShape, setButtonActionIconShape] = useState(new Shape())
    const shapeButtonActionIconGeo = useMemo(() => {
        const shape = new ShapeGeometry(buttonActionIconShape)

        let pos = shape.attributes.position;
        let b3 = new Box3().setFromBufferAttribute(pos);
        let b3size = new Vector3();
        b3.getSize(b3size);

        let uv = [];
        for(let i = 0; i < pos.count; i++){
            let x = pos.getX(i);
            let y = pos.getY(i);
            let u = (x - b3.min.x) / b3size.x;
            let v = (y - b3.min.y) / b3size.y;
            uv.push(u, v);
        }
        shape.setAttribute("uv", new Float32BufferAttribute(uv, 2));
        return shape
    },[buttonActionIconShape])

    const activeTexture = useTexture(activeTextureUrl)
    activeTexture.wrapT = RepeatWrapping
    activeTexture.wrapS = RepeatWrapping
    activeTexture.repeat.set(1, 1)

    const nonactiveTexture = useTexture(nonactiveTextureUrl)
    nonactiveTexture.wrapT = RepeatWrapping
    nonactiveTexture.wrapS = RepeatWrapping
    nonactiveTexture.repeat.set(1, 1)

    const normalTexture = useTexture(normalTextureUrl ? normalTextureUrl : activeTextureUrl)
    normalTexture.wrapT = RepeatWrapping
    normalTexture.wrapS = RepeatWrapping
    normalTexture.repeat.set(1, 1)

    useEffect(() => {
        if(visible){
            calcLayout()
        }
    },[visible, tooltipWidth])

    const calcLayout = () => {
        const roundedRectButtonShape = new Shape();
        roundedRect( roundedRectButtonShape, 0, 0, 0.2, 0.2, 0.05 );
        setButtonActionShape(roundedRectButtonShape);

        const roundedRectButtonIconShape = new Shape();
        roundedRect( roundedRectButtonIconShape, 0, 0, 0.16, 0.16, 0.05 );
        setButtonActionIconShape(roundedRectButtonIconShape);

        const roundedRectButtonTooltipShape = new Shape();
        roundedRectTooltip( roundedRectButtonTooltipShape, 0, 0, tooltipWidth, 0.16, 0.05 );
        setButtonActionTooltipShape(roundedRectButtonTooltipShape);
    }

    function roundedRectTooltip( ctx, x, y, width, height, radius ) {
        ctx.moveTo( x, y + radius );
        ctx.lineTo( x, y + height - radius );
        ctx.quadraticCurveTo( x, y + height, x - radius, y + height );
        ctx.lineTo( x + width - radius, y + height );
        ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
        ctx.lineTo( x + width, y + radius );
        ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
        ctx.lineTo( x - radius, y );
        ctx.quadraticCurveTo( x, y, x, y + radius );
    }

    return <>
        <group
            renderOrder={1002}
            position={position}
            onPointerOver={() => {
                if(isActive){
                    document.body.style.cursor = "pointer"
                    setIsHover(true)
                }
            }}
            onPointerLeave={() => {
                document.body.style.cursor = "default"
                setIsHover(false)
            }}
        >
            <mesh 
                visible={true}
                position={[0, 0, 0]}
                geometry={shapeButtonActionGeo}
                renderOrder={1002}
                onClick={() => {
                    if(isActive){
                        console.log('onClick')
                        onClick()
                    }
                }}
            >
                <meshBasicMaterial 
                    color="#101010" 
                    depthTest={false} 
                    depthWrite={false} 
                    transparent={true} 
                    opacity={0.3}
                />
            </mesh>
            <mesh 
                visible={true}
                position={[0.02, 0.02, 0]}
                geometry={shapeButtonActionIconGeo}
                renderOrder={1003}
            >
                <meshStandardMaterial 
                    depthTest={false} 
                    depthWrite={false} 
                    transparent={true} 
                    opacity={0.8}
                    side={DoubleSide}
                    map={isActive ? activeTexture : nonactiveTexture}
                    normalMap={normalTexture}
                />
            </mesh>

            <mesh 
                visible={isHover && visible}
                position={[0.18, 0.02, 0]}
                geometry={shapeButtonActionTooltipGeo}
                renderOrder={1002}
                onClick={() => {
                    if(isActive){
                        console.log('onClick')
                        onClick()
                    }
                }}
            >
                <meshBasicMaterial 
                   color="#101010" 
                   depthTest={false} 
                   depthWrite={false} 
                   transparent={true} 
                   opacity={0.8}
                />
            </mesh>
            <Text
                visible={isHover && visible}
                text={tooltipText}
                fontSize={0.06}
                maxWidth={0.96}
                lineHeight={1}
                letterSpacing={0}
                textAlign="left"
                anchorX="left"
                anchorY="middle"
                position={[0.2, 0.1, 0]}
                font={fonts.InterRegular}
                renderOrder={1003}
                color="#FFFFFF"
                whiteSpace="nowrap"
            >
                <meshBasicMaterial 
                    attach="material" 
                    color="#FFFFFF" 
                    depthTest={false} 
                    depthWrite={false}
                />

            </Text>
        </group>
    </>
}
export default EditorMenuButtonAction