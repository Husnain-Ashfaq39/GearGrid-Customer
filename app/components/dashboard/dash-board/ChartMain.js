"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import useUserStore from "@/utils/store/userStore";

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
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#1967d2",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 12,
      displayColors: false,
      bodyFont: {
        size: 14,
      },
      callbacks: {
        label: function(context) {
          return `Orders: ${context.parsed.y}`;
        }
      }
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
        },
        color: "#666",
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 12,
        },
        color: "#666",
        padding: 10,
      }
    }
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 4,
      hitRadius: 6,
      hoverRadius: 6,
      backgroundColor: "#fff",
      borderWidth: 3,
    }
  },
};

// Month abbreviation mapping
const monthAbbreviations = {
  "January": "Jan",
  "February": "Feb",
  "March": "Mar",
  "April": "Apr",
  "May": "May",
  "June": "Jun",
  "July": "Jul",
  "August": "Aug",
  "September": "Sep",
  "October": "Oct",
  "November": "Nov",
  "December": "Dec"
};

const ChartMain = () => {
  const { user } = useUserStore();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Orders",
        borderColor: "#1967d2",
        backgroundColor: "rgba(25, 103, 210, 0.1)",
        data: [],
        fill: true,
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    const fetchOrderStats = async () => {
      if (!user) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/orders/user/${user._id}/stats`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch order stats');
        }

        const data = await response.json();
        
        setChartData({
          labels: data.stats.map(item => monthAbbreviations[item.month] || item.month),
          datasets: [{
            label: "Orders",
            borderColor: "#1967d2",
            backgroundColor: "rgba(25, 103, 210, 0.1)",
            data: data.stats.map(item => item.count),
            fill: true,
            borderWidth: 2,
          }],
        });
      } catch (error) {
        console.error("Error fetching order stats:", error);
      }
    };

    fetchOrderStats();
  }, [user]);

  return (
    <div className="widget-content" style={{ height: "300px", padding: "20px" }}>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default ChartMain;
