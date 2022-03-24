import React from "react";

export default function TotalSaving({ totalSaving, rateType }) {
  return (
    <div className="graph-content-section1">
      <div className="saving-header">You could save</div>
      {totalSaving && (
        <div className="saving-total">${totalSaving.toLocaleString()}</div>
      )}
      {rateType == "livein" ? (
        <div className="saving-terms">
          over the life of your loan, based on a 1.98% p.a. variable rate and
          1.89% p.a. comparison rate, including loyalty discount of 0.01% per
          year.
        </div>
      ) : (
        <div className="saving-terms">
          over the life of your loan, based on a 2.28% p.a. variable rate and
          2.19% p.a. comparison rate, including loyalty discount of 0.01% per
          year.
        </div>
      )}
    </div>
  );
}
