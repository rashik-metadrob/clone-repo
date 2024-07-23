
import { useEffect, useState } from "react"
import LineChart from "../../lineChart/LineChart"
import userSubcriptionApi from "../../../api/userSubcription.api"
import { kFormatter } from "../../../utils/util"

const PremiumUsers = () => {
    const [data, setData] = useState()
    const [chartData, setChartData] = useState()
    useEffect(() => {
        userSubcriptionApi.countPremiumUsers().then(data => {
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
    },[])
    return <>
        <div className="statistical-card flex items-center gap-[20px]">
            <div className="flex flex-col items-start">
                <div className="text-bigger-total">
                    {kFormatter(data?.thisMonth || 0)}
                </div>
                <div className="text-description mt-[8px]">
                    Premium users
                </div>
            </div>
            <div className="canvas-chart-container">
                <LineChart isGradient={true} data={chartData}/>
            </div>
        </div>
    </>
}
export default PremiumUsers;