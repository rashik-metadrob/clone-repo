import { Collapse } from "antd"
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"
import BrandSetup from "../brandSetup/BrandSetup"
import { useState } from "react"
import PreviewLoadingScreen from "../previewLoadingScreen/PreviewLoadingScreen"

const ThemeCollapseContainer = () => {
    const [activeKey, setActiveKey] = useState('')
    return <>
        <Collapse
            collapsible="header"
            bordered={false}
            accordion
            activeKey={activeKey}
            onChange={(key) => {setActiveKey(key)}}
            className="theme-brand-setup-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex">Brand setup</div>,
                    children: <>
                        <BrandSetup />
                    </>,
                },
            ]}
        />
    </>
}
export default ThemeCollapseContainer