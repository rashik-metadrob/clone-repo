import { Progress, Select } from "antd"
import GrowingUpIcon from "../../../assets/images/admin/growing-up.svg"
import GrowingDownIcon from "../../../assets/images/admin/growing-down.svg"
import { useEffect, useState } from "react"
import orderApi from "../../../api/order.api"
import _ from 'lodash'
import { ANALYTICS_BY } from "../../../utils/constants"
import { kFormatter } from "../../../utils/util"

const GrossIncome = () => {
    const [analyticsBy, setAnalyticsBy] = useState(ANALYTICS_BY.MONTH)
    const [data, setData] = useState()
    useEffect(() => {
        orderApi.getGrossIncome().then(data => {
            setData(data)
        })
    },[])

    return <>
        <div className="statistical-card gross-income-card">
            <div className="flex justify-between items-center">
                <div className="text-title">
                    Gross Income
                </div>
                <Select
                    className="statistic-by-select"
                    defaultValue={'/mo'}
                    options={[{label: "/mo", value: "/mo"}]}
                />
            </div>
            <div className="mt-[16px] flex justify-between">
                <div>
                    <div className="text-total">
                        $ {kFormatter(_.get(data, 'thisMonth', 0))}
                    </div>
                    <div className="text-percent mt-[8px]">
                        {data?.percent}% 
                    </div>
                </div>
                <img src={data?.percent > 0 ? GrowingUpIcon : GrowingDownIcon} alt="" />
            </div>
            <div className="mt-[24px]">
                <Progress percent={+Math.abs(data?.percent) || 0} key={+data?.percent || 0} showInfo={false} strokeColor={data?.percent > 0 ? "#BAEDBD" : "#FF1F00"} trailColor="rgba(255, 255, 255, 0.20)"/>
            </div>
        </div>
    </>
}
export default GrossIncome