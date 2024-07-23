import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

const RespontimeChart = ({refContainer}) => {
    const [chartData, setChartData] = useState({
        datasets: [],
    });
    const [options, setOptions] = useState({
        responsive: true,
        aspectRatio: 1.65,
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    color: "#FFFFFF",
                    boxWidth: 10,
                    boxHeight: 10,
                    font: {
                        size: 10
                    },
                    borderWidth: 0
                }
              },
            title: {
                display: true,
                text: "Min/Max & Avg Response Time",
                align: "start",
                color: "#FFFFFF",
                font: {
                    size: 14,
                    weight: 'bold'
                },
                padding: 0,
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
            radius: 0,
            backgroundColor: "#12CCFC"
          },
        },
    });
    const labels = ["12:00AM", "6:00AM", "12:00PM", "6:00PM"];

    useEffect(() => {
        const dataChart = {
            labels,
            datasets: [
                {
                    type: 'line',
                    label: 'Average',
                    borderColor: '#FFFFFF',
                    backgroundColor: '#FFFFFF',
                    borderWidth: 2,
                    fill: false,
                    data: labels.map(() => 0),
                },
                {
                    type: 'bar',
                    label: 'Min/Max',
                    backgroundColor: '#1FEBCD',
                    data: labels.map(() => 0),
                    borderWidth: 0,
                }
            ],
        };
        setChartData(dataChart)
    }, [])

    useEffect(() => {
        const resizeObserver = new ResizeObserver(throttle(() => {
                if (parent) {
                    setOptions({
                        ...options,
                        aspectRatio: refContainer.current.clientWidth / refContainer.current.clientHeight
                    })
                }
            }, 100)
        );
        const parent = document.getElementById("siteLayout");
        resizeObserver.observe(parent);

        if (parent) {
            setOptions({
                ...options,
                aspectRatio: refContainer.current.clientWidth / refContainer.current.clientHeight
            })
        }

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

  return <Chart type='bar' data={chartData} options={options}/>;
}
export default RespontimeChart