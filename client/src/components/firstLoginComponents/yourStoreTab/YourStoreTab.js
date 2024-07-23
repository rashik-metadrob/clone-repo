import { forwardRef, useImperativeHandle, useState } from "react"
import "./styles.scss"
import { Col, Input, Row } from "antd"
import YourStoreBgImage from "../../../assets/images/first-login/yourStoreBg.png"
import TextArea from "antd/es/input/TextArea"
import SelectBackground from "../../selectBackground/SelectBackground"
import LOGO from "../../../assets/images/LOGO.svg";
import { getAssetsUrl } from "../../../utils/util"

const YourStoreTab = forwardRef(({}, ref) => {
    const [formData, setFormData] = useState({
        background: "",
        storeName: "",
        description: "",
    })

    useImperativeHandle(ref, () => ({
        getData: () => {
            return formData
        },
    }));

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    return <>
        <div className="your-store-tab-container pt-[46px]">
            <Row gutter={[66, 24]} className="!mx-0">
                <Col span={24} order={2} lg={{span: 12, order: 1}}>
                    <div className="text-left text-[#FFF] font-inter text-[16px] font-[600]">
                        Store Name
                    </div>
                    <Input 
                        className="shared-first-login-input mt-[9px]"
                        placeholder="Metadrob"
                        value={formData.storeName}
                        onChange={(e) => {handleFormDataChange('storeName', e.target.value)}}
                    />
                    <div className="text-left text-[#FFF] font-inter text-[16px] font-[600] mt-[25px]">
                        Description
                    </div>
                    <TextArea 
                        className="shared-first-login-input mt-[9px] py-[21px]"
                        placeholder="Description"
                        value={formData.description}
                        maxLength={300}
                        rows={3}
                        onChange={(e) => {handleFormDataChange('description', e.target.value)}}
                    />
                    <div className="mt-[25px]">
                        <SelectBackground 
                            value={formData.background}
                            onChange={(value) => {handleFormDataChange('background', value)}}
                        />
                    </div>
                    <div className="spacer mt-[32px] relative">
                        <span className="absolute top-0 left-[50%] translate-x-[-50%] translate-y-[-50%] text-[#707070] font-inter text-[16px] font-[600] px-[16px] bg-[#0D0C0C]">
                            OR
                        </span>
                    </div>
                    <div className="mt-[19px] text-[#FFF] text-center font-inter text-[12px] font-[600] underline cursor-pointer">
                        Browse from Media Library
                    </div>
                </Col>
                <Col span={24} order={1} lg={{span: 12, order: 2}}>
                    <div className="relative w-full h-fit rounded border-[2px] border-[#FFF] rounded-[6px] relative">
                        <img src={formData.background ? getAssetsUrl(formData.background) : YourStoreBgImage} alt="" className="w-full h-[250px]"/>
                        <img src={LOGO} alt="" className="absolute w-[55px] left-[15px] top-[11px]"/>
                        <div className="absolute bottom-[11px] left-[15px] w-[calc(100%-30px)]">
                            <div className="text-left text-[#FFF] font-inter text-[16px] font-[600]">
                                {formData.storeName}
                            </div>
                            <div className="text-left text-[#FFF] font-inter text-[16px] mt-[6px]">
                                {formData.description}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    </>
})
export default YourStoreTab