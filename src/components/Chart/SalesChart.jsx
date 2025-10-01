import React from "react";
import ReactApexChart from "react-apexcharts";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import SvgIcon from "@mui/joy/SvgIcon";

const SalesChart = ({ dates, sales, onYearChange, globalSelectedYear }) => {
  const [selectedYear, setSelectedYear] = React.useState(globalSelectedYear || "Current");
  
  // Update local state when global year changes
  React.useEffect(() => {
    setSelectedYear(globalSelectedYear || "Current");
  }, [globalSelectedYear]);
  
  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (onYearChange) {
      onYearChange(year);
    }
  };

  const state = {
    series: [
      {
        name: "Monthly Sales",
        data: sales,
      },
    ],
    options: {
      chart: {
        type: "area",
        stacked: false,
        height: 350,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return (val / 1000000).toFixed(2);
          },
        },
        title: {
          text: "Sales Amount (in Ruppees)",
        },
      },
      xaxis: {
        categories: dates, // Dates formatted as "Apr 23", "May 23"
        title: {
          text: "Months",
        },
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return "₹ " + val.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Three Dots Menu */}
      <div style={{ position: "absolute", top: "8px", right: "8px", zIndex: 10 }}>
        <Dropdown>
          <MenuButton
            sx={{
              backgroundColor: "transparent",
              color: "#333",
              border: "none",
              minHeight: "auto",
              padding: "2px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.1)",
              },
            }}
          >
            <SvgIcon sx={{ color: "#333", fontSize: "18px" }}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </SvgIcon>
          </MenuButton>
          <Menu
            sx={{
              backgroundColor: "#ffffff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <MenuItem 
              onClick={() => handleYearChange("Current")}
              sx={{ color: "#333", fontSize: "14px" }}
            >
              Current Year
            </MenuItem>
            <MenuItem 
              onClick={() => handleYearChange("2023-24")}
              sx={{ color: "#333", fontSize: "14px" }}
            >
              2023-24
            </MenuItem>
            <MenuItem 
              onClick={() => handleYearChange("2024-25")}
              sx={{ color: "#333", fontSize: "14px" }}
            >
              2024-25
            </MenuItem>
          </Menu>
        </Dropdown>
      </div>
      
      <h2 className="text-xl font-bold mb-4 text-center">Monthly Sales Trend</h2>
      <div id="chart" style={{width: "100%", margin: "0 auto"}}>
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="area"
          height={400}
          width="100%"
        />
      </div>
    </div>
  );
};

export default SalesChart;
