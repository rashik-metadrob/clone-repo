
import LineChart from "../../lineChart/LineChart"
import ArrowUpIcon from "../../../assets/images/admin/arrow-up.svg"
import ArrowDownIcon from "../../../assets/images/admin/arrow-down.svg"
import { useEffect, useState } from "react"
import { userApi } from "../../../api/user.api"
import { kFormatter } from "../../../utils/util"
import global from "../../../redux/global"
import { useTranslation } from "react-i18next"

const NewUsers = () => {
    const [data, setData] = useState()
    const [chartData, setChartData] = useState()
    const { t } = useTranslation()
    useEffect(() => {
        if(!global.IS_DROB_A){
            userApi.countNewUsers().then(data => {
                setData(data)
    
                if(data){
                    const currentDate = new Date();
                    const currentMonth = currentDate.getMonth() + 1;
                    const currentYear = currentDate.getFullYear();
    
                    let lastMonth = currentMonth > 1 ? currentMonth - 1 : 12;
                    let yearOfLastMonth = lastMonth === 12 ? currentYear - 1 : currentYear;
    
                    setChartData({
                        labels: [`${lastMonth}/${yearOfLastMonth}`, `${currentMonth}/${currentYear}`],
                        values: [data.lastMonth, data.thisMonth]
                    })
                }
            })
        }
    },[])

    return <>
        <div className="statistical-card flex items-center gap-[20px]">
            <div className="flex flex-col items-start">
                <div className="text-bigger-total">
                    {kFormatter(data?.thisMonth || 0)}
                </div>
                <div className="text-description mt-[8px]">
                    {t('global.new_users')}
                </div>
            </div>
            <div className="canvas-chart-container">
                <LineChart isGradient={true} data={chartData}/>

                <div className={`absolute bottom-[0] left-[12px] ${data?.percent > 0 ? 'text-increase' : 'text-decrease'}`}>
                    <img src={data?.percent > 0 ? ArrowUpIcon : ArrowDownIcon} alt="" />
                    {data?.percent}%
                </div>
            </div>
        </div>
    </>
}
export default NewUsers;