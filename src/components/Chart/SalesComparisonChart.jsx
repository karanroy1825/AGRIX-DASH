import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import sales2324 from "../../data/sales_2324.json";
import sales2425 from "../../data/sales_2425.json";

const SalesComparisonChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });

  useEffect(() => {
    // Extract monthly sales for both years
    const months = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];

    function getMonthIndex(monthAbbr) {
      return months.indexOf(monthAbbr);
    }

    const processSales = (data) => {
      let monthlySales = {};
      data.forEach((order) => {
        let date = new Date(order.orderDate);
        let month = date.toLocaleString("default", { month: "short" });
        if (!monthlySales[month]) monthlySales[month] = 0;
        monthlySales[month] += order.grandTotal;
      });

      // Map in Apr → Mar order
      return months.map((m) => monthlySales[m] || 0);
    };

    const data2324 = processSales(sales2324.response_data);
    const data2425 = processSales(sales2425.response_data);

    setChartData({
      series: [
        { name: "2023-24", data: data2324 },
        { name: "2024-25", data: data2425 },
      ],
      options: {
        chart: {
          type: "area",
          height: 400,
          toolbar: { show: true },
        },
        colors: ["#12ab14", "#ff5722"], // green + orange
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        xaxis: {
          categories: months,
          title: { text: "Months" },
        },
        yaxis: {
          title: { text: "Sales Amount (₹)" },
          labels: {
            formatter: (val) => "₹ " + val.toLocaleString(),
          },
        },
        tooltip: {
          y: {
            formatter: (val) => "₹ " + val.toLocaleString(),
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
        },
      },
    });
  }, []);

  return (
    <div className="mt-8 p-4 border border-black rounded-[8px] bg-white shadow flex justify-center">
      <div className="w-full max-w-[1100px]">
        <h2 className="text-lg font-bold mb-4 text-center">Sales Comparison (2023-24 vs 2024-25)</h2>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={400}
          width="250%"
        />
      </div>
    </div>
  );
};

export default SalesComparisonChart;
