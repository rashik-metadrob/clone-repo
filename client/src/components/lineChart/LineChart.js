import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
};

const LineChart = ({borderWidth = 1, data, isGradient = true}) => {
  const chartRef = useRef(null);
    const labels = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
        23, 24,
    ];
    const [chartData, setChartData] = useState({
      datasets: [],
    });

    useEffect(() => {
      if(data){
        const dataChart = {
          labels: data.labels,
          datasets: [
            {
              label: "Dataset 1",
              data: data.values,
              borderColor: "#00F6FF",
              backgroundColor: createGradient(chartRef.current.ctx, chartRef.current.chartArea),
              tension: borderWidth * 0.3,
              borderWidth: borderWidth,
              fill: isGradient
            }
          ]
        };
        setChartData(dataChart)
      } else {
        const dataChart = {
          labels,
          datasets: [
            {
              label: "Dataset 1",
              data: labels.map(() =>0),
              borderColor: "#00F6FF",
              backgroundColor: createGradient(chartRef.current.ctx, chartRef.current.chartArea),
              tension: borderWidth * 0.3,
              borderWidth: borderWidth,
              fill: isGradient
            }
          ]
        };
        setChartData(dataChart)
      }
    }, [data])

    function createGradient(ctx, area) {
      const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
    
      gradient.addColorStop(0, 'rgba(0, 246, 255,0)');
      gradient.addColorStop(0.7, 'rgba(0, 246, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 246, 255, 1)');
    
      return gradient;
    }
    return <Line ref={chartRef} options={options} data={chartData} />;
}
export default LineChart;