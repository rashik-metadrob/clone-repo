import { Text } from "@react-three/drei"
import { useEffect, useMemo, useState } from "react"
import { Shape, ShapeGeometry } from "three"
import fonts from "../descriptionBoard/fonts"
import { roundedRect } from "../../../../utils/util"

const EditorMenuName = ({
    visible,
    position = [0, 0, 0],
    name = ""
}) => {
    const [renderName, setRenderName] = useState("")
    const [buttonActionShape, setButtonActionShape] = useState(new Shape())
    const shapeButtonActionGeo = useMemo(() => {
        return new ShapeGeometry(buttonActionShape)
    },[buttonActionShape])

    useEffect(() => {
        if(visible){
            calcLayout()
        }
    },[visible])

    useEffect(() => {
        if(name && name.length > 0){
            for(let i = 0; i < name.length; i++){
                if(measureTextWith(name.substring(0, i + 1)) > 0.9){
                    console.log('i', i)
                    setRenderName(`${name.substring(0, i + 1)}...`)
                    return
                }
            }

            setRenderName(name)
        } else {
            setRenderName("")
        }
        measureTextWith(name)
    }, [name])

    const calcLayout = () => {
        const roundedRectButtonShape = new Shape();
        roundedRect( roundedRectButtonShape, 0, 0, 1.1, 0.2, 0.05 );
        setButtonActionShape(roundedRectButtonShape);
    }

    const measureTextWith = (textStr) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.font = "1px Inter";
        const width = ctx.measureText(textStr).width / 10
        canvas.remove()
        return width
    }

    return <>
        <group
            renderOrder={1002}
            position={position}
        >
            <mesh 
                visible={true}
                position={[0, 0, 0]}
                geometry={shapeButtonActionGeo}
                renderOrder={1002}
            >
                <meshBasicMaterial 
                    color="#101010" 
                    depthTest={false} 
                    depthWrite={false} 
                    transparent={true} 
                    opacity={0.6}
                />
            </mesh>

            <Text
                visible={visible}
                text={renderName}
                fontSize={0.1}
                maxWidth={0.96}
                lineHeight={1}
                letterSpacing={0}
                textAlign="left"
                anchorX="left"
                anchorY="middle"
                position={[0.02, 0.1, 0]}
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
export default EditorMenuName