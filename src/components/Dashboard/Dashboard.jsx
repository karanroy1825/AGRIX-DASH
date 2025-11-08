import React, { useEffect, useState } from "react";
import CardBox from "../Card/CardBox";
import SalesChart from "../Chart/SalesChart";
import OrderBarChart from "../Chart/OrdersBarChart";
import ClusterSalesPieChart from "../Chart/ClusterSalesPieChart";
import SalesComparisonChart from "../Business/SalesComparisonChart";
import SeasonalSalesChart from "../Season/SeasonalSalesChart";
import TopProductsChart from "../Order/TopProductsChart";
import FarmerEngagementTrends from "../Farmer/FarmerEngagementTrends";
import Navbar from "../Navbar/Navbar.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import ClusterTable from "../Cluster/ClusterTable.jsx";
import ClusterAnalyticsDashboard from "../Cluster/ClusterAnalyticsDashboard.jsx";

import sales2324 from "../../data/sales_2324.json";
import sales2425 from "../../data/sales_2425.json";

function Dashboard({ selectedYear, setSelectedYear }) {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalFarmers: 0,
    totalClusters: 0,
  });

  // Individual card data states
  const [cardData, setCardData] = useState({
    totalSales: { value: 0, year: selectedYear },
    totalOrders: { value: 0, year: selectedYear },
    totalFarmers: { value: 0, year: selectedYear },
    totalClusters: { value: 0, year: selectedYear },
  });

  const [chartData, setChartData] = useState({
    dates: [],
    sales: [],
  });

  // Function to calculate data for a specific year
  const calculateDataForYear = (year) => {
    let data = [];
    let hardcodedSales = 0;

    if (year === "2023-24") {
      data = sales2324.response_data;
      hardcodedSales = 25000;
    } else if (year === "2024-25") {
      data = sales2425.response_data;
      hardcodedSales = 40000;
    } else {
      // Current year - use global selectedYear data
      if (selectedYear === "2023-24") {
        data = sales2324.response_data;
        hardcodedSales = 25000;
      } else if (selectedYear === "2024-25") {
        data = sales2425.response_data;
        hardcodedSales = 40000;
      }
    }

    let farmers = new Set();
    let clusters = new Set();
    let uniqueOrders = new Set();

    // For 2023-24, handle phone number deduplication
    if (year === "2023-24" || (year === "Current" && selectedYear === "2023-24")) {
      const phoneToFarmerId = new Map();
      
      // Build phone-to-farmerId mapping
      data.forEach((order) => {
        const phone = order.farmerPhoneNumber;
        const farmerId = order.farmerId;
        
        if (phone && farmerId) {
          phoneToFarmerId.set(phone, farmerId);
        }
      });
      
      // Count unique farmers
      data.forEach((order) => {
        const phone = order.farmerPhoneNumber;
        const farmerId = order.farmerId;
        
        if (farmerId) {
          farmers.add(farmerId);
        } else if (phone && !phoneToFarmerId.has(phone)) {
          // Phone never appears with farmerId
          farmers.add(phone);
        }
        
        if (order.clusterId) clusters.add(order.clusterId);
        if (order.orderID) uniqueOrders.add(order.orderID);
      });
    } else {
      // For other years, simple farmerId counting
      data.forEach((order) => {
        if (order.farmerId) farmers.add(order.farmerId);
        if (order.clusterId) clusters.add(order.clusterId);
        if (order.orderID) uniqueOrders.add(order.orderID);
      });
    }

    return {
      totalSales: hardcodedSales,
      totalOrders: uniqueOrders.size,
      totalFarmers: farmers.size,
      totalClusters: clusters.size,
    };
  };

  // Handle individual card year changes
  const handleCardYearChange = (cardType, year) => {
    const newData = calculateDataForYear(year);
    setCardData(prev => ({
      ...prev,
      [cardType]: { value: newData[cardType], year: year }
    }));
  };

  // Handle menu item clicks
  const handleMenuClick = (menuId) => {
    setActiveMenuItem(menuId);
    // Here you can add navigation logic for different menu items
    console.log(`Navigating to: ${menuId}`);
  };

  useEffect(() => {
    let data = [];
    let hardcodedSales = 0;

    if (selectedYear === "2023-24") {
      data = sales2324.response_data;
      hardcodedSales = 25000;
    } else if (selectedYear === "2024-25") {
      data = sales2425.response_data;
      hardcodedSales = 40000;
    }

    let farmers = new Set();
    let clusters = new Set();
    let uniqueOrders = new Set();

    let monthlySales = {};

    // For 2023-24, we need to handle phone number deduplication
    if (selectedYear === "2023-24") {
      // Build phone-to-farmerId mapping
      const phoneToFarmerId = new Map();
      const phonesWithoutFarmerId = new Set();
      
      data.forEach((order) => {
        const phone = order.farmerPhoneNumber;
        const farmerId = order.farmerId;
        
        if (phone && farmerId) {
          phoneToFarmerId.set(phone, farmerId);
        } else if (phone && !farmerId) {
          phonesWithoutFarmerId.add(phone);
        }
      });
      
      // Now count unique farmers
      data.forEach((order) => {
        const phone = order.farmerPhoneNumber;
        const farmerId = order.farmerId;
        
        if (farmerId) {
          // Has farmerId, add it
          farmers.add(farmerId);
        } else if (phone) {
          // No farmerId, check if this phone is mapped to a farmerId
          if (!phoneToFarmerId.has(phone)) {
            // Phone never appears with farmerId, count it as unique
            farmers.add(phone);
          }
          // If phone IS mapped, the farmerId will be counted in the farmerId pass above
        }
        
        if (order.clusterId) clusters.add(order.clusterId);
        if (order.orderID) uniqueOrders.add(order.orderID);

        // Aggregate monthly sales
        let date = new Date(order.orderDate);
        let month = date.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        }); // e.g., "Apr 23"
        if (!monthlySales[month]) monthlySales[month] = 0;
        monthlySales[month] += order.grandTotal;
      });
    } else {
      // For other years, use simple farmerId counting
      data.forEach((order) => {
        if (order.farmerId) farmers.add(order.farmerId);
        if (order.clusterId) clusters.add(order.clusterId);
        if (order.orderID) uniqueOrders.add(order.orderID);

        // Aggregate monthly sales
        let date = new Date(order.orderDate);
        let month = date.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        }); // e.g., "Apr 23"
        if (!monthlySales[month]) monthlySales[month] = 0;
        monthlySales[month] += order.grandTotal;
      });
    }

    // Sort the months chronologically
    const dates = Object.keys(monthlySales).sort((a, b) => {
      const [monthA, yearA] = a.split(" ");
      const [monthB, yearB] = b.split(" ");
      const dateA = new Date(`20${yearA}`, getMonthIndex(monthA));
      const dateB = new Date(`20${yearB}`, getMonthIndex(monthB));
      return dateA - dateB;
    });

    const sales = dates.map((month) => monthlySales[month]);

    setSummary({
      totalSales: hardcodedSales,
      totalOrders: uniqueOrders.size,
      totalFarmers: farmers.size,
      totalClusters: clusters.size,
    });

    // Initialize card data with current global year
    setCardData({
      totalSales: { value: hardcodedSales, year: selectedYear },
      totalOrders: { value: uniqueOrders.size, year: selectedYear },
      totalFarmers: { value: farmers.size, year: selectedYear },
      totalClusters: { value: clusters.size, year: selectedYear },
    });

    setChartData({
      dates: dates,
      sales: sales,
    });
  }, [selectedYear]);

  // Helper function to map month abbreviation to index
  function getMonthIndex(monthAbbr) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.indexOf(monthAbbr);
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeItem={activeMenuItem} onMenuClick={handleMenuClick} />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-56 flex flex-col">
        <Navbar selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
        
        {/* Dashboard Content */}
        {activeMenuItem === "dashboard" && (
          <div className="flex flex-col w-full mt-16 mb-2 mx-2 px-4">
            {/* Cards Section */}
            <div className="flex justify-around flex-wrap w-full mt-5" style={{paddingRight: '2rem'}}>
          <CardBox
            title="Total Sales"
            value={`₹ ${cardData.totalSales.value.toLocaleString()}`}
            iconPath="M12 6v6l4 2"
            onYearChange={(year) => handleCardYearChange('totalSales', year)}
            globalSelectedYear={selectedYear}
          />
          <CardBox
            title="Total Orders"
            value={cardData.totalOrders.value}
            iconPath="M3 3h18v18H3z"
            onYearChange={(year) => handleCardYearChange('totalOrders', year)}
            globalSelectedYear={selectedYear}
          />
          <CardBox
            title="Total Farmers"
            value={cardData.totalFarmers.value}
            iconPath="M5 13l4 4L19 7"
            onYearChange={(year) => handleCardYearChange('totalFarmers', year)}
            globalSelectedYear={selectedYear}
          />
          <CardBox
            title="Active Clusters"
            value={cardData.totalClusters.value}
            iconPath="M12 2a10 10 0 100 20 10 10 0 000-20z"
            onYearChange={(year) => handleCardYearChange('totalClusters', year)}
            globalSelectedYear={selectedYear}
          />
        </div>

        {/* Top Charts Section - Sales Chart and Pie Chart side by side */}
        <div className="flex gap-6 mt-5 mb-8" style={{paddingRight: '2rem'}}>
          {/* Left Side - Sales Chart */}
          <div className="flex-1">
            <div
              className="
                p-4 rounded-[8px] bg-white border border-black
                hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]
                transition-shadow
              "
            >
              <SalesChart dates={chartData.dates} sales={chartData.sales} />
            </div>
          </div>

          {/* Right Side - Cluster Sales Pie Chart */}
          <div className="flex-1 flex justify-center items-center">
            <div
              className="
                p-4 rounded-[8px] bg-white border border-black
                hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]
                transition-shadow
              "
            >
              <ClusterSalesPieChart
                selectedYear={selectedYear}
                sales2324={sales2324}
                sales2425={sales2425}
              />
            </div>
          </div>
        </div>

        {/* Bottom Chart Section - Order Bar Chart */}
        <div className="mt-5" style={{paddingRight: '2rem'}}>
          <div
            className="
              p-4 rounded-[8px] bg-white border border-black
              hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]
              transition-shadow
            "
          >
            <OrderBarChart selectedYear={selectedYear} />
          </div>
        </div>

          </div>
        )}
        
        {/* Placeholder content for other menu items */}
        {activeMenuItem === "cluster" && (
          <div className="flex-1 overflow-auto">
            <ClusterAnalyticsDashboard selectedYear={selectedYear} />
            <ClusterTable selectedYear={selectedYear} />
          </div>
        )}
        
        {activeMenuItem === "order" && (
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
            <TopProductsChart selectedYear={selectedYear} />
          </div>
        )}
        
        {activeMenuItem === "farmer" && (
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold text-gray-800">Farmer Management</h1>
            <FarmerEngagementTrends />
          </div>
        )}
        
        {activeMenuItem === "business" && (
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold text-gray-800">Business Analytics</h1>
            <SalesComparisonChart />
          </div>
        )}
        
        {activeMenuItem === "season" && (
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Seasonal Analytics</h1>
            <SeasonalSalesChart />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
