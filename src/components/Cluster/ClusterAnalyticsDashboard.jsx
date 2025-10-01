import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card, CardContent, Typography, Box, Grid, Paper } from '@mui/material';
import ProductPreferencesChart from './ProductPreferencesChart';
import ClusterLeaderboardChart from './ClusterLeaderboardChart';
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

export default function ClusterAnalyticsDashboard({ selectedYear }) {
  const [clusterData, setClusterData] = React.useState([]);
  const [chartData, setChartData] = React.useState({
    salesComparison: [],
    orderDistribution: [],
    categoryPreference: [],
    performanceScatter: [],
    topClusters: []
  });

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
        agriOrders: 0,
        implementOrders: 0,
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

    // Calculate average order values
    Object.values(clusterStats).forEach(cluster => {
      cluster.avgOrderValue = cluster.totalOrders > 0 
        ? cluster.totalSales / cluster.totalOrders 
        : 0;
    });

    // Filter clusters with data
    const activeClusters = Object.values(clusterStats)
      .filter(cluster => cluster.totalOrders > 0)
      .sort((a, b) => b.totalSales - a.totalSales);

    // Prepare chart data
    const salesComparison = activeClusters.map(cluster => ({
      cluster: cluster.name,
      sales: Math.round(cluster.totalSales),
      orders: cluster.totalOrders
    }));

    const orderDistribution = activeClusters.map(cluster => ({
      id: cluster.id,
      value: cluster.totalOrders,
      label: cluster.name
    }));

    const categoryPreference = activeClusters.map(cluster => ({
      cluster: cluster.name,
      agri: cluster.agriOrders,
      implement: cluster.implementOrders
    }));

    const performanceScatter = activeClusters.map(cluster => ({
      x: cluster.totalOrders,
      y: cluster.avgOrderValue,
      id: cluster.name
    }));

    const topClusters = activeClusters.slice(0, 5);

    setClusterData(activeClusters);
    setChartData({
      salesComparison,
      orderDistribution,
      categoryPreference,
      performanceScatter,
      topClusters
    });
  }, [selectedYear]);

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" component="h1" gutterBottom className="text-gray-800 font-bold">
        📊 Cluster Business Intelligence Dashboard
      </Typography>
      
      {/* Charts Grid */}
      <Grid container spacing={4}>

        {/* 3. Product Category Preferences */}
        <Grid item xs={12} md={6}>
          <ProductPreferencesChart chartData={chartData} />
        </Grid>

        {/* 5. Top Performers Leaderboard */}
        <Grid item xs={12}>
          <ClusterLeaderboardChart chartData={chartData} />
        </Grid>
      </Grid>
    </div>
  );
}