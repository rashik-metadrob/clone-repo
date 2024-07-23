import { Col, Progress, Row, Select } from "antd";
import "./styles.scss"
import GroupTopChart from "../../components/groupTopChart/GroupTopChart";
import { useMount } from 'react-use';

import ArrowIcon from "../../assets/images/analytics/arrow.svg"
import ApplicationsChart from "../../components/applicationsChart/ApplicationsChart";
import RespontimeChart from "../../components/respontimeChart/RespontimeChart";
import { useRef } from "react";
import ExceptionChart from "../../components/exceptionChart/ExceptionChart";
import LogChart from "../../components/logChart/LogChart";
import {useDispatch, useSelector} from "react-redux"

import ListApplication1 from "../../assets/json/listApplication1.json"
import ListApplication2 from "../../assets/json/listApplication2.json"
import ApplicationsLevelChart from "../../components/applicationsLevelChart/ApplicationsLevelChart";
import { setStepIndex,setRun,getRun,getStepIndex } from "../../redux/joyrideSlice";
import NumOfUserEnterByWeek from "../../components/numOfUserEnterByWeek/NumOfUserEnterByWeek";
import NumOfUserEnterByMonth from "../../components/numOfUserEnterByMonth/NumOfUserEnterByMonth";
const Analytics = () => {
    //   const dispatch = useDispatch()
    //   const run = useSelector(getRun)
    // useMount(() => {
    //   console.log(run,"runside")
    //   setTimeout(()=>{
    //     if(run==false){
    //       dispatch(setRun(true))
    //       dispatch(setStepIndex(3))
    //     }
    //   },2000)
    // });
    // const refResponseChartContainer = useRef()

    return <>
    <Row  gutter={[26, 26]} className="!ml-0 !mr-0 mt-[12px] analytics-container mb-[120px]">
        <Col lg={17} md={24} sm={24} xs={24} className="!p-0">
            <Row gutter={[26, 26]} className="!ml-0 !mr-0">
                <GroupTopChart />
            </Row>
            <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[26px] px-[13px]">
                <div className="over-view-header">
                    <div className="text-store-overview">
                        Store Overview
                    </div>
                    {/* <div className="over-view-group">
                        <Select
                            className="select-filter"
                            showSearch
                            defaultValue={""}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            suffixIcon={<img src={ArrowIcon} alt="" />}
                            options={[
                            ]}
                        />
                        <div className="text-date">
                            -
                        </div>
                    </div> */}
                </div>
            </Row>
            <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[26px]">
                {/* <Col lg={8} md={12} sm={24} xs={24}>
                    <div className="chart-container h-full">
                        <ApplicationsChart />
                    </div>
                </Col> */}
                <Col lg={24} md={24} sm={24} xs={24}>
                    <NumOfUserEnterByWeek />
                </Col>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <NumOfUserEnterByMonth />
                </Col>
                {/* <Col lg={16} md={24} sm={24} xs={24}>
                    <div className="chart-container h-full" ref={refResponseChartContainer}>
                        <RespontimeChart refContainer={refResponseChartContainer}/>
                    </div>
                </Col> */}
            </Row>
            <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[26px]">
                <Col lg={16} md={24} sm={24} xs={24} className="!p-0">
                    <Row gutter={[26, 26]} className="!ml-0 !mr-0">
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <div className="chart-container h-full">
                                <div className="chart-tittle-group">
                                    <div className="text-chart-tittle">
                                    </div>
                                    <div className="chart-tittle-right">
                                        <div className="text-total !text-[#FEE622]">
                                            0k
                                        </div>
                                        <div className="text-total-des">
                                            Total exception
                                        </div>
                                    </div>
                                </div>
                                <ExceptionChart />
                            </div>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <div className="chart-container h-full">
                                <div className="chart-tittle-group">
                                    <div className="text-chart-tittle">
                                        Log Overview
                                    </div>
                                    <div className="chart-tittle-right">
                                        <div className="text-total !text-[#F76FFE]">
                                            0k
                                        </div>
                                        <div className="text-total-des">
                                            Total log
                                        </div>
                                    </div>
                                </div>
                                <LogChart />
                            </div>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <div className="h-full application-analytic-container">
                                <div className="flex items-center justify-between">
                                    <div className="text-tittle">
                                        Application name
                                    </div>
                                    <div className="text-tittle">
                                        Total events
                                    </div>
                                </div>
                                {
                                    ListApplication1 &&
                                    ListApplication1.map((el, index) => {
                                        return <>
                                            <div className="application-item" key={`app-1-${index}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-name">
                                                        {el.name}
                                                    </div>
                                                    <div className="text-value">
                                                        {el.value}
                                                    </div>
                                                </div>
                                                <Progress percent={el.value / el.total * 100} strokeColor={el.color} trailColor="#232940" showInfo={false} size="small" />
                                            </div>
                                        </>
                                    })
                                }
                            </div>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <div className="h-full application-analytic-container">
                                <div className="flex items-center justify-between">
                                    <div className="text-tittle">
                                        Application name
                                    </div>
                                    <div className="text-tittle">
                                        Total events
                                    </div>
                                </div>
                                {
                                    ListApplication2 &&
                                    ListApplication2.map((el, index) => {
                                        return <>
                                            <div className="application-item" key={`app-2-${index}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-name">
                                                        {el.name}
                                                    </div>
                                                    <div className="text-value">
                                                        {el.value}
                                                    </div>
                                                </div>
                                                <Progress percent={el.value / el.total * 100} strokeColor={el.color} trailColor="#232940" showInfo={false} size="small" />
                                            </div>
                                        </>
                                    })
                                }
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col lg={8} md={24} sm={24} xs={24}>
                    <ApplicationsLevelChart />
                </Col>
            </Row>
        </Col>
    </Row>
    </>
}
export default Analytics;
