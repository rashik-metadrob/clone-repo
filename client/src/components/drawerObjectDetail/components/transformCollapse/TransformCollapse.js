import { Checkbox, Collapse, Input, InputNumber, Slider, notification } from "antd";
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"
import "./styles.scss"
import React, { useEffect, useMemo, useState } from "react";
import _ from "lodash"

const MIN_SCALE = 0.001
const TransformCollapse = ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    uniformScale = 0,
    objectDetail,
    onScaleChange = () => {},
    onRotationChange = () => {},
    onPositionChange = () => {},
    onUniformScaleChange = () => {},
    onChangeAxesHelper = () => {}
}) => {
    const [localScale, setLocalScale] = useState([0,0,0])
    const [localPos, setLocalPos] = useState([0,0,0])
    const [localRot, setLocalRot] = useState([0,0,0])

    const isAxesHelper = useMemo(() => { return _.get(objectDetail, ['axesHelper'], false) }, [objectDetail])

    useEffect(() => {
        if(position){
            const [newX, newY, newZ] = position
            const x = numberFormatter(newX)
            const y = numberFormatter(newY)
            const z = numberFormatter(newZ)

            setLocalPos([x,y,z])
        }
        if(rotation){
            const [newX, newY, newZ] = rotation
            const x = numberFormatter(newX)
            const y = numberFormatter(newY)
            const z = numberFormatter(newZ)
            setLocalRot([x,y,z])
        }
    }, [position, rotation])

    useEffect(() => {
        if(scale){
            const [newX, newY, newZ] = scale
            const x = numberFormatter(newX)
            const y = numberFormatter(newY)
            const z = numberFormatter(newZ)

            setLocalScale([x,y,z])
        }
    }, [scale])

    const handleScaleChange = (value, index) => {
        const [x,y,z] = localScale
        const changedValue = Math.max(MIN_SCALE, value)
        if(value < MIN_SCALE) {
            notification.warning({
                message: `Scale is very small. The smallest value can be set is ${MIN_SCALE}`
            })
        }

        if(index === 0 && changedValue !== localScale[0]){
            setLocalScale([changedValue,y,z])
            onScaleChange([changedValue, scale[1], scale[2]])
        } else if(index === 1 && changedValue !== localScale[1]){
            setLocalScale([x,changedValue,z])
            onScaleChange([scale[0], changedValue, scale[2]])
        } else if(index === 2 && changedValue !== localScale[2]){
            setLocalScale([x,y,changedValue])
            onScaleChange([scale[0], scale[1], changedValue])
        }
    }

    const handleRotationChange = (value, index) => {
        const [x,y,z] = localRot

        if(index === 0){
            setLocalRot([value,y,z])
            onRotationChange([value, rotation[1], rotation[2]])
        } else if(index === 1){
            setLocalRot([x,value,z])
            onRotationChange([rotation[0], value, rotation[2]])
        } else if(index === 2){
            setLocalRot([x,y,value])
            onRotationChange([rotation[0], rotation[1], value])
        }
    }

    const handlePositionChange = (value, index) => {
        const [x,y,z] = localPos
        
        if(index === 0){
            setLocalPos([value,y,z])
            onPositionChange([value, position[1], position[2]])
        } else if(index === 1){
            setLocalPos([x,value,z])
            onPositionChange([position[0], value, position[2]])
        } else if(index === 2){
            setLocalPos([x,y,value])
            onPositionChange([position[0], position[1], value])
        }
    }

    const numberFormatter = (value) => {
        return getDigits(value) > 2 ? _.toNumber(_.round(_.toNumber(value), 3)) : value
    }

    function getDigits(v) {
        if(_.isNumber(v)) {
            var s = v.toString(),
                i = s.indexOf('.') + 1;
            return i && s.length - i;
        } else {
            return v
        }
        
    }

    const onResetPosition = () => {
        setLocalPos([0, 0, 0])
        onPositionChange([0, 0, 0])
    }
    
    const onResetRotation = () => {
        setLocalRot([0, 0, 0])
        onRotationChange([0, 0, 0])
    }

    const onResetScale = () => {
        setLocalScale([0.5, 0.5, 0.5])
        onScaleChange([0.5, 0.5, 0.5])
    }

    const handleUniformScaleChange = (value) => {
        onUniformScaleChange(value)
    }

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="transform-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex">Transform</div>,
                    children: <>
                        <div className="transform-collapse-content">
                            <div className="transform-item">
                                <div className="title">
                                </div>
                                <div className="header-name !text-[#FF0000] pl-[5px]">
                                    X - Axis
                                </div>
                                <div className="header-name !text-[#00FF00] pl-[5px]">
                                    Y - Axis
                                </div>
                                <div className="header-name !text-[#0000FF] pl-[5px]">
                                    Z - Axis
                                </div>
                                <div className="action">
                                </div>
                            </div>
                            {position && <div className="transform-item mt-[5px]">
                                <div className="title">
                                    Position
                                </div>
                                <div className="header-name">
                                    <InputNumber step={0.01} value={localPos[0]} className="transform-input w-full" onChange={(e) => {handlePositionChange(e, 0)}}/>
                                </div>
                                <div className="header-name">
                                    <InputNumber step={0.01} value={localPos[1]} className="transform-input w-full" onChange={(e) => {handlePositionChange(e, 1)}}/>
                                </div>
                                <div className="header-name">
                                    <InputNumber step={0.01} value={localPos[2]} className="transform-input w-full" onChange={(e) => {handlePositionChange(e, 2)}}/>
                                </div>
                                <div className="action">
                                    <span className="text-reset" onClick={() => {onResetPosition()}}>
                                        Reset
                                    </span>
                                </div>
                            </div>}
                            {rotation && <div className="transform-item mt-[11px]">
                                <div className="title">
                                    Rotation
                                </div>
                                <div className="header-name">
                                    <InputNumber step={1} value={localRot[0]} className="transform-input w-full" onChange={(e) => {handleRotationChange(e, 0)}}/>
                                </div>
                                <div className="header-name">
                                    <InputNumber step={1} value={localRot[1]} className="transform-input w-full" onChange={(e) => {handleRotationChange(e, 1)}}/>
                                </div>
                                <div className="header-name">
                                    <InputNumber step={1} value={localRot[2]} className="transform-input w-full" onChange={(e) => {handleRotationChange(e, 2)}}/>
                                </div>
                                <div className="action">
                                    <span className="text-reset" onClick={() => {onResetRotation()}}>
                                        Reset
                                    </span>
                                </div>
                            </div>}
                            {scale && <div className="transform-item mt-[11px]">
                                <div className="title">
                                    Scale
                                </div>
                                <div className="header-name">
                                    <InputNumber 
                                        step={0.2} 
                                        title="Blur the input or press ENTER to set value."
                                        min={MIN_SCALE}
                                        value={localScale[0]} 
                                        className="transform-input w-full" 
                                        onPressEnter={(e) => {handleScaleChange(e.target.value, 0)}}
                                        onBlur={(e) => {handleScaleChange(e.target.value, 0)}}
                                        onStep={(e) => {handleScaleChange(e, 0)}}
                                    />
                                </div>
                                <div className="header-name">
                                    <InputNumber 
                                        step={0.2} 
                                        title="Blur the input or press ENTER to set value."
                                        min={MIN_SCALE}
                                        value={localScale[1]} 
                                        className="transform-input w-full" 
                                        onPressEnter={(e) => {handleScaleChange(e.target.value, 1)}}
                                        onBlur={(e) => {handleScaleChange(e.target.value, 1)}}
                                        onStep={(e) => {handleScaleChange(e, 1)}}
                                    />
                                </div>
                                <div className="header-name">
                                    <InputNumber 
                                        step={0.2} 
                                        title="Blur the input or press ENTER to set value."
                                        min={MIN_SCALE}
                                        value={localScale[2]} 
                                        className="transform-input w-full" 
                                        onPressEnter={(e) => {handleScaleChange(e.target.value, 2)}}
                                        onBlur={(e) => {handleScaleChange(e.target.value, 2)}}
                                        onStep={(e) => {handleScaleChange(e, 2)}}
                                    />
                                </div>
                                <div className="action">
                                    <span className="text-reset" onClick={() => {onResetScale()}}>
                                        Reset
                                    </span>
                                </div>
                            </div>}
                            <div className="transform-item-end mt-[11px]">
                                <div className="title">
                                    Uniform Scale
                                </div>
                                <div className="header-name gap-[12px]">
                                    <Slider
                                        min={0.01}
                                        max={10}
                                        value={numberFormatter(uniformScale)}
                                        step={0.1}
                                        onChange={handleUniformScaleChange}
                                        trackStyle={{
                                            background: "#FFFFFF"
                                        }}
                                        railStyle={{
                                            background: "rgba(0, 0, 0, 0.30)"
                                        }}
                                        className="uniform-scale-slider flex-auto"
                                    />
                                </div>
                                <div className="action">
                                    <InputNumber
                                        min={0.01}
                                        max={10}
                                        step={0.1}
                                        value={numberFormatter(uniformScale)}
                                        onChange={handleUniformScaleChange}
                                        className="transform-input w-[100px] transform-input-uniform"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-start mt-[11px]">
                                <Checkbox 
                                    className="shared-checkbox axes-helper-checkbox" 
                                    checked={isAxesHelper} 
                                    onChange={(e) => {onChangeAxesHelper(objectDetail.id, e.target.checked)}}
                                >
                                    <span className="checkbox-content">Axes helpers</span>
                                </Checkbox>
                            </div>
                        </div>
                    </>,
                },
            ]}
        />
    </>
}
export default React.memo(TransformCollapse);