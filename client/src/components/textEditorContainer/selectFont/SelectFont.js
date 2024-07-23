import { Select, Spin } from "antd"
import ArrowIcon from "../../../assets/images/products/arrow.svg"
import { useEffect, useState } from "react"
import ModalUploadFont from "../modalUploadFont/ModalUploadFont"
import assetApi from "../../../api/asset.api"
import { ASSET_TYPES } from "../../../utils/constants"
import _ from "lodash"
const SelectFont = ({
    value,
    onChange = () => {}
}) => {
    const [fontsOptions, setFontsOptions] = useState([
        {
            label: "Upload font",
            value: "Upload font"
        }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const [isShowModalUploadFont, setIsShowModalUploadFont] = useState(false)

    useEffect(() => {
        loadFonts()
    }, [])

    const onSelectFont = (value) => {
        if(value === 'Upload font') {
            setIsShowModalUploadFont(true)
        } else {
            onChange(value)
        }
    }

    const loadFonts = () => {
        setIsLoading(true)
        assetApi.getPublicAssets({
            type: ASSET_TYPES.FONT,
            page: 1,
            limit: 100
        }).then(rs => {
            setIsLoading(false)

            setFontsOptions([
                {
                    label: "Upload font",
                    value: "Upload font"
                },
                ..._.map(_.get(rs, ['results'], []), (el) => {
                    return {
                        label: el.name,
                        value: el.filePath
                    }
                })
            ])
        }).catch(err => {
            setIsLoading(false)
        })
    }

    return <>
        <Spin spinning={isLoading}>
            <Select
                placeholder="Select font"
                className="text-editor-select w-full"
                popupClassName="admin-form-select-popup"
                showSearch
                suffixIcon={<img src={ArrowIcon} alt="" />}
                value={value}
                onChange={(value) => {onSelectFont(value)}} 
                options={fontsOptions}
            />
        </Spin>

        <ModalUploadFont
            open={isShowModalUploadFont}
            onClose={() => {setIsShowModalUploadFont(false)}}
            onSuccess={() => {
                loadFonts()
                setIsShowModalUploadFont(false)
            }}
        />
    </>
}
export default SelectFont