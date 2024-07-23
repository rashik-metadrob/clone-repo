import { Collapse, ColorPicker, Upload } from "antd"
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"

import "./styles.scss"
import { useMemo, useState } from "react";
const ColorCollapse = () => {
    const [colorHex, setColorHex] = useState('#1677ff');
    const hexString = useMemo(
        () => (typeof colorHex === 'string' ? colorHex : colorHex.toHexString()),
        [colorHex],
    );

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="color-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: 'Solid Color',
                    children: <>
                        <div className="color-collapse-content">
                            <ColorPicker
                                className="w-full color-container"
                                format={'hex'}
                                value={colorHex}
                                onChange={setColorHex}
                            />
                        </div>
                    </>,
                },
            ]}
        />
    </>
}
export default ColorCollapse