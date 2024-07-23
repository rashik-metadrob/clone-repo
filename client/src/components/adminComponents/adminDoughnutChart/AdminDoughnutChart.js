import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
    responsive: true,
    aspectRatio: 1,
    plugins: {
      legend: {
        display: false,
        position: "left",
        labels: {
            color: "#FFFFFF",
            boxWidth: 10,
            boxHeight: 10,
            font: {
                size: 10
            }
        }
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
      tooltip: {
        enabled: true,
      },
    },
    elements: {
      point: {
        radius: 3,
        backgroundColor: "#12CCFC"
      },
    },
};

const AdminDoughnutChart = ({data}) => {
    const [chartData, setChartData] = useState({
        datasets: [],
    });

    useEffect(() => {
        const dataChart = {
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
        };
        setChartData(dataChart)
    }, [])

    const textCenter = {
        id: "textCenter",
        beforeDatasetsDraw(chart, args, pluginOptions) {
            // const {ctx} = chart;

            // if(!chart.getDatasetMeta(0).data || chart.getDatasetMeta(0).data.length === 0){
            //     return
            // }

            // ctx.save();
            // ctx.font = 'bolder 24px Inter'
            // ctx.fillStyle = '#FFFFFF';
            // ctx.textAlign = 'center';
            // ctx.textBaseline = 'middle';
            // ctx.fillText('0', chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y - 8)

            // ctx.font = 'normal 12px Inter'
            // ctx.fillStyle = '#FFFFFF';
            // ctx.textAlign = 'center';
            // ctx.textBaseline = 'middle';
            // ctx.fillText('Applications', chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y + 13)
        }
    }

    return <Doughnut data={chartData} options={options} plugins={[textCenter]}/>;
}
export default AdminDoughnutChart