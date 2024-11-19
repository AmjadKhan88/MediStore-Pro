import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import "./Home.css";
import { StoreContext } from "../../Context/ContextApi";

// Register required components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

 function  Home()  {
  const [chartData, setChartData] = useState(null);
  const token = localStorage.getItem("medicineToken");
 const { ApiUrl } = useContext(StoreContext);
  const fetchDashboardData = async (api) => {
    try {
      const response = await axios.get(
        `${ApiUrl}/dashboard/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const data = response.data.data;

        // Prepare data for chart
        setChartData({
          labels: ["Headman", "Patient", "Medicine", "Category"],
          datasets: [
            {
              label: "Total Count",
              data: [
                data.headman.total_headman,
                data.patient.total_patient,
                data.medicine.total_medicine,
                data.category.total_category,
              ],
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "Pending/Expiring",
              data: [
                data.headman.not_pay_headman,
                data.patient.not_pay_patient,
                data.medicine.expire_medicine,
                0, // No pending for category
              ],
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div>
      <h2>Store Info Overview</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Overview of Store Data",
            },
            datalabels: {
              anchor: "end",
              align: "top",
              color: "#000",
              font: {
                weight: "bold",
              },
              formatter: (value) => value, // Display value directly
            },
          },
        }}
      />
    </div>
  );
}

export default Home;
