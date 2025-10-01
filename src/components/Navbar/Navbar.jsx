import React from "react";
import { FaUserCircle } from "react-icons/fa";



function Navbar({ selectedYear, setSelectedYear }) {
  return (
    <nav
      className="
        fixed top-0 left-0 w-full h-[90px]
        flex justify-between items-center
        bg-[#12ab14] text-white px-[10px]
        shadow-[0_2px_5px_rgba(45,238,19,0.2)]
        z-[1000]
      "
    >
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-[10px]">
        <img
          src="/icon.gif"
          alt="Agrix Logo"
          className="h-[100px] w-[140px] object-contain"
        />
        <span className="text-[48px] font-bold tracking-[1px]">
          AGRIX BUSINESS DASHBOARD
        </span>
      </div>

      {/* Middle: Filters */}
      <div className="flex items-center gap-[10px]">
        <label
          className="text-[28px] text-[#e2e8f0]"
          htmlFor="financial-year"
        >
          Financial Year:
        </label>
        <select
          id="financial-year"
          className="
            px-[10px] py-[5px] rounded-[4px] border-none outline-none
            text-[28px] focus:border focus:border-[#38bdf8]
          "
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2023-24">2023 - 24</option>
          <option value="2024-25">2024 - 25</option>
        </select>
      </div>

      {/* Right: User icon */}
      <div className="flex items-center">
        <FaUserCircle className="text-[28px] cursor-pointer mr-[25px]" />
      </div>
    </nav>
  );
}

export default Navbar;