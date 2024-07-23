import { Col, Collapse, InputNumber, Row, Slider } from "antd";
import "./styles.scss"

import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"
import { EDITOR_MATERIAL_KEYS_2D } from "../../../../utils/constants";

const Material2DCollapse = ({
    materialConfigs = {
        aoMapInsensity: 1
    },
    onMaterialChange = () => {},
}) => {
    

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="material-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex">Display Settings</div>,
                    children: <>
                        <div className="material-collapse-content">
                            
                            <div className="material-control-container">
                                {
                                    EDITOR_MATERIAL_KEYS_2D.map((el, index) => (
                                        <Row gutter={8} key={el.key + index}>
                                                <Col span={8} className="text-left">
                                                    Object Brightness
                                                </Col>
                                                <Col span={16}>
                                                    <div className="flex gap-[12px] flex-nowrap">
                                                        <Slider
                                                            min={el.min}
                                                            max={el.max}
                                                            step={el.step}
                                                            className="w-full admin-form-slider"
                                                            onChange={(value) => {
                                                                onMaterialChange({
                                                                    ...materialConfigs,
                                                                    [el.key]: value
                                                                })
                                                            }}
                                                            value={materialConfigs[el.key]}
                                                        />
                                                        <InputNumber
                                                            min={el.min}
                                                            max={el.max}
                                                            step={el.step}
                                                            className="w-[100px] admin-form-input"
                                                            value={materialConfigs[el.key]}
                                                            onChange={(value) => {
                                                                onMaterialChange({
                                                                    ...materialConfigs,
                                                                    [el.key]: value
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                    ))
                                }
                            </div>
                        </div>
                    </>,
                },
            ]}
        />
    </>
}
export default Material2DCollapse;