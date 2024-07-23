import { useState } from "react";
import "./styles.scss"
import AdminDoughnutChart from "../adminDoughnutChart/AdminDoughnutChart"
import _ from "lodash";
import { useTranslation } from "react-i18next";

const MostUsedAnimation = () => {
    const [chartData, setChartData] = useState({
        labels: ['Up Right', 'Go Down', 'Single Mode', 'Arrow Up'],
        datasets: [
            {
                label: 'Animations',
                data: [38.6, 22.5, 30.8, 8.1],
                backgroundColor: [
                    '#BAEDBD',
                    '#95A4FC',
                    '#C6C7F8',
                    '#B1E3FF'
                ],
                borderWidth: 0,
                cutout: "85%"
            },
        ],
    });
    const {t} = useTranslation()

    return <>
        <div className="statistical-card flex flex-col">
            <div className="flex justify-between items-center">
                <div className="text-title">
                    Most Used Animation
                </div>
                <div className="text-show-all">
                    {t('global.show_all')}
                </div>
            </div>
            <div className="mt-[29px] flex-auto flex items-center gap-[31px]">
                <div className="w-[120px] h-[120px]">
                    <AdminDoughnutChart />
                </div>
                <div className="admin-most-used-legend flex-auto">
                    {
                        chartData && chartData.labels && chartData.labels.map((el, index) => (
                            <div key={el} className="flex items-center justify-between">
                                <div className="flex items-center gap-[5px]">
                                    <div className="dot" style={{backgroundColor: _.get(chartData.datasets, ['0', 'backgroundColor', index], '#BAEDBD')}}>
                                    </div>
                                    <div className="text-label">
                                        {el}
                                    </div>
                                </div>
                                <div className="text-label-percent">
                                    {_.get(chartData.datasets, ['0', 'data', index], '0')}%
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    </>
}
export default MostUsedAnimation