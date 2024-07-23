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
import { Bar } from "react-chartjs-2";

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
        enabled: true,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
            color: "rgba(255, 255, 255, 0.3)"
        },
        ticks: {
            color: "#ACBDCE",
            font: {
                size: 10
            }
        }
      },
      y: {
        display: true,
        grid: {
            color: "rgba(255, 255, 255, 0.3)"
        },
        ticks: {
            color: "#ACBDCE",
            font: {
                size: 10
            }
        }
      },
    },
    elements: {
      point: {
        radius: 0
      },
    },
};

const LogChart = ({data}) => {
  const chartRef = useRef(null);
    const labels =["12:00AM", "6:00AM", "12:00PM", "6:00PM"];
    const [chartData, setChartData] = useState({
      datasets: [],
    });

    useEffect(() => {
      const dataChart = {
        labels,
        datasets: [
          {
            label: "Dataset 1",
            data: labels.map(() => 0),
            borderColor: "#F76FFE",
            pointBackgroundColor: "#F76FFE",
            backgroundColor: "#F76FFE",
            borderWidth: 0,
            fill: true
          }
        ]
      };
      setChartData(dataChart)
    }, [])
    return <Bar ref={chartRef} options={options} data={chartData} />;
}
export default LogChart;