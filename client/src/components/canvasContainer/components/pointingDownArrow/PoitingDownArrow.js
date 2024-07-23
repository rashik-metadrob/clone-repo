
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useSpring, animated } from '@react-spring/three'
import { loadModel } from "../../../../utils/util";

const PoitingDownArrow = ({
    visible,
    target = [0, 0, 0]
}) => {
    const { gl } = useThree()
    const [model, setModel] = useState()

    const { position } = useSpring({
        to: { position: [0, 0.5, 0]},
        from: { position: visible ? [0, 0.2, 0] : [0, 0.5, 0] },
        loop: { reverse: true },
        config: {duration: 200, step: 200}
    })

    useEffect(() => {
        loadModel(`${process.env.REACT_APP_HOMEPAGE}/model/ArrowPoitingDown.glb`, () => {}, gl).then(rs => {
            setModel(rs)
        })
    }, [])

    return <>
        {model && visible && <animated.group visible={visible} position={target}>
            <animated.primitive object={model.scene} position={position} scale={[0.1, 0.1, 0.1]}>
            </animated.primitive>
        </animated.group>}
    </>
}
export default PoitingDownArrow