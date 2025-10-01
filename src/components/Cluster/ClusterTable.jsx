import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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

export default function ClusterTable({ selectedYear, onYearChange, globalSelectedYear }) {
  const [clusterData, setClusterData] = React.useState([]);
  const [localSelectedYear, setLocalSelectedYear] = React.useState(globalSelectedYear || selectedYear || "2023-24");
  
  // Update local state when global year changes
  React.useEffect(() => {
    setLocalSelectedYear(globalSelectedYear || selectedYear || "2023-24");
  }, [globalSelectedYear, selectedYear]);
  
  const handleYearChange = (year) => {
    setLocalSelectedYear(year);
    if (onYearChange) {
      onYearChange(year);
    }
  };

  React.useEffect(() => {
    // Use localSelectedYear for data processing
    let data = localSelectedYear === "2023-24" 
      ? sales2324.response_data 
      : sales2425.response_data;

    console.log("🔍 Raw data length:", data?.length);
    console.log("📊 Sample order:", data?.[0]);

    if (!data || !Array.isArray(data)) {
      console.error("❌ Data is not an array:", data);
      return;
    }

    // Initialize counters exactly like Python code
    const cluster_order_count = {};
    const cluster_total_sales = {};
    const agri_order_count = {};
    const implement_order_count = {};
    const cluster_ids_present = {};
    const agri_product_counter = {};
    const implement_product_counter = {};

    // Initialize all clusters
    Object.entries(cluster_id_mapping).forEach(([id, name]) => {
      cluster_order_count[name] = 0;
      cluster_total_sales[name] = 0;
      agri_order_count[name] = 0;
      implement_order_count[name] = 0;
      cluster_ids_present[name] = id;
      agri_product_counter[name] = {};
      implement_product_counter[name] = {};
    });

    // Process each item exactly like Python
    data.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      
      const clusterId = item.clusterId;
      const grandTotal = item.grandTotal || 0;
      
      console.log("🔍 Processing order:", { clusterId, grandTotal, hasCart: !!item.cart });
      
      if (clusterId) {
        const cluster_name = cluster_id_mapping[clusterId];
        if (!cluster_name) {
          console.log("❌ Unknown cluster:", clusterId);
          return;
        }
        
        console.log("✅ Found cluster:", cluster_name, "for ID:", clusterId);
        
        // Increment order count
        cluster_order_count[cluster_name] += 1;
        
        // Add to total sales
        try {
          const salesAmount = parseFloat(grandTotal);
          cluster_total_sales[cluster_name] += salesAmount;
          console.log("💰 Added sales:", salesAmount, "to", cluster_name);
        } catch (e) {
          console.log("❌ Invalid grandTotal:", grandTotal);
        }

        // Process cart items
        const cart = item.cart || [];
        console.log("🛒 Cart items:", cart.length);
        
        cart.forEach((cart_item) => {
          const productName = cart_item.productName || "";
          if (!productName) return;
          
          console.log("🔍 Processing product:", productName);
          
          const lowered_product = productName.toLowerCase();
          
          // Check if it's an agri product
          const isAgri = agri_keywords.some(keyword => 
            lowered_product.includes(keyword.toLowerCase())
          );
          
          // Check if it's an implement product  
          const isImplement = implement_keywords.some(keyword => 
            lowered_product.includes(keyword.toLowerCase())
          );
          
          if (isAgri) {
            agri_order_count[cluster_name] += 1;
            if (!agri_product_counter[cluster_name][productName]) {
              agri_product_counter[cluster_name][productName] = 0;
            }
            agri_product_counter[cluster_name][productName] += 1;
            console.log("🌾 Agri product found:", productName);
          } else if (isImplement) {
            implement_order_count[cluster_name] += 1;
            if (!implement_product_counter[cluster_name][productName]) {
              implement_product_counter[cluster_name][productName] = 0;
            }
            implement_product_counter[cluster_name][productName] += 1;
            console.log("🚜 Implement product found:", productName);
          }
        });
      }
    });

    // Create DataFrame equivalent - convert to table rows
    const tableData = Object.keys(cluster_order_count)
      .filter(cluster_name => cluster_order_count[cluster_name] > 0) // Only clusters with orders
      .map(cluster_name => {
        // Get top 3 agri products
        const agriProducts = Object.entries(agri_product_counter[cluster_name] || {})
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([prod, count]) => `${prod.split('/')[0].trim()} (${count})`)
          .join(', ') || 'N/A';
        
        // Get top 3 implement products  
        const implementProducts = Object.entries(implement_product_counter[cluster_name] || {})
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([prod, count]) => `${prod.split('/')[0].trim()} (${count})`)
          .join(', ') || 'N/A';
        
        return {
          clusterName: cluster_name,
          clusterId: cluster_ids_present[cluster_name],
          totalOrders: cluster_order_count[cluster_name],
          totalSales: cluster_total_sales[cluster_name].toFixed(2),
          agriOrderCount: agri_order_count[cluster_name],
          implementOrderCount: implement_order_count[cluster_name],
          top3Agri: agriProducts,
          top3Implement: implementProducts
        };
      })
      .sort((a, b) => parseFloat(b.totalSales) - parseFloat(a.totalSales)); // Sort by total sales desc

    console.log("📊 Final table data:", tableData);
    setClusterData(tableData);
  }, [localSelectedYear]);

  return (
    <div className="p-6" style={{ position: "relative" }}>
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
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cluster Analytics</h2>
      <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="cluster analytics table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Cluster Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Cluster ID</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Total Orders</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Total Sales (₹)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Agri Orders</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Implement Orders</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '200px' }}>Top 3 Agri Products</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '200px' }}>Top 3 Implement Products</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clusterData.map((row) => (
              <TableRow
                key={row.clusterId}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: '#f9f9f9' }
                }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                  {row.clusterName}
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#666' }}>
                  {row.clusterId}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                  {row.totalOrders}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'medium', color: '#2e7d32' }}>
                  ₹{row.totalSales}
                </TableCell>
                <TableCell align="right" sx={{ color: '#1976d2' }}>
                  {row.agriOrderCount}
                </TableCell>
                <TableCell align="right" sx={{ color: '#ed6c02' }}>
                  {row.implementOrderCount}
                </TableCell>
                <TableCell sx={{ fontSize: '0.85rem', maxWidth: '200px', wordWrap: 'break-word' }}>
                  {row.top3Agri}
                </TableCell>
                <TableCell sx={{ fontSize: '0.85rem', maxWidth: '200px', wordWrap: 'break-word' }}>
                  {row.top3Implement}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}