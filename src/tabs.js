import React from "react";

export default function Tabs({ rateType, rateTypeHandler }) {
  const buttonStyle = {
    background: "white",
    border: "none",
    padding: "16px 50px",
    fontSize: "20px",
    lineHeight: "28px",
    fontWeight: "700",
    display: "inline-block",
    borderRadius: "0",
  };
  return (
    <div className="tabs">
      <button
        style={buttonStyle}
        className={`button ${rateType == "livein" ? "active" : ""}`}
        onClick={rateTypeHandler}
        value="livein"
      >
        Live in
      </button>
      <button
        style={buttonStyle}
        className={`button ${rateType == "invest" ? "active" : ""}`}
        onClick={rateTypeHandler}
        value="invest"
      >
        Invest
      </button>
    </div>
  );
}
