import "./styles.scss"
import ArrowDownIcon from "../../../../assets/images/project/arrow-down.svg"
import { Collapse, Input } from "antd";
import UploadBrandLogo from "../uploadBrandLogo/UploadBrandLogo";
import UploadBackground from "../uploadBackground/UploadBackground";
import StoreNameStyle from "../storeNameStyle/StoreNameStyle";
import { useSelector } from "react-redux";
import { getStoreBrandSetupInfo, setStoreBrandSetupInfo, setStoreBrandSetupInfoStoreNameStyle } from "../../../../redux/storeThemeSlice";
import { useAppDispatch } from "../../../../redux";
import _ from "lodash";
import TextEditor from "../../../textEditor/TextEditor";

const BrandSetup = () => {
    const dispatch = useAppDispatch()
    const storeBrandSetupInfo = useSelector(getStoreBrandSetupInfo)


    return <>
        <div className="theme-brand-setup-collapse-content">
            <div>
                <UploadBrandLogo />
            </div>
            <div className="mt-[12px]">
                <div className="font-inter text-[16px] leading-[19px] text-[#FFF] text-left">
                    Background
                </div>
                <div className="mt-[8px]">
                    <UploadBackground />
                </div>
            </div>
            <div className="mt-[12px]">
                <div className="font-inter text-[16px] leading-[19px] text-[#FFF] text-left">
                    Store Name
                </div>
                <div className="mt-[8px]">
                    <Input 
                        type="text" 
                        value={storeBrandSetupInfo?.name}
                        className="input-name"
                        maxLength={80}
                        onChange={(e) => {dispatch(setStoreBrandSetupInfo({name: e.target.value}))}}
                    />
                </div>
                <div className="mt-[4px]">
                    <StoreNameStyle 
                        item={storeBrandSetupInfo.storeNameStyle}
                        onTextAttributeChange={(key, value) => {dispatch(setStoreBrandSetupInfoStoreNameStyle({[key]: value}))}}
                    />
                </div>
            </div>
            <div className="mt-[12px]">
                <div className="flex justify-between gap-[10px] items-center">
                    <div className="font-inter text-[16px] leading-[19px] text-[#FFF] text-left">
                        Store Description
                    </div>
                    <span className="total-info pr-[32px]">
                        <span className="num">
                            {_.get(storeBrandSetupInfo, ['description', 'length'], 0)}
                        </span>
                        <span className="total">
                            /1000
                        </span>
                    </span>
                </div>
                <div className="mt-[8px]">
                    <TextEditor 
                        value={storeBrandSetupInfo?.description || ""}
                        onChange={(e) => {dispatch(setStoreBrandSetupInfo({description: e}))}}
                    />
                    {/* <Input.TextArea 
                        value={storeBrandSetupInfo?.description || ""}
                        rows={8}
                        maxLength={1000}
                        className="text-description"
                        onChange={(e) => {dispatch(setStoreBrandSetupInfo({description: e.target.value}))}}
                    /> */}
                </div>
            </div>
        </div>
    </>
}
export default BrandSetup;