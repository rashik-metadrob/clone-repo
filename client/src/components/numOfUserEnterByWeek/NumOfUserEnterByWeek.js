import { useEffect, useState } from "react";
import GradientLineChart from "../gradientLineChart/GradientLineChart";
import { countUserEnterByWeek } from "../../api/tracking.api";
import { DatePicker } from "antd";
import moment from "moment"
import dayjs from 'dayjs';

const NumOfUserEnterByWeek = () => {
    const [listData, setListData] = useState([]);
    const [total, setTotal] = useState();
    const [week, setWeek] = useState(dayjs())

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > dayjs().endOf('day');
    };

    useEffect(() => {
        if(week){
            const selectedDate = new Date(week.toString());

            let firstDay = new Date(selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay() + 1),);
            let lastDay = new Date(selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay() + 7));

            const startDayOfWeek = moment(firstDay).toString();
            const endDayOfWeek = moment(lastDay).diff(moment()) > 0 ? moment().toString() :  moment(lastDay).toString();

            firstDay = new Date(startDayOfWeek);
            lastDay = new Date(endDayOfWeek)

            countUserEnterByWeek({week: week.week(), year: week.weekYear()}).then(rs => {
                let newData = [];
                for (let d = new Date(startDayOfWeek); d <= new Date(endDayOfWeek); d.setDate(d.getDate() + 1)) {
                    let numOfDate = d.getDate()
                    newData.push({
                        label: moment(d).format("DD-MM-YYYY"),
                        value: rs.results.find(el => el.date === numOfDate)?.totalEnter || 0
                    })
                }
                setTotal(
                    rs.results.reduce((value, current) => { return value + current.totalEnter}, 0)
                )
                setListData(newData)
            })
        }
    },[week])

    const onChange = (date) => {
        setWeek(date)
    }

    return <>
        <div className="chart-container h-full flex flex-col">
            <div className="chart-tittle-group">
                <div className="text-chart-tittle">
                    Num of user enter by week
                </div>
                <div className="chart-tittle-right">
                    <DatePicker 
                        className="select-filter"
                        onChange={onChange} 
                        value={week}
                        picker="week"
                        defaultValue={dayjs()}
                        disabledDate={disabledDate}
                    />
                </div>
            </div>
            <div className="flex-auto flex items-center">
                <GradientLineChart data={listData}/>
            </div>
        </div>
    </>
}
export default NumOfUserEnterByWeek;