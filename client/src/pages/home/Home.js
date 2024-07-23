import { Row, Col } from "antd"
import { useNavigate } from 'react-router-dom';

import "./styles.scss"
import GroupTopChart from "../../components/groupTopChart/GroupTopChart";
import { useEffect, useRef,useLayoutEffect,useState } from "react";
import HomeOrderTable from "../../components/homeOrderTable/HomeOrderTable";
import { useMount } from 'react-use';
import { useDispatch, useSelector } from "react-redux";
import { setStepIndex,setRun,getRun,getStepIndex,setSteps,getSteps } from "../../redux/joyrideSlice";
import { getHomeFirst,setHomeFirst } from "../../redux/homepageSlice";
import { getFirstLogin } from "../../redux/appSlice";
import Onboarding from '../../components/Onboarding/Onboarding'
import StatisticalStayTime from "../../components/statisticalStayTime/StatisticalStayTime";
import StatisticalFeaturedItems from "../../components/statisticalFeaturedItems/StatisticalFeaturedItems";
import HomeBanner from "../../components/homeBanner/HomeBanner";
import StatisticalMostAddedItems from "../../components/statisticalMostAddedItems/StatisticalMostAddedItems";
import StatisticalMostRemovedItems from "../../components/statisticalMostRemovedItems/StatisticalMostRemovedItems";


const Home = () => {
    const refSquareChart = useRef()
    const dispatch = useDispatch()
    const history = useNavigate();
    const run = useSelector(getRun)
    const isHomeFirst=useSelector(getHomeFirst)

    useMount(()=>{


        dispatch(setHomeFirst())



    })

    useEffect(() => {
        dispatch(setRun(true))
        const resizeObserver = new ResizeObserver(throttle(() => {
                if (parent && refSquareChart.current) {
                    refSquareChart.current.style.height = `${refSquareChart.current.clientWidth}px`
                }
            }, 100)
        );
        const parent = document.getElementById("siteLayout");
    
        resizeObserver.observe(parent);
    
        return () => {
            resizeObserver.disconnect();
        };
    }, [])

    const throttle = (f, delay) => {
        let timer = 0;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => f.apply(this, args), delay);
        }
    }

    return <Row  gutter={[26, 26]} className="!ml-0 !mr-0 mt-[12px] home-container mb-[120px]">
        <Col lg={17} md={24} sm={24} xs={24} className="!p-0">
            <Row gutter={[26, 26]} className="!ml-0 !mr-0">
                <GroupTopChart />
                <Col lg={24} md={24} sm={24} xs={24}>
                    <HomeBanner />
                </Col>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <StatisticalStayTime />
                </Col>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <StatisticalFeaturedItems />
                </Col>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <StatisticalMostAddedItems />
                </Col>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <StatisticalMostRemovedItems />
                </Col>
                <Col  lg={24} md={24} sm={24} xs={24}>
                    <Row  gutter={[26, 26]} className="!ml-0 !mr-0 rounded-[12px] last-order-container items-center">
                        <Col span={24} className="w-full flex justify-between items-center">
                            <div className="last-order-tittle">
                                Last 7 Orders
                            </div>
                            <div className="last-view-all">
                                View All
                            </div>
                        </Col>
                        <Col lg={7} md={8} sm={24} xs={24}>
                            <div className="square-chart" ref={refSquareChart}>
                                <div className="chart-content">
                                    <div className="text-value">
                                        0
                                    </div>
                                    <div className="text-transactions">
                                        Total Transactions
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={17} md={16} sm={24} xs={24}>
                            <HomeOrderTable />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    </Row>
}
export default Home;
