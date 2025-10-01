import * as React from 'react';
import { Card, CardContent, Typography, Grid, Paper } from '@mui/material';
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import SvgIcon from "@mui/joy/SvgIcon";
import sales2324 from "../../data/sales_2324.json";
import sales2425 from "../../data/sales_2425.json";

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

export default function ClusterLeaderboardChart({ onYearChange, globalSelectedYear }) {
  const [selectedYear, setSelectedYear] = React.useState(globalSelectedYear || "2023-24");
  const [topClusters, setTopClusters] = React.useState([]);
  
  // Update local state when global year changes
  React.useEffect(() => {
    setSelectedYear(globalSelectedYear || "2023-24");
  }, [globalSelectedYear]);
  
  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (onYearChange) {
      onYearChange(year);
    }
  };

  React.useEffect(() => {
    let data = selectedYear === "2023-24" 
      ? sales2324.response_data 
      : sales2425.response_data;

    if (!data || !Array.isArray(data)) return;

    // Initialize counters
    const clusterStats = {};
    Object.entries(cluster_id_mapping).forEach(([id, name]) => {
      clusterStats[name] = {
        id,
        name,
        totalOrders: 0,
        totalSales: 0,
        avgOrderValue: 0
      };
    });

    // Process data
    data.forEach((item) => {
      if (!item?.clusterId) return;
      
      const clusterName = cluster_id_mapping[item.clusterId];
      if (!clusterName || !clusterStats[clusterName]) return;
      
      const cluster = clusterStats[clusterName];
      cluster.totalOrders += 1;
      cluster.totalSales += parseFloat(item.grandTotal || 0);
    });

    // Calculate average order values
    Object.values(clusterStats).forEach(cluster => {
      cluster.avgOrderValue = cluster.totalOrders > 0 
        ? cluster.totalSales / cluster.totalOrders 
        : 0;
    });

    // Filter clusters with data and get top 5
    const activeClusters = Object.values(clusterStats)
      .filter(cluster => cluster.totalOrders > 0)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);

    setTopClusters(activeClusters);
  }, [selectedYear]);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 1:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l1.69-1.32c.15-.12.19-.35.09-.53l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L14.4 4.5c-.04-.2-.2-.35-.4-.35h-3.2c-.2 0-.36.15-.4.35l-.3 2.12c-.49.2-.93.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.41.09.53L6.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97L4.87 14.3c-.15.12-.19.35-.09.53l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.35.4.35h3.2c.2 0 .37-.15.4-.35l.3-2.12c.49-.2.93-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.41-.09-.53L17.43 13z"/>
          </svg>
        );
      case 2:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l1.69-1.32c.15-.12.19-.35.09-.53l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L14.4 4.5c-.04-.2-.2-.35-.4-.35h-3.2c-.2 0-.36.15-.4.35l-.3 2.12c-.49.2-.93.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.41.09.53L6.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97L4.87 14.3c-.15.12-.19.35-.09.53l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.35.4.35h3.2c.2 0 .37-.15.4-.35l.3-2.12c.49-.2.93-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.41-.09-.53L17.43 13z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
          </svg>
        );
    }
  };

  const getCardStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg hover:shadow-2xl";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-lg hover:shadow-2xl";
      case 2:
        return "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg hover:shadow-2xl";
      default:
        return "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg hover:shadow-2xl";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <Paper className="shadow-lg border-0 rounded-lg" style={{ position: "relative" }}>
        {/* Three Dots Menu */}
        <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 10 }}>
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

        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <div>
              <Typography variant="h4" className="font-bold text-gray-800">
                🏆 Cluster Performance Leaderboard
              </Typography>
              <Typography variant="body1" className="text-gray-600 mt-1">
                Strategic focus areas ranked by total sales performance
              </Typography>
            </div>
          </div>

          <Grid container spacing={3}>
            {topClusters.map((cluster, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={cluster.id}>
                <Card 
                  className={`${getCardStyle(index)} transition-all duration-300 hover:scale-105 border-0 overflow-hidden transform`}
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      {getRankIcon(index)}
                    </div>
                    
                    <Typography variant="h2" className="font-bold mb-3">
                      #{index + 1}
                    </Typography>
                    
                    <Typography variant="h6" className="font-semibold mb-4 opacity-95">
                      {cluster.name}
                    </Typography>
                    
                    <div className="space-y-3 opacity-90">
                      <Typography variant="h5" className="font-bold">
                        ₹{Math.round(cluster.totalSales).toLocaleString('en-IN')}
                      </Typography>
                      
                      <Typography variant="body2" className="opacity-80">
                        {cluster.totalOrders} orders
                      </Typography>
                      
                      <div className="border-t border-white/20 pt-3">
                        <Typography variant="caption" className="opacity-75 text-xs">
                          AOV: ₹{Math.round(cluster.avgOrderValue).toLocaleString('en-IN')}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {topClusters.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <Typography variant="body1">
                No performance data available for the selected period.
              </Typography>
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
}