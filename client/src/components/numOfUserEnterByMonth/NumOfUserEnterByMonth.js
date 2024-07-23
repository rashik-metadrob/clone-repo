import { useEffect, useState } from "react";
import GradientLineChart from "../gradientLineChart/GradientLineChart";
import { countUserEnter, countUserEnterByWeek } from "../../api/tracking.api";
import { Select } from "antd";
import ArrowIcon from "../../assets/images/products/arrow.svg"
import moment from "moment"

const NumOfUserEnterByMonth = () => {
    const [listData, setListData] = useState([]);
    const [total, setTotal] = useState();
    const [month, setMonth] = useState();
    const [listMonth, setListMonth] = useState([])

    useEffect(() => {
        const currentDate = new Date();
        const yearNumber = currentDate.getFullYear();
        
        if(month){
            const date = new Date();
            const firstDay = new Date(date.getFullYear(), month - 1, 1);
            const lastDay = new Date(date.getFullYear(), month, 0);

            const startDayOfMonth = moment(firstDay).toString();
            const endDayOfMonth = moment(lastDay).diff(moment()) > 0 ? moment().toString() :  moment(lastDay).toString()

            const startDateOfMonth = new Date(startDayOfMonth).getDate();
            const endDateOfMonth = new Date(endDayOfMonth).getDate();

            countUserEnter({startDate: startDayOfMonth, endDate: endDayOfMonth}).then(rs => {
                let newData = [];
                for(let i = startDateOfMonth; i <= endDateOfMonth; i++){
                    newData.push({
                        label: `${i}-${month}-${yearNumber}`,
                        value: rs.results.find(el => el.date === i)?.totalEnter || 0
                    })
                }
                setTotal(
                    rs.results.reduce((value, current) => { return value + current.totalEnter}, 0)
                )
                setListData(newData)
            })
        }
    },[month])

    useEffect(() => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        let newMonths = [];
        for(let i = 1; i <= month; i++){
            newMonths.push({
                label: `${i}/${year}`,
                value: i,
            })
        }

        setMonth(month)
        setListMonth(newMonths)
    },[])

    return <>
        <div className="chart-container h-full flex flex-col">
            <div className="chart-tittle-group">
                <div className="text-chart-tittle">
                    Num of user enter by month
                </div>
                <div className="chart-tittle-right">
                    <Select
                        className="select-filter"
                        showSearch
                        style={{
                            width: 200
                        }}
                        value={month}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => {setMonth(value)}}
                        suffixIcon={<img src={ArrowIcon} alt="" />}
                        options={listMonth}
                    />
                </div>
            </div>
            <div className="flex-auto flex items-center">
                <GradientLineChart data={listData}/>
            </div>
        </div>
    </>
}
export default NumOfUserEnterByMonth;