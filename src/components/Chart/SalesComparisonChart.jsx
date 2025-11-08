import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import sales2324 from "../../data/sales_2324.json";
import sales2425 from "../../data/sales_2425.json";

const agri_keywords = ['Lal Saag', 'Rajendra Sweta', 'SOOD DBW 303', '187 Karan Bandana', '24d', '24d Ec', '24d Ec 38%', '2967', 
  '4051 Cauliflower', 'Actara', 'Aditya Gold', 'Aditya Gold Rajendra Sweta', 'Amistar Top', 'Amphion Cabbage', 
  'Amrita Cauliflower', 'Aso Dhaniya', 'Avone Pllus', 'BIO DOSE', 'BIO DOSE Grace', 'BIO POWER', 'Banjo', 
  'Beans Vegetables', 'Berseem', 'Bio M Power', 'Bio M Power Insecticide', 'Boron', 'Boron Micro Nutrient', 
  'Bottle Gourd - (Chhutki)', 'Brinjal -(Kush)', 'Cabriotop', 'Cauliflower', 'Century Parwal', 'Cipyrox', 
  'Coriander/धनिया', 'DAP', 'DBW 187', 'DBW 222', 'DBW 303', 'Dabbang', 'Dr Amrita Cauliflower', 'Dr Cauliflower', 
  'Girija Cauliflower', 'Global Coriander', 'Glycel', 'Glyphosphate', 'Glyphosphate Glycel', 'Gracmeno G', 
  'Green Label', 'Green Label (Herbicide)', 'HD 2967', 'HD 2967 Wheat Seed', 'Hare Krishna Cabbage', 'Himil', 
  'Humi Hub', 'Humi King', 'Jai Wheat', 'Kalash Bora', 'Kanchan Cauliflower', 'Khushboo Coriander', 'Lava', 
  'Lethal Super', 'Lethal Super 505 5', 'M Gold', 'MOP', 'Madhuri Cauliflower', 'Medsulfuron', 'Miraculan', 
  'Mission', 'Mission Fungicide', 'Monsanto 9165', 'Mugda', 'Mycorrhhizae', 'N:P:K 14:28:0', 'NSC HD 2967', 
  'NSC Rajendra Sweta', 'Nominee Gold', 'Nominee Gold (Bispyrbic Sodium)', 'Nominee Gold Pi Industries', 
  'Okara -(Jhilmil)', 'PBW 152', 'PBW 343', 'PBW 502', 'PBW 550', 'Paddy Seeds', 'Pahuja White Radish', 
  'Pan Jamua', 'PhelaJiase Enzyme', 'PhelaJiase Enzyme Organic Fertilizer', 'Posak', 'Power Plus', 'Pretilachlor', 
  'Pretilachlor 50% EC', 'RK', 'RK 303', 'RK 550', 'RK Super', 'RK Super 303', 'RK Super 550', 'Rainbow Lal Saag', 
  'Rajendra Mansuri', 'Ram Nagar Rajendar', 'Rasili Narkatiya', 'Research-Radish/मूली', 'Rifit', 'SOOD 343', 
  'SSP', 'Saff', 'Samrat', 'Sangro Raddish', 'Sanjivni Bhindi', 'Semnis 7298', 'Semnis Bhindi', 'Semnis Cauliflower 60 21', 
  'Semnis Paror', 'Sharda Kadu', 'Shriram Sood 501', 'Shriram Super', 'Shriram Super 303', 'Shubra White Radish 32', 
  'Sofia', 'Sofia (Carbendazium+Hexaclonogol)', 'Sofia Fungicide', 'Sood 303 (Wheat Seed)', 'Spinach/पालक', 
  'Sri Ram 303', 'Sri Ram 303 Wheat Seed', 'Sri Ram 5Sr', 'Sriram 550', 'Sriram 303', 'Stikker', 'Sufla 7029', 
  'Sunny 2967', 'Sunny 2967 Wheat Seed', 'Sunny 303', 'Trump', 'Urea', 'VNR Bora', 'VNR Kasi Kan123', 
  'White Sorghum (Narkatiya)', 'Calcium', 'Masoor_Test'];

const implement_keywords = ['11 Furrow', '9 Furrow', 'Baller With Trolley', 'Combine Harvester Normal /कंबाइन हार्वेस्टर', 
  'Disc Harrow / डिस्क हैरो', 'Harrow/हैरो', 'Harvester', 'Harvester with Trolley /हार्वेस्टर विथ ट्रॉली', 
  'Laser And Leveller/लेजर एंड लेवलर', 'Mb Plough/एमबी प्लाऊ', 'Nine Furrow', 'Reaper Cum Binder', 
  'Rotavator', 'Rotavator/रोटावेटर', 'Sprayer', 'Straw Reaper', 'Straw Reaper 756/स्ट्रॉ रीपर 756', 
  'Super-Seeder/सुपर सीडर', 'Agriculture Drone/ड्रोन', 'Tractor 50 HP', 'Tractor 60 HP', 'Tractor 75 HP'];

const SalesComparisonChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });
  const [productFilter, setProductFilter] = useState("all");

  useEffect(() => {
    // Extract monthly sales for both years
    const months = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];

    function getMonthIndex(monthAbbr) {
      return months.indexOf(monthAbbr);
    }

    const isAgriProduct = (productName) => {
      if (!productName) return false;
      const lowered = productName.toLowerCase();
      return agri_keywords.some(keyword => 
        lowered.includes(keyword.toLowerCase())
      );
    };

    const isImplementProduct = (productName) => {
      if (!productName) return false;
      const lowered = productName.toLowerCase();
      return implement_keywords.some(keyword => 
        lowered.includes(keyword.toLowerCase())
      );
    };

    const processData = (data) => {
      let monthlyData = {};
      data.forEach((order) => {
        let date = new Date(order.orderDate);
        let month = date.toLocaleString("default", { month: "short" });
        
        if (!monthlyData[month]) monthlyData[month] = 0;
        
        // Filter based on product type
        if (productFilter === "all") {
          monthlyData[month] += order.grandTotal;
        } else if (productFilter === "agri") {
          // For agricultural products, count orders instead of sales
          const cart = order.cart || [];
          let hasAgriProducts = false;
          
          cart.forEach((item) => {
            const productName = item.productName || "";
            if (isAgriProduct(productName)) {
              hasAgriProducts = true;
            }
          });
          
          if (hasAgriProducts) {
            monthlyData[month] += 1; // Count orders, not sales amount
          }
        } else if (productFilter === "implement") {
          // For implements, show sales amount
          const cart = order.cart || [];
          let filteredTotal = 0;
          
          cart.forEach((item) => {
            const productName = item.productName || "";
            const itemTotal = parseFloat(item.productTotal || 0);
            
            if (isImplementProduct(productName)) {
              filteredTotal += itemTotal;
            }
          });
          
          if (filteredTotal > 0) {
            monthlyData[month] += filteredTotal;
          }
        }
      });

      // Map in Apr → Mar order
      return months.map((m) => monthlyData[m] || 0);
    };

    const data2324 = processData(sales2324.response_data);
    const data2425 = processData(sales2425.response_data);

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
          responsive: [
            {
              breakpoint: 768,
              options: {
                legend: {
                  position: "bottom",
                  horizontalAlign: "center",
                },
                yaxis: {
                  title: { 
                    text: productFilter === "agri" ? "Orders" : "Sales (₹)" 
                  },
                  labels: {
                    formatter: (val) => 
                      productFilter === "agri" 
                        ? val.toString() 
                        : "₹ " + (val / 1000).toFixed(0) + "K",
                  },
                },
              },
            },
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                  horizontalAlign: "center",
                },
                yaxis: {
                  title: { 
                    text: productFilter === "agri" ? "Orders" : "Sales" 
                  },
                  labels: {
                    formatter: (val) => 
                      productFilter === "agri" 
                        ? val.toString() 
                        : "₹ " + (val / 1000).toFixed(0) + "K",
                  },
                },
                xaxis: {
                  categories: months,
                  title: { text: "" },
                  labels: {
                    style: {
                      fontSize: '10px',
                    }
                  }
                },
              },
            },
          ],
        },
        colors: ["#12ab14", "#ff5722"], // green + orange
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        xaxis: {
          categories: months,
          title: { text: "Months" },
        },
        yaxis: {
          title: { 
            text: productFilter === "agri" ? "Number of Orders" : "Sales Amount (₹)" 
          },
          labels: {
            formatter: (val) => 
              productFilter === "agri" 
                ? val.toString() 
                : "₹ " + val.toLocaleString(),
          },
        },
        tooltip: {
          y: {
            formatter: (val) => 
              productFilter === "agri" 
                ? val + " orders" 
                : "₹ " + val.toLocaleString(),
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
        },
      },
    });
  }, [productFilter]);

  const getChartTitle = () => {
    switch(productFilter) {
      case "agri":
        return "Order Count Comparison (2023-24 vs 2024-25) - Agricultural Products";
      case "implement":
        return "Sales Comparison (2023-24 vs 2024-25) - Implements";
      default:
        return "Sales Comparison (2023-24 vs 2024-25) - All Products";
    }
  };

  return (
    <div className="mt-8 p-4 border border-black rounded-[8px] bg-white shadow w-full">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4 sm:gap-2">
          <h2 className="text-lg font-bold text-center sm:text-left sm:flex-1">{getChartTitle()}</h2>
          <div className="flex justify-center sm:justify-end">
            <select 
              value={productFilter} 
              onChange={(e) => setProductFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <option value="all">All Products</option>
              <option value="agri">🌾 Agricultural Products</option>
              <option value="implement">🚜 Implements</option>
            </select>
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height={400}
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default SalesComparisonChart;
