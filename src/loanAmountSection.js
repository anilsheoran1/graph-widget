import React from "react";
import Slider from "@mui/material/Slider";

export default function LoanAmountSection({ loanAmount, setLoanAmount }) {
  return (
    <div className="graph-content-section2-subsection">
      <div className="tertiary-text">Loan Amount</div>
      <div className="graph-input-wrapper">
        <span className="graph-input-dollarsign">$</span>
        <input
          className="graph-input-1"
          type="text"
          value={loanAmount.toLocaleString()}
          onChange={(e) =>
            setLoanAmount(Number(e.target.value.replace(/\D/g, "")))
          }
        />
      </div>
      <Slider
        className="sliders"
        size="small"
        value={loanAmount}
        max={10000000}
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
