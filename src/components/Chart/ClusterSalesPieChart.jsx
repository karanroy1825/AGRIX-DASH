import * as React from "react";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import SvgIcon from "@mui/joy/SvgIcon";

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

export default function ClusterSalesPieChart({ sales2324, sales2425, selectedYear, onYearChange, globalSelectedYear }) {
  const [chartData, setChartData] = React.useState([]);
  const [key, rerender] = React.useReducer((x) => x + 1, 0);
  const [localSelectedYear, setLocalSelectedYear] = React.useState(globalSelectedYear || selectedYear);
  
  // Update local state when global year changes
  React.useEffect(() => {
    setLocalSelectedYear(globalSelectedYear || selectedYear);
  }, [globalSelectedYear, selectedYear]);
  
  const handleYearChange = (year) => {
    setLocalSelectedYear(year);
    if (onYearChange) {
      onYearChange(year);
    }
  };

  React.useEffect(() => {
    const yearToUse = localSelectedYear === "Current" ? selectedYear : localSelectedYear;
    let data =
      yearToUse === "2023-24"
        ? sales2324?.response_data || []
        : sales2425?.response_data || [];

    console.log("📌 Raw order sample:", data[0]); // 👈 check structure

    let clusterCounts = {};

    data.forEach((order) => {
      // handle multiple naming possibilities
      const clusterId =
        order.cluster_id || order.clusterId || order.clusterID;

      if (!clusterId) return;

      const clusterName = cluster_id_mapping[clusterId] || "Unknown";
      clusterCounts[clusterName] = (clusterCounts[clusterName] || 0) + 1;
    });

    const formatted = Object.entries(clusterCounts).map(([label, value], i) => ({
      id: i,
      value,
      label,
    }));

    console.log("✅ Formatted Pie Data:", formatted);

    setChartData(formatted);
  }, [localSelectedYear, selectedYear, sales2324, sales2425]);

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
      
      <Stack spacing={2} alignItems="center">
        <h2 className="text-xl font-bold mb-4 text-center">Cluster Sales Distribution</h2>
        <PieChart
          key={key}
          series={[
            {
              data: chartData,
              arcLabel: (item) => `${item.value}`, // show order counts
            },
          ]}
          width={400}
          height={400}
          sx={{
            [`& .${pieArcLabelClasses.root}.${pieArcLabelClasses.animate}`]: {
              animationDuration: "2s",
            },
          }}
        />
      </Stack>
    </div>
  );
}
