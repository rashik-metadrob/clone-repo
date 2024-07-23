import { Col, Row } from "antd"
import LineChart from "../lineChart/LineChart"
import ArrowTopIcon from "../../assets/images/home/arrow-top.svg"
import ArrowDownIcon from "../../assets/images/home/arrow-down.svg"
import "./styles.scss"
import { useEffect, useState } from "react"
import trackingApi from "../../api/tracking.api"
import _ from "lodash"
import moment from 'moment'
import orderApi from "../../api/order.api"

const GroupTopChart = () => {
    const [dataInteractivity, setDataInteractivity] = useState()
    const [dataOrdersLast7Days, setOrdersLast7Days] = useState()
    const [chartOrderData, setChartOrderData] = useState()
    useEffect(() => {
        trackingApi.countTotalTimeInteractivityThisMonth().then(data => {
            setDataInteractivity(data)
        })

        orderApi.getOrdersLast7Days().then(data => {
            setOrdersLast7Days(data)
            setChartOrderData({
                labels: [``, ``],
                values: [data.lastWeek, data.thisWeek]
            })
        })
    }, [])

    return <>
        <Col lg={8} md={12} sm={24} xs={24}>
            <div className="chart-container h-full">
                <div className="chart-container-top">
                    <div className="text-num-info">
                    {_.get(dataOrdersLast7Days, 'thisWeek', 0)}
                    </div>
                    <div className="canvas-chart-container">
                        <LineChart isGradient={true} data={chartOrderData}/>
                    </div>
                </div>
                <div id="tester" className="chart-container-bottom mt-[16px]">
                    <div className="text-chart-tittle">
                        Orders in Last 7 Days
                    </div>
                    <div className="mt-[10px] flex gap-[8px] items-center">
                        <div className="text-last-month">
                            Last Week :
                        </div>
                        <div className={`text-percent ${_.get(dataOrdersLast7Days, 'percent', 0) > 0 ? '' : '!text-[#FF1F00]'}`}>
                            {_.get(dataOrdersLast7Days, 'percent', 0)}%
                        </div>
                        <img src={_.get(dataOrdersLast7Days, 'percent', 0) > 0 ? ArrowTopIcon : ArrowDownIcon} alt="" className={`${_.get(dataOrdersLast7Days, 'percent', 0) <= 0 ? 'rotate-180' : 0}`}/>
                    </div>
                </div>
            </div>
        </Col>
        <Col id="analyticsContainer" lg={8} md={12} sm={24} xs={24}>
            <div className="chart-container h-full">
                <div className="chart-container-top">
                    <div className="text-num-info">
                    {(_.get(dataInteractivity, 'thisMonth', 0) / 3600).toFixed(3)}<span className="text-hrs">Hrs</span>
                    </div>
                </div>
                <div className="chart-container-bottom mt-[16px]">
                    <div className="text-chart-tittle">
                        Stores Interactivity in This month
                    </div>
                    <div className="mt-[10px] flex gap-[8px] items-center">
                        <div className="text-last-month">
                            Last Month :
                        </div>
                        <div className={`text-percent ${_.get(dataInteractivity, 'percent', 0) > 0 ? '' : '!text-[#FF1F00]'}`}>
                            {_.get(dataInteractivity, 'percent', 0)}%
                        </div>
                        <img src={_.get(dataInteractivity, 'percent', 0) > 0 ? ArrowTopIcon : ArrowDownIcon} alt="" className={`${_.get(dataInteractivity, 'percent', 0) < 0 ? 'rotate-180' : 0}`}/>
                    </div>
                </div>
            </div>
        </Col>
        <Col lg={8} md={24} sm={24} xs={24}>
            <div className="chart-container h-full">
                <div className="chart-container-top">
                    <div className="canvas-chart-container">
                        <LineChart isGradient={false}/>
                    </div>
                </div>
                <div className="chart-container-bottom mt-[16px]">
                    <div className="text-chart-tittle">
                        Login Activity in Last month
                    </div>
                    <div className="mt-[10px] flex gap-[8px] items-center">
                        <div className="text-last-month">
                            Last Month :
                        </div>
                        <div className="text-percent">
                            0%
                        </div>
                        <img src={ArrowTopIcon} alt="" />
                    </div>
                </div>
            </div>
        </Col>
    </>
}
export default GroupTopChart
