import React from "react";
import Slider from "@mui/material/Slider";
import Input from './input';

export default function LoanAmountSection({ loanAmount, setLoanAmount }) {
  return (
    <div className="graph-content-section2-subsection">
      <div className="tertiary-text">Loan Amount</div>
      <div className="graph-input-wrapper">
         <Input className="graph-input-1" offset={20} style={{marginBottom: 20}}  type="text" value={loanAmount.toLocaleString()} prefix="$" setInput={setLoanAmount}/> 
      </div>
      <Slider
        className="sliders"
        size="small"
        value={loanAmount}
        max={3000000}
        min={10000}
        aria-label="Small"
        valueLabelFormat={(value) => <div>in {value} year</div>}
        onChange={(e, val) => setLoanAmount(val)}
        sx={{
          color: "#3C3C43",
          height: 6,
          "& .MuiSlider-thumb": {
            left: "100%",
            height: "30px",
            width: "30px",
            borderRadius: "48px",
            color: "#ffffff",
            border: "1px solid rgba(33, 33, 33, 0.05)",
          },
        }}
      />
    </div>
  );
}
