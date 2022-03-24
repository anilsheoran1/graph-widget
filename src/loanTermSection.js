import React from "react";
import Slider from "@mui/material/Slider";

export default function LoanTermSection({ loanTerm, setLoanTerm }) {
  return (
    <div className="graph-content-section2-subsection">
      <div className="tertiary-text">Loan Term</div>
      <div className="graph-input-wrapper">
        <input
          className="graph-input-2"
          type="text"
          value={loanTerm}
          onChange={(e) => setLoanTerm(Number(e.target.value))}
        />
        <span className="graph-input-years">years</span>
      </div>
      <Slider
        className="sliders"
        size="small"
        value={loanTerm}
        max={30}
        aria-label="Small"
        valueLabelFormat={(value) => <div>in {value} year</div>}
        onChange={(e, val) => setLoanTerm(val)}
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
