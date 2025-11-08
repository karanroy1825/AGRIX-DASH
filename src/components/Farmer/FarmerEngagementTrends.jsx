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

const FarmerEngagementTrends = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
    monthlyDetails2324: [],
    monthlyDetails2425: []
  });
  const [metricFilter, setMetricFilter] = useState("cumulative");

  useEffect(() => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

    // Process data for a single year
    const processYearData = (yearData, year) => {
      // Track unique farmers per month and their product preferences
      const monthlyData = {};
      
      months.forEach(month => {
        monthlyData[month] = {
          farmers: new Set(),
          productRevenue: {},
          totalRevenue: 0
        };
      });

      // Track phone-to-farmerId mapping for cross-referencing
      const phoneToFarmerIds = new Map(); // Phone can map to multiple farmerIds
      const farmerIdToPhone = new Map();
      
      // First pass: Build phone-farmerId mapping
      yearData.forEach((order) => {
        const phone = order.farmerPhoneNumber;
        const farmerId = order.farmerId;
        
        if (phone && farmerId) {
          // Store all farmerIds for this phone
          if (!phoneToFarmerIds.has(phone)) {
            phoneToFarmerIds.set(phone, new Set());
          }
          phoneToFarmerIds.get(phone).add(farmerId);
          farmerIdToPhone.set(farmerId, phone);
        }
      });

      yearData.forEach((order) => {
        const date = new Date(order.orderDate);
        const month = date.toLocaleString("default", { month: "short" });
        const orderYear = date.getFullYear();
        
        // For Apr, May, Jun 2023 (which don't have farmerId), use farmerPhoneNumber
        // For all other months, use farmerId
        let farmerIdentifier;
        if (year === "2023-24" && 
            ((month === "Apr" || month === "May" || month === "Jun") && orderYear === 2023)) {
          farmerIdentifier = order.farmerPhoneNumber;
        } else {
          farmerIdentifier = order.farmerId;
        }
        
        const cart = order.cart || [];

        if (monthlyData[month] && farmerIdentifier) {
          // Add unique farmer
          monthlyData[month].farmers.add(farmerIdentifier);
          
          // Track product revenue
          cart.forEach((item) => {
            const productName = item.productName || "";
            const itemTotal = parseFloat(item.productTotal || 0);
            
            if (!monthlyData[month].productRevenue[productName]) {
              monthlyData[month].productRevenue[productName] = 0;
            }
            monthlyData[month].productRevenue[productName] += itemTotal;
            monthlyData[month].totalRevenue += itemTotal;
          });
        }
      });

      // Convert to arrays and calculate cumulative farmers
      const allFarmers = new Set(); // For cumulative count
      const farmerCounts = [];
      const monthlyDetails = [];
      
      // Process each month sequentially to maintain proper cumulative tracking
      months.forEach((month, index) => {
        const monthFarmers = monthlyData[month].farmers;
        const productRevenue = monthlyData[month].productRevenue;
        const sortedProducts = Object.entries(productRevenue)
          .sort((a, b) => b[1] - a[1]);
        
        const topProduct = sortedProducts[0] || ["No orders", 0];
        const totalRevenue = monthlyData[month].totalRevenue;
        
        // Calculate new farmers (farmers who haven't ordered before this month)
        let newFarmers = 0;
        let returningFarmers = 0;
        
        if (index === 0) {
          // First month - all farmers are new
          newFarmers = monthFarmers.size;
          returningFarmers = 0;
        } else {
          monthFarmers.forEach(farmer => {
            // Check if this farmer has ordered before
            let isReturning = false;
            
            // For 2023-24, check with deduplication logic
            if (year === "2023-24") {
              // Direct match check
              if (allFarmers.has(farmer)) {
                isReturning = true;
              }
              // If current farmer is a phone number, check if any corresponding farmerId exists in allFarmers
              else if (phoneToFarmerIds.has(farmer)) {
                const correspondingFarmerIds = phoneToFarmerIds.get(farmer);
                for (const fId of correspondingFarmerIds) {
                  if (allFarmers.has(fId)) {
                    isReturning = true;
                    break;
                  }
                }
              }
              // If current farmer is a farmerId, check if corresponding phone exists in allFarmers
              else if (farmerIdToPhone.has(farmer)) {
                const correspondingPhone = farmerIdToPhone.get(farmer);
                if (allFarmers.has(correspondingPhone)) {
                  isReturning = true;
                }
              }
            } else {
              // For other years, simple check
              if (allFarmers.has(farmer)) {
                isReturning = true;
              }
            }
            
            if (isReturning) {
              returningFarmers++;
            } else {
              newFarmers++;
            }
          });
        }
        
        // Add current month's farmers to cumulative set
        // For 2023-24, we need to handle phone/farmerId cross-referencing carefully
        monthFarmers.forEach(farmer => {
          if (year === "2023-24") {
            // Check if this identifier (phone or farmerId) is already in our set
            const alreadyCounted = allFarmers.has(farmer);
            
            if (!alreadyCounted) {
              // Check if this farmer has an alternate identifier already counted
              let hasAlternateId = false;
              
              if (phoneToFarmerIds.has(farmer)) {
                // This is a phone number - check if any of its farmerIds are already counted
                const correspondingFarmerIds = phoneToFarmerIds.get(farmer);
                for (const fId of correspondingFarmerIds) {
                  if (allFarmers.has(fId)) {
                    hasAlternateId = true;
                    break;
                  }
                }
              } else if (farmerIdToPhone.has(farmer)) {
                // This is a farmerId - check if its phone is already counted
                const correspondingPhone = farmerIdToPhone.get(farmer);
                if (allFarmers.has(correspondingPhone)) {
                  hasAlternateId = true;
                }
              }
              
              // Only add if neither this identifier nor its alternate is already counted
              if (!hasAlternateId) {
                allFarmers.add(farmer);
              }
            }
          } else {
            // For other years, simple addition
            allFarmers.add(farmer);
          }
        });
        
        // Store cumulative count
        farmerCounts.push(allFarmers.size);
        
        // Store monthly details
        monthlyDetails.push({
          topProduct: topProduct[0],
          topProductRevenue: topProduct[1],
          totalRevenue: totalRevenue,
          activeFarmers: monthlyData[month].farmers.size,
          newFarmers: newFarmers,
          returningFarmers: returningFarmers
        });
      });

      return { farmerCounts, monthlyDetails };
    };

    // Process both years
    const data2324 = processYearData(sales2324.response_data, "2023-24");
    const data2425 = processYearData(sales2425.response_data, "2024-25");

    // Prepare data based on selected metric
    let seriesData2324, seriesData2425, yAxisTitle;
    
    switch(metricFilter) {
      case "cumulative":
        seriesData2324 = data2324.farmerCounts;
        seriesData2425 = data2425.farmerCounts;
        yAxisTitle = "Cumulative Farmers";
        break;
      case "active":
        seriesData2324 = data2324.monthlyDetails.map(d => d.activeFarmers);
        seriesData2425 = data2425.monthlyDetails.map(d => d.activeFarmers);
        yAxisTitle = "Active Farmers";
        break;
      case "new":
        seriesData2324 = data2324.monthlyDetails.map(d => d.newFarmers);
        seriesData2425 = data2425.monthlyDetails.map(d => d.newFarmers);
        yAxisTitle = "New Farmers";
        break;
      case "returning":
        seriesData2324 = data2324.monthlyDetails.map(d => d.returningFarmers);
        seriesData2425 = data2425.monthlyDetails.map(d => d.returningFarmers);
        yAxisTitle = "Returning Farmers";
        break;
      default:
        seriesData2324 = data2324.farmerCounts;
        seriesData2425 = data2425.farmerCounts;
        yAxisTitle = "Cumulative Farmers";
    }

    const newChartData = {
      series: [
        {
          name: "2023-24",
          data: seriesData2324,
        },
        {
          name: "2024-25",
          data: seriesData2425,
        }
      ],
      monthlyDetails2324: data2324.monthlyDetails,
      monthlyDetails2425: data2425.monthlyDetails,
      options: {
        chart: {
          type: "line",
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
        stroke: {
          curve: "smooth",
          width: 3,
        },
        markers: {
          size: 6,
          colors: ["#fff"],
          strokeColors: ["#12ab14", "#3b82f6"],
          strokeWidth: 2,
          hover: {
            size: 8,
          },
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "right",
          fontSize: "14px",
          fontWeight: 600,
          markers: {
            width: 12,
            height: 12,
            radius: 6,
          },
          itemMargin: {
            horizontal: 10,
            vertical: 5,
          },
        },
        xaxis: {
          categories: months,
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: "500",
              colors: "#475569",
            },
          },
          title: {
            text: "Months",
            style: {
              fontSize: "14px",
              fontWeight: "600",
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
        },
        yaxis: {
          title: {
            text: yAxisTitle,
            style: {
              fontSize: "14px",
              fontWeight: "600",
              color: "#1e293b",
            },
          },
          labels: {
            formatter: (val) => Math.floor(val).toString(),
            style: {
              fontSize: "12px",
              fontWeight: "500",
              colors: "#475569",
            },
          },
        },
        colors: ["#12ab14", "#3b82f6"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.3,
            gradientToColors: ["#12ab14", "#3b82f6"],
            inverseColors: false,
            opacityFrom: 0.8,
            opacityTo: 0.3,
            stops: [0, 100],
          },
        },
        tooltip: {
          enabled: true,
          shared: true,
          intersect: false,
          theme: "light",
          style: {
            fontSize: "12px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const month = months[dataPointIndex];
            
            // Get data for both years
            const details2324 = newChartData.monthlyDetails2324[dataPointIndex];
            const details2425 = newChartData.monthlyDetails2425[dataPointIndex];
            
            const cumulative2324 = data2324.farmerCounts[dataPointIndex];
            const cumulative2425 = data2425.farmerCounts[dataPointIndex];
            
            const value2324 = series[0][dataPointIndex];
            const value2425 = series[1][dataPointIndex];
            
            // Get metric-specific data
            let metricTitle, value2324Display, value2425Display, diff;
            
            switch(metricFilter) {
              case 'cumulative':
                metricTitle = 'CUMULATIVE FARMERS';
                value2324Display = cumulative2324;
                value2425Display = cumulative2425;
                diff = cumulative2425 - cumulative2324;
                break;
              case 'active':
                metricTitle = 'ACTIVE FARMERS THIS MONTH';
                value2324Display = details2324.activeFarmers;
                value2425Display = details2425.activeFarmers;
                diff = details2425.activeFarmers - details2324.activeFarmers;
                break;
              case 'new':
                metricTitle = 'NEW FARMERS THIS MONTH';
                value2324Display = details2324.newFarmers;
                value2425Display = details2425.newFarmers;
                diff = details2425.newFarmers - details2324.newFarmers;
                break;
              case 'returning':
                metricTitle = 'RETURNING FARMERS THIS MONTH';
                value2324Display = details2324.returningFarmers;
                value2425Display = details2425.returningFarmers;
                diff = details2425.returningFarmers - details2324.returningFarmers;
                break;
              default:
                metricTitle = 'CUMULATIVE FARMERS';
                value2324Display = cumulative2324;
                value2425Display = cumulative2425;
                diff = cumulative2425 - cumulative2324;
            }
            
            const formatDiff = (diff) => {
              if (diff > 0) return `<span style="color: #10b981; font-weight: 700;">+${diff}</span>`;
              if (diff < 0) return `<span style="color: #ef4444; font-weight: 700;">${diff}</span>`;
              return `<span style="color: #64748b; font-weight: 700;">0</span>`;
            };
            
            const diffPercentage = value2324Display !== 0 ? ((diff / value2324Display) * 100).toFixed(1) : 0;
            const percentageColor = diff > 0 ? '#10b981' : diff < 0 ? '#ef4444' : '#64748b';
            
            return `
              <div style="padding: 16px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); min-width: 380px;">
                <div style="font-weight: 700; color: #1e293b; margin-bottom: 12px; font-size: 15px; text-align: center; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">
                  📅 ${month}
                </div>
                
                <div style="text-align: center; margin-bottom: 16px; padding: 8px; background: #f8fafc; border-radius: 8px;">
                  <div style="color: #64748b; font-size: 11px; font-weight: 600; margin-bottom: 4px;">${metricTitle}</div>
                  <div style="font-size: 10px; color: #94a3b8; margin-bottom: 8px;">Year-over-Year Comparison</div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: center; margin-bottom: 16px;">
                  <div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 10px; box-shadow: 0 2px 8px rgba(18, 171, 20, 0.1);">
                    <div style="font-size: 11px; color: #15803d; font-weight: 600; margin-bottom: 8px;">2023-24</div>
                    <div style="font-size: 32px; font-weight: 700; color: #12ab14; line-height: 1;">${value2324Display}</div>
                    <div style="font-size: 10px; color: #15803d; margin-top: 4px; opacity: 0.8;">farmers</div>
                  </div>
                  
                  <div style="text-align: center;">
                    <div style="font-size: 24px; color: #e2e8f0; font-weight: 300; margin-bottom: 4px;">vs</div>
                    <div style="background: ${diff > 0 ? '#dcfce7' : diff < 0 ? '#fee2e2' : '#f1f5f9'}; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; white-space: nowrap;">
                      ${formatDiff(diff)}
                    </div>
                    <div style="font-size: 10px; color: ${percentageColor}; margin-top: 4px; font-weight: 600;">
                      ${diff !== 0 ? (diff > 0 ? '↑' : '↓') + ' ' + Math.abs(diffPercentage) + '%' : '—'}
                    </div>
                  </div>
                  
                  <div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 10px; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);">
                    <div style="font-size: 11px; color: #1e40af; font-weight: 600; margin-bottom: 8px;">2024-25</div>
                    <div style="font-size: 32px; font-weight: 700; color: #3b82f6; line-height: 1;">${value2425Display}</div>
                    <div style="font-size: 10px; color: #1e40af; margin-top: 4px; opacity: 0.8;">farmers</div>
                  </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
                  <div style="padding: 10px; background: #f0fdf4; border-radius: 8px;">
                    <div style="color: #15803d; font-size: 10px; font-weight: 600; margin-bottom: 6px;">TOP PRODUCT (23-24)</div>
                    <div style="font-weight: 600; color: #12ab14; font-size: 11px; margin-bottom: 4px; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${details2324.topProduct}">${details2324.topProduct}</div>
                    <div style="font-size: 10px; color: #15803d;">Revenue: <span style="font-weight: 700;">₹${details2324.topProductRevenue.toLocaleString()}</span></div>
                  </div>
                  <div style="padding: 10px; background: #eff6ff; border-radius: 8px;">
                    <div style="color: #1e40af; font-size: 10px; font-weight: 600; margin-bottom: 6px;">TOP PRODUCT (24-25)</div>
                    <div style="font-weight: 600; color: #3b82f6; font-size: 11px; margin-bottom: 4px; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${details2425.topProduct}">${details2425.topProduct}</div>
                    <div style="font-size: 10px; color: #1e40af;">Revenue: <span style="font-weight: 700;">₹${details2425.topProductRevenue.toLocaleString()}</span></div>
                  </div>
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
        dataLabels: {
          enabled: false,
        },
        responsive: [{
          breakpoint: 640,
          options: {
            chart: {
              height: 350,
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
        }],
      },
    };
    
    setChartData(newChartData);
  }, [metricFilter]);

  return (
    <div className="w-full p-6">
      <div className="rounded-xl bg-card shadow-[0_4px_6px_-1px_hsl(var(--foreground)/0.1)] border border-border overflow-hidden transition-all duration-300 hover:shadow-[0_10px_15px_-3px_hsl(var(--foreground)/0.15)]">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-background to-secondary/30 px-6 py-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👨‍🌾</span>
              <h2 className="text-xl font-bold text-foreground">Farmer Engagement Trends</h2>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-foreground">Metric:</label>
              <select
                value={metricFilter}
                onChange={(e) => setMetricFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 cursor-pointer hover:border-primary"
              >
                <option value="cumulative">Cumulative Farmers</option>
                <option value="active">Active Farmers</option>
                <option value="new">New Farmers</option>
                <option value="returning">Returning Farmers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="p-6 bg-card">
          <div className="w-full">
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="line"
              height={450}
              width="100%"
            />
          </div>
        </div>

        {/* Footer Section */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Year-over-year comparison of cumulative farmer growth and engagement metrics (2023-24 vs 2024-25)
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerEngagementTrends;
