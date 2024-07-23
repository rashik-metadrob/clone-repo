import { TransformControls, Center } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { Suspense, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import _ from "lodash";
import { extend, useLoader } from "@react-three/fiber";
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { Font } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { TEXT_ALIGN, TEXT_CONFIG_RESOLUTION, TEXT_DECORATION } from "../../../../utils/constants";
import fonts from "../descriptionBoard/fonts";
import { Color } from "three";
import { getFontUrl } from "../../../../utils/util";

extend({ TextGeometry })

const TextContainerView = forwardRef(({
    text,
}, ref) => {
    const json = useLoader(TTFLoader, getFontUrl(_.get(text, 'font', fonts.InterBold)))
    // const [json, setJson] = useState()
    const textRef = useRef()

    const position = useMemo(() => {
        return [text.position.x ?? 0, text.position.y ?? 0, text.position.z ?? 0]
    }, [text.position.x, text.position.y, text.position.z])

    const getText = () => {
        let textString = _.get(text, 'text', '')
        if(_.get(text, 'textDecoration', '') === TEXT_DECORATION.LOWERCASE){
            textString = textString.toLowerCase()
        }

        if(_.get(text, 'textDecoration', '') === TEXT_DECORATION.UPPERCASE){
            textString = textString.toUpperCase()
        }

        return textString
    }

    return <>
        <group ref={textRef} name={text.id} position={position}>
            <Center
                left={_.get(text, 'textAlign', '') === TEXT_ALIGN.RIGHT}
                right={_.get(text, 'textAlign', '') === TEXT_ALIGN.LEFT}
            >
                <Select enabled={_.get(text, 'glow', false)}>
                    <mesh>
                        <textGeometry 
                        args={
                            [
                                getText(), 
                                {
                                    font: new Font(json), 
                                    size: _.get(text, 'fontSize', 10) / TEXT_CONFIG_RESOLUTION, 
                                    depth: _.get(text, 'depth', 1) / TEXT_CONFIG_RESOLUTION
                                }
                            ]
                        }/>
                        <meshLambertMaterial 
                            attach='material' 
                            color={_.get(text, 'color', 'gold')} 
                            emissive={new Color(_.get(text, 'color', 'gold'))} 
                            transparent={true} 
                            opacity={_.get(text, 'transparency', 1)}
                        />
                    </mesh>
                </Select>
            </Center>
        </group>
    </>
})
export default TextContainerView