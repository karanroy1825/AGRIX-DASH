import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import twoyearData from "../../data/twoyear245.json";
import sales2324Data from "../../data/sales_2324.json";

// Cluster ID mapping
const cluster_id_mapping = {
  "63abeb3b7c99d12ad15f4b0d": "Cluster 1",
  "63abeb7a7c99d12ad15f4b33": "Cluster 2",
  "63abf4b37c99d12ad15f55a0": "Cluster 3",
  "63abf5f27c99d12ad15f56d5": "Cluster 4",
  "63abf7617c99d12ad15f57e2": "Cluster 5",
  "662a3a1d461aba3b0b9c493b": "Cluster 6",
  "676d19deb466bf2d93f71a8f": "Cluster 7",
};

// Product keywords
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

const SeasonalSalesChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });
  const [hoveredSeason, setHoveredSeason] = useState(null);
  const [seasonData, setSeasonData] = useState(null);
  const [productFilter, setProductFilter] = useState("overall"); // overall, agri, implement

  useEffect(() => {
    // Define seasons with their month ranges - GROUPED BY TYPE for easy comparison
    const seasons = [
      { name: "Zaid 23", startMonth: 5, endMonth: 6, year: 2023, type: "Zaid", color: "#3b82f6" },
      { name: "Zaid 24", startMonth: 5, endMonth: 6, year: 2024, type: "Zaid", color: "#60a5fa" },
      { name: "Kharif 23", startMonth: 7, endMonth: 12, year: 2023, type: "Kharif", color: "#10b981" },
      { name: "Kharif 24", startMonth: 7, endMonth: 12, year: 2024, type: "Kharif", color: "#34d399" },
      { name: "Rabi 24", startMonth: 1, endMonth: 4, year: 2024, type: "Rabi", color: "#f59e0b" },
      { name: "Rabi 25", startMonth: 1, endMonth: 4, year: 2025, type: "Rabi", color: "#fbbf24" },
    ];

    // Get orders from both data sources
    const twoyearOrders = Array.isArray(twoyearData) ? twoyearData : [];
    const sales2324Orders = sales2324Data?.response_data || [];
    
    // Combine all orders
    const allOrders = [...sales2324Orders, ...twoyearOrders];

    console.log('Data loaded - Sales 2324:', sales2324Orders.length, 'Twoyear:', twoyearOrders.length, 'Total:', allOrders.length);

    // Helper function to get orders for a season
    const getSeasonOrders = (season) => {
      return allOrders.filter(order => {
        const orderDate = new Date(order.orderDate);
        const orderMonth = orderDate.getMonth() + 1;
        const orderYear = orderDate.getFullYear();
        
        if (season.startMonth <= season.endMonth) {
          return orderYear === season.year && 
                 orderMonth >= season.startMonth && 
                 orderMonth <= season.endMonth;
        }
        return false;
      });
    };

    // Helper function to check if product is agri or implement
    const isAgriProduct = (productName) => {
      const lowered = productName.toLowerCase();
      return agri_keywords.some(keyword => lowered.includes(keyword.toLowerCase()));
    };

    const isImplementProduct = (productName) => {
      const lowered = productName.toLowerCase();
      return implement_keywords.some(keyword => lowered.includes(keyword.toLowerCase()));
    };

    // Helper function to filter orders by product type
    const filterOrdersByProductType = (orders, filterType) => {
      if (filterType === "overall") return orders;
      
      return orders.filter(order => {
        if (!order.cart || !Array.isArray(order.cart)) return false;
        
        return order.cart.some(item => {
          const productName = item.productName || "";
          if (filterType === "agri") {
            return isAgriProduct(productName);
          } else if (filterType === "implement") {
            return isImplementProduct(productName);
          }
          return false;
        });
      });
    };

    // Helper function to calculate filtered sales
    const calculateFilteredSales = (order, filterType) => {
      if (filterType === "overall") {
        return parseFloat(order.grandTotal || 0);
      }
      
      let filteredTotal = 0;
      if (order.cart && Array.isArray(order.cart)) {
        order.cart.forEach(item => {
          const productName = item.productName || "";
          const itemPrice = parseFloat(item.price || 0) * parseInt(item.quantity || 0);
          
          if (filterType === "agri" && isAgriProduct(productName)) {
            filteredTotal += itemPrice;
          } else if (filterType === "implement" && isImplementProduct(productName)) {
            filteredTotal += itemPrice;
          }
        });
      }
      
      return filteredTotal;
    };

    // Helper function to get top cluster for a season
    const getTopCluster = (seasonOrders, filterType) => {
      const clusterSales = {};
      seasonOrders.forEach(order => {
        const clusterId = order.clusterId || 'Unknown';
        if (!clusterSales[clusterId]) {
          clusterSales[clusterId] = 0;
        }
        clusterSales[clusterId] += calculateFilteredSales(order, filterType);
      });
      
      const sorted = Object.entries(clusterSales).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) {
        const topClusterId = sorted[0][0];
        const clusterName = cluster_id_mapping[topClusterId] || topClusterId;
        return { id: clusterName, sales: sorted[0][1] };
      }
      return { id: 'N/A', sales: 0 };
    };

    // Calculate sales for each season
    const seasonalSales = seasons.map(season => {
      let totalSales = 0;

      allOrders.forEach(order => {
        const orderDate = new Date(order.orderDate);
        const orderMonth = orderDate.getMonth() + 1; // 1-12
        const orderYear = orderDate.getFullYear();

        // Check if order falls in this season
        let isInSeason = false;

        if (season.startMonth <= season.endMonth) {
          // Same year season (e.g., Zaid: May-June)
          isInSeason = orderYear === season.year && 
                      orderMonth >= season.startMonth && 
                      orderMonth <= season.endMonth;
        } else {
          // Cross-year season (if needed in future)
          isInSeason = (orderYear === season.year && orderMonth >= season.startMonth) ||
                      (orderYear === season.year + 1 && orderMonth <= season.endMonth);
        }

        if (isInSeason) {
          totalSales += calculateFilteredSales(order, productFilter);
        }
      });

      return totalSales;
    });

    // Get season metadata including top cluster
    const seasonMetadata = seasons.map((season, index) => {
      const seasonOrders = getSeasonOrders(season);
      const filteredOrders = filterOrdersByProductType(seasonOrders, productFilter);
      const topCluster = getTopCluster(filteredOrders, productFilter);

      // Store season data for hover display
      setSeasonData(prev => ({
        ...prev,
        [season.name]: {
          sales: seasonalSales[index],
          topCluster: topCluster.id,
          clusterSales: topCluster.sales,
          orderCount: filteredOrders.length,
          year: season.yearLabel,
          type: season.type,
          color: season.color
        }
      }));

      return {
        topCluster: topCluster.id,
        orderCount: filteredOrders.length
      };
    });

    console.log('Seasonal Sales:', seasons.map((s, i) => `${s.name}: ₹${seasonalSales[i].toLocaleString()}`));

    // Group data by season type for better visual comparison
    const zaidData = [seasonalSales[0], seasonalSales[1]]; // Zaid 23, Zaid 24
    const kharifData = [seasonalSales[2], seasonalSales[3]]; // Kharif 23, Kharif 24
    const rabiData = [seasonalSales[4], seasonalSales[5]]; // Rabi 24, Rabi 25

    // Store season data for info box
    setSeasonData({
      seasons,
      getSeasonOrders,
      getTopCluster,
      filterOrdersByProductType,
      salesData: [
        { type: "Zaid", sales1: zaidData[0], sales2: zaidData[1] },
        { type: "Kharif", sales1: kharifData[0], sales2: kharifData[1] },
        { type: "Rabi", sales1: rabiData[0], sales2: rabiData[1] },
      ]
    });

    setChartData({
      series: [
        {
          name: "2023-24",
          data: [zaidData[0], kharifData[0], rabiData[0]],
          color: "#3b82f6",
        },
        {
          name: "2024-25",
          data: [zaidData[1], kharifData[1], rabiData[1]],
          color: "#10b981",
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 450,
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
            },
          },
          fontFamily: "Inter, system-ui, sans-serif",
          animations: {
            enabled: true,
            speed: 800,
          },
          events: {
            dataPointMouseEnter: function(event, chartContext, config) {
              setHoveredSeason(config.dataPointIndex);
            },
            dataPointMouseLeave: function(event, chartContext, config) {
              setHoveredSeason(null);
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "65%",
            borderRadius: 6,
            dataLabels: {
              position: "top",
            },
            distributed: false,
          },
        },
        stroke: {
          show: true,
          width: 4,
          colors: ["transparent"],
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `₹${(val / 100000).toFixed(2)}L`,
          offsetY: -25,
          style: {
            fontSize: "11px",
            fontWeight: "600",
            colors: ["#1e293b"],
          },
        },
        xaxis: {
          categories: ["Zaid", "Kharif", "Rabi"],
          labels: {
            style: {
              fontSize: "14px",
              fontWeight: "700",
              colors: "#475569",
            },
          },
          title: {
            text: "Season Types",
            style: {
              fontSize: "14px",
              fontWeight: "700",
              color: "#1e293b",
            },
          },
          axisBorder: {
            show: true,
            color: "#e2e8f0",
          },
          axisTicks: {
            show: true,
            color: "#e2e8f0",
          },
          crosshairs: {
            show: true,
            width: "100%",
            fill: {
              type: "solid",
              color: "#f1f5f9",
            },
          },
        },
        yaxis: {
          title: {
            text: "Total Sales (₹)",
            style: {
              fontSize: "14px",
              fontWeight: "700",
              color: "#1e293b",
            },
          },
          labels: {
            formatter: (val) => `₹${(val / 100000).toFixed(1)}L`,
            style: {
              fontSize: "12px",
              fontWeight: "500",
              colors: "#475569",
            },
          },
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "center",
          fontSize: "13px",
          fontWeight: 600,
          labels: {
            colors: "#1e293b",
          },
          markers: {
            width: 12,
            height: 12,
            radius: 4,
          },
        },
        colors: ["#3b82f6", "#10b981"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.4,
            gradientToColors: ["#059669"],
            inverseColors: false,
            opacityFrom: 0.95,
            opacityTo: 0.85,
            stops: [0, 100],
          },
        },
        tooltip: {
          enabled: false,
        },
        grid: {
          borderColor: "#e2e8f0",
          strokeDashArray: 4,
          padding: {
            top: 0,
            right: 20,
            bottom: 0,
            left: 10,
          },
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        responsive: [
          {
            breakpoint: 640,
            options: {
              chart: {
                height: 350,
              },
              plotOptions: {
                bar: {
                  columnWidth: "80%",
                },
              },
              xaxis: {
                labels: {
                  style: {
                    fontSize: "10px",
                  },
                },
              },
              yaxis: {
                labels: {
                  style: {
                    fontSize: "10px",
                  },
                },
              },
            },
          },
        ],
      },
    });
  }, [productFilter]);

  return (
    <div className="w-full p-6">
      <div className="rounded-xl bg-card shadow-[0_4px_6px_-1px_hsl(var(--foreground)/0.1)] border border-border overflow-hidden transition-all duration-300 hover:shadow-[0_10px_15px_-3px_hsl(var(--foreground)/0.15)]">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-background to-secondary/30 px-6 py-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌾</span>
              <div>
                <h2 className="text-xl font-bold text-foreground">Seasonal Sales Trends</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Sales performance across different agricultural seasons (May 2023 - Apr 2025)
                </p>
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setProductFilter("overall")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  productFilter === "overall"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Overall
              </button>
              <button
                onClick={() => setProductFilter("agri")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  productFilter === "agri"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                🌾 Agri Products
              </button>
              <button
                onClick={() => setProductFilter("implement")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  productFilter === "implement"
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                🚜 Implements
              </button>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="p-6 bg-card">
          <div className="w-full">
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={450}
              width="100%"
            />
          </div>
        </div>

        {/* Legend Section */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-muted-foreground">
                <strong>Zaid:</strong> May-June (Summer crops)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">
                <strong>Kharif:</strong> July-December (Monsoon crops)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-muted-foreground">
                <strong>Rabi:</strong> January-April (Winter crops)
              </span>
            </div>
          </div>
        </div>

        {/* Season Comparison Info Box */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-green-50 border-t border-border min-h-[200px]">
          {hoveredSeason !== null && seasonData ? (
            (() => {
              const seasonTypes = ["Zaid", "Kharif", "Rabi"];
              const seasonType = seasonTypes[hoveredSeason];
              const year1Index = hoveredSeason * 2;
              const year2Index = hoveredSeason * 2 + 1;
              
              const season1 = seasonData.seasons[year1Index];
              const season2 = seasonData.seasons[year2Index];
              
              const sales1 = seasonData.salesData[hoveredSeason].sales1;
              const sales2 = seasonData.salesData[hoveredSeason].sales2;
              
              const orders1 = seasonData.getSeasonOrders(season1);
              const orders2 = seasonData.getSeasonOrders(season2);
              
              const filteredOrders1 = seasonData.filterOrdersByProductType(orders1, productFilter);
              const filteredOrders2 = seasonData.filterOrdersByProductType(orders2, productFilter);
              
              const topCluster1 = seasonData.getTopCluster(filteredOrders1, productFilter);
              const topCluster2 = seasonData.getTopCluster(filteredOrders2, productFilter);
              
              const salesDiff = sales2 - sales1;
              const percentChange = sales1 > 0 ? ((salesDiff / sales1) * 100) : 0;
              const isPositive = salesDiff >= 0;
              
              // Get filter type label
              const filterLabel = productFilter === "overall" ? "Overall" : 
                                 productFilter === "agri" ? "Agri Products" : "Implements";
              
              return (
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-2xl">🌾</span>
                    {seasonType} Season Comparison
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Filter: <span className="font-semibold">{filterLabel}</span>
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Season 1 Card */}
                    <div className="bg-white rounded-lg p-4 shadow-md border-2 border-blue-200">
                      <div className="text-center font-bold text-blue-600 mb-3 text-base">{season1.name}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sales:</span>
                          <span className="font-bold text-blue-700">₹{(sales1/100000).toFixed(2)}L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Orders:</span>
                          <span className="font-semibold">{filteredOrders1.length.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Top Cluster:</span>
                          <span className="font-bold text-orange-600">{topCluster1.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Growth Card */}
                    <div className={`rounded-lg p-4 shadow-md border-2 flex flex-col items-center justify-center ${isPositive ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                      <div className="text-sm text-gray-600 mb-2">Year-over-Year Growth</div>
                      <div className={`text-3xl font-bold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                        {isPositive ? '📈' : '📉'} {isPositive ? '+' : ''}{percentChange.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {isPositive ? '+' : ''}₹{(salesDiff/100000).toFixed(2)}L
                      </div>
                    </div>

                    {/* Season 2 Card */}
                    <div className="bg-white rounded-lg p-4 shadow-md border-2 border-green-200">
                      <div className="text-center font-bold text-green-600 mb-3 text-base">{season2.name}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sales:</span>
                          <span className="font-bold text-green-700">₹{(sales2/100000).toFixed(2)}L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Orders:</span>
                          <span className="font-semibold">{filteredOrders2.length.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Top Cluster:</span>
                          <span className="font-bold text-orange-600">{topCluster2.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-gray-400">
              <p className="text-sm mb-2">Hover over any season group to see detailed comparison</p>
              <p className="text-xs">
                Current Filter: <span className="font-semibold">
                  {productFilter === "overall" ? "Overall" : 
                   productFilter === "agri" ? "Agri Products" : "Implements"}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeasonalSalesChart;
