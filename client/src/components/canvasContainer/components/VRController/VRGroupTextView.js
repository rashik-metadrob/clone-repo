import React, { useEffect, useMemo, useRef, useState } from "react"
import _ from "lodash"
import VRTextContainerView from "./VRTextContainerView"
import { mergeScale } from "../../../../utils/util"
const VRGroupTextView = ({
    item,
}) => {
    const groupTextRef = useRef()
    const position = useMemo(() => {
        return [item.position.x ?? 0, item.position.y ?? 0, item.position.z ?? 0]
    }, [item.position.x, item.position.y, item.position.z])

    const [rotation, setRotation] = useState([0, 0, 0])
    const [scale, setScale] = useState([1, 1, 1])

    const texts = useMemo(() => {
        return _.get(item, "texts", [])
    }, [item])

    useEffect(() => {
        setRotation([item.rotation.x, item.rotation.y, item.rotation.z])
        setScale(mergeScale(item?.scale, _.get(item, ['uniformScale'], 0)))
    }, [item])

    useEffect(() => {
        setRotation([item.rotation.x, item.rotation.y, item.rotation.z])
    }, [item.rotation.x, item.rotation.y, item.rotation.z])

    useEffect(() => {
        setScale(mergeScale(item?.scale, _.get(item, ['uniformScale'], 0)))
    }, [item?.scale?.x, item?.scale?.y, item?.scale?.z, item?.uniformScale])

    return <>
        <group
            position={position}
            rotation={rotation}
            userData={{
                id: item.id,
                type: item.type
            }}
        >
            <group
                ref={groupTextRef}
                scale={scale}
                name={`text-${item.id}`}
            >
                {
                    texts.map(el => (
                        <VRTextContainerView text={el} key={el.id} />
                    ))
                }
            </group>
        </group>
    </>
}
export default React.memo(VRGroupTextView)