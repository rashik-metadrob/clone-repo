import LineChart from "../../lineChart/LineChart"
import ArrowUpIcon from "../../../assets/images/admin/arrow-up.svg"
import ArrowDownIcon from "../../../assets/images/admin/arrow-down.svg"
import { useEffect, useState } from "react"
import { userApi } from "../../../api/user.api"
import { kFormatter } from "../../../utils/util"
import _ from "lodash"
import { useTranslation } from "react-i18next"

const RetailerLoginActivity = () => {
    const [data, setData] = useState()
    const [chartData, setChartData] = useState()
    const { t } = useTranslation()
    useEffect(() => {
        
    },[])

    return <>
        <div className="statistical-card flex items-center gap-[20px]">
            <div className="flex flex-col items-start">
                <div className="text-bigger-total">
                    {kFormatter(data?.thisMonth || 0)}
                </div>
                <div className="text-description mt-[8px]">
                    {t('global.login_activity')}
                </div>
            </div>
            <div className="canvas-chart-container">
                <LineChart isGradient={true} data={chartData}/>

                <div className={`absolute bottom-[0] left-[12px] ${data?.percent > 0 ? 'text-increase' : 'text-decrease'}`}>
                    <img src={data?.percent > 0 ? ArrowUpIcon : ArrowDownIcon} alt="" />
                    {_.get(data, 'percent', 0)}%
                </div>
            </div>
        </div>
    </>
}
export default RetailerLoginActivity;