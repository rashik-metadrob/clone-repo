import { useSelector } from "react-redux"
import "./styles.scss"
import { getUserStorageInfo } from "../../../redux/userStorageSlice"
import { useMemo, useState } from "react"
import _ from "lodash"
import ModalPricingPlan from "../../modalPricingPlan/ModalPricingPlan"
import { PRICING_PLAN_VALUE } from "../../../utils/constants"
import useDetectDevice from "../../../hook/useDetectDevice"
import { useTranslation } from "react-i18next"

const RetailerStorageAnalysisCard = ({
    isShowButtonManage = true
}) => {
    const { t } = useTranslation()
    const userStorageInfo = useSelector(getUserStorageInfo)
    const [isShowModalPricing, setIsShowModalPricing] = useState(false)
    const { deviceDetectCssClass } = useDetectDevice()
    const userFeeSpace = useMemo(() => {
        return (Math.max(0, _.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY) - _.get(userStorageInfo, ['total'], 0))).toFixed(2)
    }, [userStorageInfo])

    const storageAnalysisNote = [
        {
            color: "#363F8F",
            text: "3D"
        },
        {
            color: "#BA46A1",
            text: "Videos"
        },
        {
            color: "#92B58D",
            text: "Audio"
        },
        {
            color: "#9CFCFF",
            text: "Images"
        }
    ]

    const threeDSizePercent = useMemo(() => {
        return (_.get(userStorageInfo, ['threeD'], 0)/ _.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY) * 100).toFixed(2)
    }, [userStorageInfo])
    const imagesSizePercent = useMemo(() => {
        return (_.get(userStorageInfo, ['images'], 0)/ _.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY) * 100).toFixed(2)
    }, [userStorageInfo])
    const audiosSizePercent = useMemo(() => {
        return (_.get(userStorageInfo, ['audios'], 0)/ _.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY) * 100).toFixed(2)
    }, [userStorageInfo])
    const videosSizePercent = useMemo(() => {
        return (_.get(userStorageInfo, ['videos'], 0)/ _.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY) * 100).toFixed(2)
    }, [userStorageInfo])

    return <>
        <div className={`storage-analysis-card storage-analysis-progess-card ${deviceDetectCssClass}`}>
            <div className="flex flex-wrap gap-[10px] justify-between items-center">
                <span>
                    <span className="text-storage font-inter font-[500] text-[var(--normal-text-color)]">
                        {t('global.storage')}
                    </span>
                    <span className="text-freespace pl-[10px] font-inter font-[500] text-[14px] leading-[17px] text-[var(--normal-text-color)]">
                        {t('global.free_space')} <span className="text-[var(--dark-blue-text)]">{userFeeSpace}</span>/{_.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY)} mb
                    </span>
                </span>
                {isShowButtonManage && <span className="font-inter text-[14px] leading-[17px] text-[var(--dark-blue-text)] underline cursor-pointer" onClick={() => {setIsShowModalPricing(true)}}>
                    {t('global.manage_storage')}
                </span>}
            </div>
            <div className="storage-analysis-progess mt-[24px]">
                <div 
                    className="progess-item" 
                    style={{
                        background: "#363F8F",
                        width: `${threeDSizePercent}%`
                    }}
                ></div>
                <div 
                    className="progess-item" 
                    style={{
                        background: "#BA46A1",
                        width: `${videosSizePercent}%`
                    }}
                ></div>
                <div 
                    className="progess-item" 
                    style={{
                        background: "#92B58D",
                        width: `${audiosSizePercent}%`
                    }}
                ></div>
                <div 
                    className="progess-item" 
                    style={{
                        background: "#9CFCFF",
                        width: `${imagesSizePercent}%`
                    }}
                ></div>
            </div>
            <div className="storage-analysis-note flex flex-wrap justify-center gap-x-[40px] gap-y-[12px] mt-[32px]">
                {
                    storageAnalysisNote.map((el) =>
                        <div className="node-item flex gap-[4px] items-center" key={el.text}>
                            <div className="w-[11px] h-[11px] rounded-[50%]" style={{background: el.color}}></div>
                            <span className="font-inter font-[400] text-[16px] leading-[19px] text-[var(--normal-text-color)]">
                                {t(`global.${el.text}`)}
                            </span>
                        </div>
                    )
                }
            </div>
        </div>

        {isShowButtonManage && <ModalPricingPlan 
            open={isShowModalPricing}
            onClose={() => {setIsShowModalPricing(false)}}
            isPublishProject={false}
        />}
    </>
}

export default RetailerStorageAnalysisCard