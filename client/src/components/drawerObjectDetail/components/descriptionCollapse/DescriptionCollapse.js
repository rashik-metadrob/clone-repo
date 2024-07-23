import { Collapse, Input } from "antd";
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"

import "./styles.scss"
import TextEditor from "../../../textEditor/TextEditor";
import React, { useEffect, useState } from "react";
import { htmlDecode } from "../../../../utils/util";

const DescriptionCollapse = ({
    objectDetail,
    onDescriptionChange
}) => {
    const [localDescription, setLocalDescription] = useState("")
    useEffect(() => {
        if(objectDetail?.description){
            setLocalDescription(htmlDecode(objectDetail.description))
        }
    }, [objectDetail?.description])

    return <>
        <Collapse
            collapsible="header"
            defaultActiveKey={['1']}
            bordered={false}
            className="description-collapse-container"
            expandIcon={({isActive}) => (<img src={ArrowDownIcon} alt="" style={{transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)'}}/>)}
            items={[
                {
                    key: '1',
                    label: <div className="flex justify-between w-full">
                        <span>
                            Product Details / Description
                        </span>
                        <span className="total-info">
                            <span className="num">
                                {localDescription ? localDescription.length : 0}
                            </span>
                            <span className="total">
                                /1000
                            </span>
                        </span>
                    </div>,
                    children: <>
                        <div className="description-collapse-content">
                            {/* <Input.TextArea 
                                value={objectDetail?.description || ""}
                                rows={8}
                                maxLength={1000}
                                className="text-description"
                                onChange={(e) => {onDescriptionChange(e.target.value)}}
                            /> */}
                            <TextEditor 
                                value={localDescription}
                                onChange={(e) => {setLocalDescription(e)}}
                                onBlur={(e) => {onDescriptionChange(e)}}
                            />
                        </div>
                    </>,
                },
            ]}
        />
    </>
}
export default React.memo(DescriptionCollapse);