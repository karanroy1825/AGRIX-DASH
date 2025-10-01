import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography, Paper } from '@mui/material';
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

export default function ProductPreferencesChart({ onYearChange, globalSelectedYear }) {
  const [selectedYear, setSelectedYear] = React.useState(globalSelectedYear || "2023-24");
  const [chartData, setChartData] = React.useState([]);
  
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
        agriOrders: 0,
        implementOrders: 0,
      };
    });

    // Process data
    data.forEach((item) => {
      if (!item?.clusterId) return;
      
      const clusterName = cluster_id_mapping[item.clusterId];
      if (!clusterName || !clusterStats[clusterName]) return;
      
      const cluster = clusterStats[clusterName];
      
      // Process cart items for category classification
      const cart = item.cart || [];
      cart.forEach((cartItem) => {
        const productName = cartItem.productName || "";
        const lowered = productName.toLowerCase();
        
        const isAgri = agri_keywords.some(keyword => 
          lowered.includes(keyword.toLowerCase())
        );
        const isImplement = implement_keywords.some(keyword => 
          lowered.includes(keyword.toLowerCase())
        );
        
        if (isAgri) cluster.agriOrders += 1;
        if (isImplement) cluster.implementOrders += 1;
      });
    });

    // Filter clusters with data and prepare chart data
    const activeClusters = Object.values(clusterStats)
      .filter(cluster => cluster.agriOrders > 0 || cluster.implementOrders > 0);

    const categoryPreference = activeClusters.map(cluster => ({
      cluster: cluster.name,
      agri: cluster.agriOrders,
      implement: cluster.implementOrders
    }));

    setChartData(categoryPreference);
  }, [selectedYear]);

  return (
    <Paper className="p-4 h-96" style={{ position: "relative", width: "100%", minWidth: "800px" }}>
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
      <Typography variant="h6" className="mb-4 font-bold text-gray-700">
        🌾 Product Preferences - Agri vs Implements
      </Typography>
      <BarChart
        dataset={chartData}
        xAxis={[{ scaleType: 'band', dataKey: 'cluster' }]}
        series={[
          { dataKey: 'agri', label: 'Agricultural Products', color: '#16a34a', stack: 'total' },
          { dataKey: 'implement', label: 'Implements', color: '#ea580c', stack: 'total' }
        ]}
        height={300}
      />
    </Paper>
  );
}