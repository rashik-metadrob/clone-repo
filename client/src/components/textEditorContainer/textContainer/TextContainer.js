import { TransformControls, Center } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import fonts from "../../canvasContainer/components/descriptionBoard/fonts";
import _ from "lodash";
import { extend, useLoader } from "@react-three/fiber";
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { Font } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { TEXT_ALIGN, TEXT_CONFIG_RESOLUTION, TEXT_DECORATION } from "../../../utils/constants";
import { Vector3 } from "three";
import { getFontUrl } from "../../../utils/util";

extend({ TextGeometry })

const TextContainer = forwardRef(({
    text,
    cameraControl,
    isPreviewText,
}, ref) => {
    const json = useLoader(TTFLoader, getFontUrl(_.get(text, 'font', fonts.InterBold)))
    const textRef = useRef()
    const transformControlRef = useRef()

    const isSelectedText = useMemo(() => {
        return _.get(text, 'glow', false)
    },[text])

    useEffect(() => {
        if(text?.position){
            transformControlRef.current.position.set(text.position.x, text.position.y, text.position.z)
            // transformControlRef.current.gizmo.visible =false
            textRef.current.position.set(text.position.x, text.position.y, text.position.z)
            textRef.current.updateWorldMatrix(true, true)
        }
    }, [JSON.stringify(text?.position)])

    if(!text.text){
        return <></>
    }

    const disableControl = () => {
        const control = cameraControl.current.cameraRef()
        if(control){
            control.enabled = false;
            control.saveState();
        }
    }

    const enableControl = () => {
        const control = cameraControl.current.cameraRef()
        if(control){
            control.enabled = true;
            control.saveState();
        }
    }

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
        <TransformControls ref={transformControlRef} onMouseDown={disableControl} onMouseUp={enableControl} showZ={false} showY={!isPreviewText} showX={!isPreviewText} onChange={() => {console.log('TRANS', transformControlRef.current.position.x)}}>
            <Center 
                ref={textRef} 
                name={text.id} 
                left={_.get(text, 'textAlign', '') === TEXT_ALIGN.RIGHT}
                right={_.get(text, 'textAlign', '') === TEXT_ALIGN.LEFT}
            >
                <Select enabled={isSelectedText} >
                    <mesh>
                        <textGeometry 
                        args={
                            [
                                getText(), 
                                {
                                    font: new Font(json), 
                                    size: _.get(text, 'fontSize', 10) / TEXT_CONFIG_RESOLUTION, 
                                    height: _.get(text, 'depth', 1) / TEXT_CONFIG_RESOLUTION
                                }
                            ]
                        }/>
                        <meshLambertMaterial attach='material' color={_.get(text, 'color', 'gold')} transparent={true} opacity={_.get(text, 'transparency', 1)}/>
                    </mesh>
                </Select>
            </Center>
        </TransformControls>
        
    </>
})
export default TextContainer