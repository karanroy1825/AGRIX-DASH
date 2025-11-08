import React, { useState, useEffect } from "react";
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

const clusterIdMap = {
  "63abeb3b7c99d12ad15f4b0d": "Cluster 1",
  "63abeb7a7c99d12ad15f4b33": "Cluster 2",
  "63abf4b37c99d12ad15f55a0": "Cluster 3",
  "63abf5f27c99d12ad15f56d5": "Cluster 4",
  "63abf7617c99d12ad15f57e2": "Cluster 5",
  "662a3a1d461aba3b0b9c493b": "Cluster 6",
  "676d19deb466bf2d93f71a8f": "Cluster 7",
};

const TopProductsChart = ({ selectedYear }) => {
  const [productFilter, setProductFilter] = useState("agri");
  const [metricFilter, setMetricFilter] = useState("orders"); // "orders" or "sales"
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });

  useEffect(() => {
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

    // Get data based on selected year
    let yearData = [];
    if (selectedYear === "2023-24") {
      yearData = sales2324.response_data;
    } else if (selectedYear === "2024-25") {
      yearData = sales2425.response_data;
    }
    
    // Count orders and sales per product and track clusters
    const productOrderCount = {};
    const productSalesAmount = {};
    const productClusterCount = {}; // Track which cluster ordered which product most
    const productClusterSales = {}; // Track sales amount per cluster for each product
    
    yearData.forEach((order) => {
      const cart = order.cart || [];
      const clusterId = order.clusterId || "Unknown";
      
      cart.forEach((item) => {
        const productName = item.productName || "";
        const itemTotal = parseFloat(item.productTotal || 0);
        
        // Filter based on selected category
        let includeProduct = false;
        if (productFilter === "agri" && isAgriProduct(productName)) {
          includeProduct = true;
        } else if (productFilter === "implement" && isImplementProduct(productName)) {
          includeProduct = true;
        }
        
        if (includeProduct) {
          // Initialize tracking objects
          if (!productOrderCount[productName]) {
            productOrderCount[productName] = 0;
            productSalesAmount[productName] = 0;
            productClusterCount[productName] = {};
            productClusterSales[productName] = {};
          }
          
          // Count total orders for this product
          productOrderCount[productName] += 1;
          
          // Sum total sales for this product
          productSalesAmount[productName] += itemTotal;
          
          // Count orders per cluster for this product
          if (!productClusterCount[productName][clusterId]) {
            productClusterCount[productName][clusterId] = 0;
            productClusterSales[productName][clusterId] = 0;
          }
          productClusterCount[productName][clusterId] += 1;
          productClusterSales[productName][clusterId] += itemTotal;
        }
      });
    });

    // Convert to array and sort based on selected metric
    const sortedProducts = metricFilter === "orders"
      ? Object.entries(productOrderCount).sort((a, b) => b[1] - a[1]).slice(0, 10)
      : Object.entries(productSalesAmount).sort((a, b) => b[1] - a[1]).slice(0, 10);

    const productNames = sortedProducts.map(([name]) => name);
    const metricValues = metricFilter === "orders"
      ? sortedProducts.map(([name]) => productOrderCount[name])
      : sortedProducts.map(([name]) => productSalesAmount[name]);
    
    // Get the top cluster for each product based on selected metric
    const topClusters = sortedProducts.map(([productName]) => {
      if (metricFilter === "orders") {
        const clusterCounts = productClusterCount[productName];
        const topCluster = Object.entries(clusterCounts)
          .sort((a, b) => b[1] - a[1])[0];
        return {
          clusterId: topCluster[0],
          value: topCluster[1],
          totalOrders: productOrderCount[productName],
          totalSales: productSalesAmount[productName]
        };
      } else {
        const clusterSales = productClusterSales[productName];
        const topCluster = Object.entries(clusterSales)
          .sort((a, b) => b[1] - a[1])[0];
        return {
          clusterId: topCluster[0],
          value: topCluster[1],
          totalOrders: productOrderCount[productName],
          totalSales: productSalesAmount[productName]
        };
      }
    });

    const chartColor = productFilter === "agri" ? "#12ab14" : "#ff5722";

    setChartData({
      series: [{
        name: metricFilter === "orders" ? "Number of Orders" : "Sales Amount",
        data: metricValues,
      }],
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
            }
          },
          fontFamily: "Inter, system-ui, sans-serif",
          animations: {
            enabled: true,
            speed: 800,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "60%",
            borderRadius: 8,
            borderRadiusApplication: "end",
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -25,
          style: {
            fontSize: "12px",
            fontWeight: "600",
            colors: ["#1e293b"],
          },
          background: {
            enabled: true,
            foreColor: "#fff",
            padding: 6,
            borderRadius: 4,
            borderWidth: 0,
            opacity: 0.9,
          },
        },
        xaxis: {
          categories: productNames,
          labels: {
            rotate: -45,
            rotateAlways: true,
            style: {
              fontSize: "11px",
              fontWeight: "500",
              colors: "#475569",
            },
            trim: true,
            maxHeight: 120,
          },
          title: {
            text: "Products",
            style: {
              fontSize: "14px",
              fontWeight: "600",
              color: "#1e293b",
            },
            offsetY: 95,
          },
          axisBorder: {
            show: true,
            color: "#e2e8f0",
          },
          axisTicks: {
            show: true,
            color: "#e2e8f0",
          },
        },
        yaxis: {
          title: {
            text: metricFilter === "orders" ? "Number of Orders" : "Sales Amount (₹)",
            style: {
              fontSize: "14px",
              fontWeight: "600",
              color: "#1e293b",
            },
          },
          labels: {
            formatter: (val) => {
              if (metricFilter === "orders") {
                return Math.floor(val).toString();
              } else {
                return "₹ " + (val / 1000).toFixed(0) + "K";
              }
            },
            style: {
              fontSize: "12px",
              fontWeight: "500",
              colors: "#475569",
            },
          },
        },
        colors: [chartColor],
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.5,
            gradientToColors: [chartColor],
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 0.8,
            stops: [0, 100],
          },
        },
        tooltip: {
          enabled: true,
          theme: "light",
          style: {
            fontSize: "12px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const productName = productNames[dataPointIndex];
            const metricValue = series[seriesIndex][dataPointIndex];
            const topCluster = topClusters[dataPointIndex];
            const clusterName = clusterIdMap[topCluster.clusterId] || `Cluster ${topCluster.clusterId}`;
            
            return `
              <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <div style="font-weight: 600; color: #1e293b; margin-bottom: 8px; font-size: 13px;">
                  ${productName}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                  <span style="color: #64748b; font-size: 12px;">Total Orders:</span>
                  <span style="font-weight: 600; color: #64748b; font-size: 13px;">${topCluster.totalOrders}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                  <span style="color: #64748b; font-size: 12px;">Total Sales:</span>
                  <span style="font-weight: 600; color: #64748b; font-size: 13px;">₹${topCluster.totalSales.toLocaleString()}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
                  <span style="color: #64748b; font-size: 11px;">Top Cluster:</span>
                  <span style="font-weight: 600; color: #1e293b; font-size: 12px;">${clusterName}</span>
                  <span style="color: #94a3b8; font-size: 11px;">(${metricFilter === "orders" ? topCluster.value + " orders" : "₹" + topCluster.value.toLocaleString()})</span>
                </div>
              </div>
            `;
          },
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
        responsive: [{
          breakpoint: 640,
          options: {
            chart: {
              height: 400,
            },
            plotOptions: {
              bar: {
                columnWidth: "70%",
              },
            },
            xaxis: {
              labels: {
                style: {
                  fontSize: "9px",
                },
              },
            },
            dataLabels: {
              enabled: false,
            },
          },
        }],
      },
    });
  }, [productFilter, selectedYear, metricFilter]);

  const getChartTitle = () => {
    const metricText = metricFilter === "orders" ? "Order Count" : "Sales Amount";
    switch(productFilter) {
      case "agri":
        return `Top 10 Agricultural Products by ${metricText}`;
      case "implement":
        return `Top 10 Implement Products by ${metricText}`;
      default:
        return `Top 10 Products by ${metricText}`;
    }
  };

  const getChartIcon = () => {
    return productFilter === "agri" ? "🌾" : "🚜";
  };

  return (
    <div className="w-full p-6">
      <div className="rounded-xl bg-card shadow-[0_4px_6px_-1px_hsl(var(--foreground)/0.1)] border border-border overflow-hidden transition-all duration-300 hover:shadow-[0_10px_15px_-3px_hsl(var(--foreground)/0.15)]">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-background to-secondary/30 px-6 py-5 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getChartIcon()}</span>
              <h2 className="text-xl font-bold text-foreground">{getChartTitle()}</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Metric Filter */}
              <div className="relative">
                <select 
                  value={metricFilter} 
                  onChange={(e) => setMetricFilter(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 border-2 border-border rounded-lg text-sm font-medium text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 cursor-pointer hover:border-primary/50 w-full sm:w-auto"
                >
                  <option value="orders">📊 By Orders</option>
                  <option value="sales">💰 By Sales</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Product Filter */}
              <div className="relative">
                <select 
                  value={productFilter} 
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 border-2 border-border rounded-lg text-sm font-medium text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 cursor-pointer hover:border-primary/50 w-full sm:w-auto"
                >
                  <option value="agri">🌾 Agricultural Products</option>
                  <option value="implement">🚜 Implement Products</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
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

        {/* Footer Section */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Data from sales year {selectedYear}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopProductsChart;
