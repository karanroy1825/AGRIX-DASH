import * as React from "react";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";
import Typography from "@mui/joy/Typography";
import SvgIcon from "@mui/joy/SvgIcon";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";

export default function CardBox({ title, value, iconPath, onYearChange, globalSelectedYear }) {
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

  return (
    <Card
      sx={{
        backgroundColor: "#12ab14",
        color: "#fff",
        borderRadius: "12px",
        width: "200px",
        height: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        transition: "transform 0.2s",
        p: 2,
        marginTop: "1.5rem",
        position: "relative",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
      className="p-5"
    >
      {/* Three Dots Menu */}
      <div style={{ position: "absolute", top: "8px", right: "8px" }}>
        <Dropdown>
          <MenuButton
            sx={{
              backgroundColor: "transparent",
              color: "#ffffff",
              border: "none",
              minHeight: "auto",
              padding: "2px",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <SvgIcon sx={{ color: "#ffffff", fontSize: "18px" }}>
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

      <CardContent orientation="horizontal" className="flex items-center">
        <CircularProgress
          size="lg"
          determinate
          value={75}
          sx={{ color: "#ffffff" }}
        >
          <SvgIcon sx={{ color: "#ffffff" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
            </svg>
          </SvgIcon>
        </CircularProgress>
        <CardContent className="flex flex-col justify-center ml-4">
          <Typography
            level="body-md"
            className="m-0 text-[16px] text-white"
            sx={{ color: "#ffffff" }}
          >
            {title}
          </Typography>
          <Typography
            level="h2"
            className="mt-2 text-[20px] font-bold text-white"
            sx={{ color: "#ffffff" }}
          >
            {value}
          </Typography>
        </CardContent>
      </CardContent>
    </Card>
  );
}