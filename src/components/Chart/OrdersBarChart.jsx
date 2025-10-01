// src/components/Chart/OrdersBarChart.jsx
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Dropdown, MenuButton, Menu, MenuItem, SvgIcon } from "@mui/joy";

import sales2324 from "../../data/sales_2324.json";
import sales2425 from "../../data/sales_2425.json";

export default function OrdersBarChart({ selectedYear, onYearChange, globalSelectedYear }) {
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

  const [localSelectedYear, setLocalSelectedYear] = React.useState(globalSelectedYear || "Current");
  const [dataset, setDataset] = React.useState([]);

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
        ? sales2324.response_data
        : sales2425.response_data;

    // Month labels (no apostrophe!)
    const months =
      yearToUse === "2023-24"
        ? [
            "Apr 23","May 23","Jun 23","Jul 23","Aug 23","Sep 23",
            "Oct 23","Nov 23","Dec 23","Jan 24","Feb 24","Mar 24",
          ]
        : [
            "Apr 24","May 24","Jun 24","Jul 24","Aug 24","Sep 24",
            "Oct 24","Nov 24","Dec 24","Jan 25","Feb 25","Mar 25",
          ];

    let counts = months.map((m) => ({
      month: m,
      agri: 0,
      implement: 0,
      other: 0,
    }));

    data.forEach((order) => {
      if (!order.orderDate) return;
      let date = new Date(order.orderDate);

      // Format like "Apr 23"
      let monthStr =
        date.toLocaleString("en-US", { month: "short" }) +
        " " +
        date.getFullYear().toString().slice(-2);

      let idx = months.indexOf(monthStr);
      if (idx === -1) return;

      if (order.cart && Array.isArray(order.cart)) {
        order.cart.forEach((item) => {
          const product = (item.productName || "").toLowerCase().trim();

          if (agri_keywords.some((k) => product.includes(k.toLowerCase()))) {
            counts[idx].agri += 1;
          } else if (
            implement_keywords.some((k) => product.includes(k.toLowerCase()))
          ) {
            counts[idx].implement += 1;
          } else {
            counts[idx].other += 1;
          }
        });
      }
    });

    setDataset(counts);
  }, [selectedYear, localSelectedYear]);

  return (
    <div style={{ position: "relative" }} className="w-full p-4 rounded-lg bg-white shadow-md">
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
      
      <h2 className="text-xl font-bold mb-4 text-center">Order Types by Month</h2>
      <BarChart
        dataset={dataset}
        xAxis={[{ dataKey: "month", scaleType: "band" }]}
        series={[
          { dataKey: "agri", label: "Agri Products" },
          { dataKey: "implement", label: "Implements" },
          { dataKey: "other", label: "Other" },
        ]}
        yAxis={[{ label: "No. of Orders" }]}
        height={350}
        width={window.innerWidth * 0.68}
      />
    </div>
  );
}


