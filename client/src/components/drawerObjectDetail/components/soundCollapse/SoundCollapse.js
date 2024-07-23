import { Collapse, Upload } from "antd"
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"
import ImageIcon from "../../../../assets/images/project/image.svg"

import "./styles.scss"
import { useState } from "react"

const {Dragger} = Upload;

const SoundCollapse = () => {
    const [file, setFile] = useState();

    const onPreview = async (file) => {
    };

    const beforeUpload = async (file) => {
        console.log("file", file)
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
            className="sound-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex">Sound</div>,
                    children: <>
                        <div className="sound-collapse-content">
                            <Dragger
                                name="avatar"
                                listType="picture-card"
                                className="model-upload"
                                showUploadList={false}
                                onRemove={onRemove}
                                onPreview={onPreview}
                                beforeUpload={beforeUpload}
                                accept=".mp3,.wav"
                            >
                                <div className="sound-info">
                                    <img src={ImageIcon} alt="" className="w-[56px] h-[56px]"/>
                                    <div className="text-drag-drop mt-[3px]">
                                        Drag & Drop
                                    </div>
                                    <div className="text-upload mt-[3px]">
                                        Uploaded media from you device
                                    </div>
                                    <div className="text-accept mt-[3px]">
                                        ( Upload .wav & .mp3 file )
                                    </div>
                                </div>
                            </Dragger>
                        </div>
                    </>,
                },
            ]}
        />
    </>
}
export default SoundCollapse