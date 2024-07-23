import "./styles.scss"
import { useSelector } from "react-redux"
import { getUserStorageInfo } from "../../../redux/userStorageSlice"
import _ from "lodash"
import ModalRetailerStorageAnalysis from "../modalRetailerStorageAnalysis/ModalRetailerStorageAnalysis"
import { useState } from "react"
import { PRICING_PLAN_VALUE } from "../../../utils/constants"
import { useTranslation } from "react-i18next"

const RetailerHeaderCapacity = () => {
    const [isShowModal, setIsShowModal] = useState(false)
    const userStorageInfo = useSelector(getUserStorageInfo)
    const {t} = useTranslation()

    return <>
        <div className="w-full retailer-header-capacity-container">
            <div className="flex gap-[10px] justify-between items-end">
                <span className="font-inter font-[400] leading-[17px] text-[14px] text-[var(--normal-text-color)]">
                    {t('global.user_capacity')}
                </span>
                <span className="underline font-inter font-[500] leading-[9.75px] text-[8px] cursor-pointer  text-[var(--dark-blue-text)]" onClick={() => {setIsShowModal(true)}}>
                    {t('global.view')}
                </span>
            </div>
            <div className="w-full mt-[5px] h-fit">
                <div className="capacity-progress" style={{ '--percent': `${Math.min(100, _.get(userStorageInfo, ['total'], 0) / _.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY) * 100)}%` }}>
                </div>
            </div>
            <div className="mt-[5px]">
                <span className="font-inter text-[8px] leading-[10px] font-[500] text-[var(--normal-text-color)] text-left flex">
                    <span className="text-[var(--dark-blue-text)]">{ (Math.max(0, _.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY) - _.get(userStorageInfo, ['total'], 0))).toFixed(2) }</span>/{_.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY)} mb
                </span>
            </div>
        </div>

        <ModalRetailerStorageAnalysis 
            open={isShowModal}
            onClose={() => {setIsShowModal(false)}}
        />
    </>
}
export default RetailerHeaderCapacity