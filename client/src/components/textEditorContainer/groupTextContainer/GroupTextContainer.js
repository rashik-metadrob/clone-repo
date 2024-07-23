import { EffectComposer, Outline, Selection } from "@react-three/postprocessing"
import TextContainer from "../textContainer/TextContainer"
import { KernelSize, BlendFunction, Resizer } from 'postprocessing'
import { Suspense, forwardRef, useImperativeHandle, useRef } from "react"
import { Box3, Vector3 } from "three"
import { useThree } from "@react-three/fiber"
import _ from "lodash"

const GroupTextContainer = forwardRef(({texts, cameraControl, isPreviewText}, ref) => {
    const {gl, scene} = useThree()
    const textRef = useRef()
    useImperativeHandle(ref, () => ({
        getBox: () => {
            textRef.current.updateWorldMatrix(true, true)
            const box = new Box3()
            for(let i = 0; i < texts.length; i++){
                const text = textRef.current.getObjectByName(texts[i].id)
                if(text){
                    text.updateWorldMatrix(true, true)
                    box.expandByObject(text)
                }
            }

            return box
        },
        getCanvasImage: () => {
            return gl.domElement.toDataURL("image/png", 0.5)
        },
        getTextsInfo: () => {
            return texts.map(el => {
                const object = textRef.current.getObjectByName(el.id)
                if(object){
                    object.updateWorldMatrix(true, true)
                }
                const position = object ? object.getWorldPosition(new Vector3()) : {x:0, y:0, z:0}
                el.position = position
                return el
            })
        }
    }));

    return <>
        <Selection>
            <EffectComposer multisampling={8} autoClear={false}>
                <Outline 
                    blendFunction={BlendFunction.SCREEN}
                    visibleEdgeColor={0x00F6FF} 
                    hiddenEdgeColor={0x00F6FF}
                    blur={true}
                    pulseSpeed={0.0}
                    edgeStrength={10} 
                    width={Resizer.AUTO_SIZE}
                    height={Resizer.AUTO_SIZE}
                    kernelSize={KernelSize.LARGE}
                    xRay={true}
                />
            </EffectComposer>
            <group name="group-text" ref={textRef}>
            {
                texts.map(el => (
                    <Suspense fallback={null}>
                        <TextContainer text={el} key={el.id} cameraControl={cameraControl} isPreviewText={isPreviewText}/>
                    </Suspense>
                ))
            }
            </group>
        </Selection>
        
    </>
})
export default GroupTextContainer