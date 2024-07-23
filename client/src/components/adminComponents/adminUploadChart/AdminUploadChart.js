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
            color: "rgba(255, 255, 255, 0.40)",
            offset: false,
            display: false
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
            color: "rgba(255, 255, 255, 0.40)",
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

const AdminUploadChart = ({data}) => {
  const chartRef = useRef(null);
    const labels =['Right', 'Medium', 'Top', 'Up', 'T', 'F', 'Flop', 'Bet'];
    const [chartData, setChartData] = useState({
      datasets: [],
    });

    useEffect(() => {
      const dataChart = {
        labels,
        datasets: [
          {
            label: "Dataset 1",
            data: [70, 110, 90, 120, 140, 50, 90, 130],
            borderColor: "#FFFFFF",
            backgroundColor: createGradient(chartRef.current.ctx, chartRef.current.chartArea),
            borderWidth: 0,
            barThickness: 10,
            borderRadius: 5,
            fill: true
          }
        ]
      };
      setChartData(dataChart)
    }, [])

    function createGradient(ctx, area) {
        const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
        
        gradient.addColorStop(0, '#95A4FC');
        gradient.addColorStop(0.5, '#C6C7F8');
        gradient.addColorStop(1, '#C6C7F8');
        
        return gradient;
    }

    return <Bar ref={chartRef} options={options} data={chartData} />;
}
export default AdminUploadChart;