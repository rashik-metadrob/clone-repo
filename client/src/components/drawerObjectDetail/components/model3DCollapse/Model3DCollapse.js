import { Collapse, Upload } from "antd"
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"
import Model3dIcon from "../../../../assets/images/project/model3d.svg"

import "./styles.scss"
import { useState } from "react"

const Model3DCollapse = () => {
    const [file, setFile] = useState();

    const onPreview = async (file) => {
    };

    const beforeUpload = async (file) => {
        setFile(file)
    }

    const onRemove = (file) => {
        setFile(null)
    }

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="model3d-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: '3D Model',
                    children: <>
                        <div className="model3d-collapse-content">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="model-upload"
                                showUploadList={false}
                                onRemove={onRemove}
                                onPreview={onPreview}
                                beforeUpload={beforeUpload}
                                accept=".glb"
                            >
                                <div className="model-3d-info">
                                    <div className="model-3d-text flex gap-[15px] items-center">
                                        <img src={Model3dIcon} alt="" />
                                        <span>Manequine</span>
                                    </div>
                                    <div className="text-change">
                                        Change
                                    </div>
                                </div>
                            </Upload>
                        </div>
                    </>,
                },
            ]}
        />
    </>
}
export default Model3DCollapse