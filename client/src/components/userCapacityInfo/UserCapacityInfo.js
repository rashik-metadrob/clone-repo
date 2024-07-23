import { useSelector } from "react-redux"
import { getUserStorageInfo } from "../../redux/userStorageSlice"
import _ from "lodash"
import "./styles.scss"
import { PRICING_PLAN_VALUE } from "../../utils/constants"
import { useTranslation } from "react-i18next"

const UserCapacityInfo = () => {
    const userStorageInfo = useSelector(getUserStorageInfo)
    const {t} = useTranslation()
    return <>
        <div className="w-full user-capacity-info-container">
            <div className="flex gap-[10px] justify-between items-end">
                <span className="font-inter font-[400] leading-[11px] text-[10px] text-[#FFFFFF]">
                    {t('global.user_capacity')}
                </span>
                <span className="font-inter text-[8px] leading-[10px] font-[500] text-[#FFFFFF] text-left flex">
                    <span className="text-[#00F6FF]">{ (Math.max(0, _.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY) - _.get(userStorageInfo, ['total'], 0))).toFixed(2) }</span>/{_.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY)} mb
                </span>
            </div>
            <div className="w-full mt-[5px] h-fit">
                <div className="capacity-progress" style={{ '--percent': `${Math.min(100, _.get(userStorageInfo, ['total'], 0) / _.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY) * 100)}%` }}>
                </div>
            </div>
        </div>
    </>
}
export default UserCapacityInfo