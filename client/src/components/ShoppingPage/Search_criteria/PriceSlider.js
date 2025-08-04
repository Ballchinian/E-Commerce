import React, { useState } from "react";
import { Slider } from "@mui/material";
import "./PriceSlider.css";

function PriceSlider({ min = 0, max = 999, onChange, setPriceRange }) {
  const [value, setValue] = useState([min, max]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange?.(newValue);
    setPriceRange(newValue);
  };

  return (
    <div id = "price_bar" >
      <p>
        Price Range: £{value[0]} - {value[1] === 999 ? "∞" : `£${value[1]}`}
      </p>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={min}
        max={999}
        step={1}
      />
    </div>
  );
}



export default PriceSlider;
