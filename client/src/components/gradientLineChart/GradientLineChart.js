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
        radius: 3,
        backgroundColor: "#12CCFC"
      },
    },
};

const GradientLineChart = ({borderWidth = 1, data}) => {
  const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
      datasets: [],
    });

    useEffect(() => {
      const dataChart = {
        labels: data.map(el => el.label),
        datasets: [
          {
            label: "Total entered",
            data: data.map(el => el.value),
            borderColor: "#12CCFC",
            pointBackgroundColor: "#12CCFC",
            backgroundColor: createGradient(chartRef.current.ctx, chartRef.current.chartArea),
            borderWidth: borderWidth,
            fill: true
          }
        ]
      };
      setChartData(dataChart)
    }, [data])

    function createGradient(ctx, area) {
      const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

      gradient.addColorStop(0, 'rgba(18, 205, 253,0)');
      gradient.addColorStop(0.7, 'rgba(18, 205, 253, 0.6)');
      gradient.addColorStop(1, 'rgba(18, 205, 253, 1)');
    
      return gradient;
    }
    return <Line ref={chartRef} options={options} data={chartData} />;
}
export default GradientLineChart;