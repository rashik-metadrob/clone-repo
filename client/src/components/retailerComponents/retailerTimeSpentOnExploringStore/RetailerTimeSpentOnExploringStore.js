
import { Select } from "antd"
import ArrowUpIcon from "../../../assets/images/admin/arrow-up.svg"
import { useEffect, useState } from "react"
import trackingApi from "../../../api/tracking.api"
import ArrowDownIcon from "../../../assets/images/admin/arrow-down.svg"
import { useTranslation } from "react-i18next"

const RetailerTimeSpentOnExploringStore = () => {
    const [data, setData] = useState()
    const {t} = useTranslation()
    useEffect(() => {
        trackingApi.countTotalTimeSpentToExploringStoreByRetailer().then(data => {
            setData(data)
        })
    },[])
    return <>
        <div className="statistical-card">
            <div className="flex justify-between">
                <div className="text-bigger-total">
                    {(data?.thisMonth / 3600).toFixed(3)}<span className="text-hrs">Hrs</span>
                </div>
                <div>
                    <Select
                        className="statistic-by-select"
                        defaultValue={'/mo'}
                        options={[{label: "/mo", value: "/mo"}]}
                    />
                </div>
            </div>
            <div className="flex justify-between gap-[12px] items-center mt-[8px]">
                <div className="text-description">
                    {t('global.time_spent_on_exploring_tore')}
                </div>
                <div className={`${data?.percent > 0 ? 'text-increase' : 'text-decrease'}`}>
                    <img src={data?.percent > 0 ? ArrowUpIcon : ArrowDownIcon} alt="" />
                    {data?.percent}%
                </div>
            </div>
        </div>
    </>
}
export default RetailerTimeSpentOnExploringStore