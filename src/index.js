import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import getGradient from "./utility/getGradient";
import "./graphstyle.css";
import { useTheme, useMediaQuery } from "@material-ui/core";
import { publish, subscribe, RateTypeChange } from "./utility/reactive-util";
import { textOverGradient } from "./utility/textoverGradient";
import { chartAreaBorder } from "./utility/chartBorder";
import { options } from "./utility/chartOptions";
import Tabs from "./tabs";
import TotalSaving from "./totalSaving";
import LoanAmountSection from "./loanAmountSection";
import LoanTermSection from "./loanTermSection";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Unloangraph() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const chartRef = useRef(null);
  const [totalSaving, setTotalSaving] = useState();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTerm, setLoanTerm] = useState(20);
  const [otherLoanROI, setOtherLoanROI] = useState(3.32);
  const labels = Array.from(Array(loanTerm).keys());
  const otherRoiInputRef = useRef();
  const [unloanYearlyRepayment, setUnloanYearlyRepayment] = useState([]);
  const [otherBankYearlyRepayment, setOtherBankYearlyRepayment] = useState([]);
  const [unloanTotalRepayment, setUnloanTotalRepayment] = useState();
  const [otherBankTotalRepayment, setOtherBankTotalRepayment] = useState();
  const baseRate1 = 1.98;
  const baseRate2 = 2.18;
  const [unloanRoi, setUnloanRoi] = useState(baseRate1);

  //tab
  const [rateType, setRateType] = useState("livein");

  useEffect(() => {
    const unsubscribe = subscribe(RateTypeChange, setRateType);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (rateType === "livein") {
      setUnloanRoi(baseRate1);
    } else {
      setUnloanRoi(baseRate2);
    }
  }, [rateType]);

  useEffect(() => {
    //unloan API call
    getInstallments(
      loanAmount,
      unloanRoi,
      -0.01,
      loanTerm * 12,
      setUnloanYearlyRepayment,
      setUnloanTotalRepayment
    );
    //other banks API call
    getInstallments(
      loanAmount,
      otherLoanROI,
      0,
      loanTerm * 12,
      setOtherBankYearlyRepayment,
      setOtherBankTotalRepayment
    );
  }, [loanAmount, loanTerm, otherLoanROI, unloanRoi]);

  useEffect(() => {
    //total saving calcutation
    if ((otherBankTotalRepayment, unloanTotalRepayment)) {
      setTotalSaving(parseInt(otherBankTotalRepayment - unloanTotalRepayment));
    }
  }, [unloanTotalRepayment, otherBankTotalRepayment]);

  function getInstallments(
    principalAmount,
    baseROI,
    rateAdjustment,
    totalInstallment,
    monthlyRepayment,
    totalRepayment
  ) {
    fetch("https://apply.unloan.dev/calculator?_data=routes%2Fcalculator", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
      },
      body: `loan-balance=${principalAmount}&total-installments=${totalInstallment}&rate-base=${baseROI}&rate-adjustment=${rateAdjustment}&installments-per-rate-adjustment=12`,
    })
      .then((data) => data.json())
      .then((res) => {
        monthlyRepayment(getRepayment(res.installments));
        totalRepayment(getTotalRepayment(res.installments));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getRepayment(installments) {
    var repaymentsPerYear = [];
    installments.map((installment, index) => {
      if ((index + 1) % 12 === 0) {
        repaymentsPerYear.push(Math.abs(installment.paymentTotal));
      }
    });
    return repaymentsPerYear;
  }

  function getTotalRepayment(installments) {
    var totalRepayment = 0;
    installments.map((installment, index) => {
      totalRepayment = totalRepayment + Math.abs(installment.paymentTotal);
    });
    return totalRepayment;
  }

  const rightTextPlugin = {
    id: "rightTextPlugin",
    beforeDraw: (chart) => {
      const datasets = chart.config.data.datasets;
      if (datasets) {
        const { ctx } = chart;
        ctx.save();
        ctx.fillStyle = "#212121";
        ctx.font = "600 20px Inter";

        for (let i = 0; i < datasets.length; i++) {
          const ds = datasets[i];
          const label = ds.label;
          const meta = chart.getDatasetMeta(i);
          const len = meta.data.length - 1;
          const xOffset = chart.canvas.width - 90;
          if (meta.data[len]) {
            const yOffset = meta.data[len].y;
            if (i == 0) {
              ctx.fillText(label, chart.canvas.width - 10, yOffset);
              const unLoanDiv = document.getElementById("unloan-location");
              unLoanDiv.dataset.x = xOffset;
              unLoanDiv.dataset.ystart = meta.data[0].y;
              unLoanDiv.dataset.yend = yOffset;
            }
            const otherLoanDiv = document.getElementById("other-loan-location");
            if (otherLoanDiv && i === 1) {
              otherLoanDiv.dataset.x = xOffset;
              otherLoanDiv.dataset.y = yOffset;
              if (otherRoiInputRef) {
                otherRoiInputRef.current.style.top = yOffset - 15 + "px";
                otherRoiInputRef.current.style.right = "20px";
                otherRoiInputRef.current.style.position = "absolute";
              }
            }
          }
        }
        ctx.restore();
      }
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: getUnloanROI(loanTerm, unloanRoi) + "%",
        data: getUnloanROIArray(loanTerm, unloanRoi),
        fill: false,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderWidth: isDesktop ? "25" : isTablet ? "20" : "20",
        borderCapStyle: "round",
        pointBorderWidth: "0",
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        borderColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          
          if (!chartArea) {
            // This case happens on initial chart load
            return;
          }
          return getGradient(ctx, chartArea);
        },
        repaymentData: otherBankYearlyRepayment,
      },
      {
        label: otherLoanROI + "%",
        data: Array(loanTerm).fill(otherLoanROI),
        fill: false,
        borderColor: "#C4C4C4",
        borderWidth: isDesktop ? "25" : isTablet ? "20" : "20",
        borderCapStyle: "round",
        // borderRadius : '40',
        // borderSkipped: false,
        pointBorderWidth: "0",
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        repaymentData: unloanYearlyRepayment,
      },
    ],
  };

  function getUnloanROIArray(term, baseROI) {
    var roi = [];
    for (var i = 0; i < term; i++) {
      roi.push(baseROI - i * 0.01);
    }
    return roi;
  }

  function getUnloanROI(term, baseROI) {
    let roi = baseROI - (term - 1) * 0.01;
    return roi.toFixed(2);
  }

  function rateTypeHandler(e) {
    // setRateType(e.target.value);
    publish(RateTypeChange, e.target.value);
  }

  return (
    <div>
      <Tabs rateType={rateType} rateTypeHandler={rateTypeHandler} />
      <div
        style={{ maxWidth: "1167px",  margin: "0 auto", position: "relative" }}
      >
        <span className="other-roi-wrapper" ref={otherRoiInputRef}>
          <input
            className="other-roi-input"
            type="text"
            value={otherLoanROI}
            onChange={(e) => setOtherLoanROI(e.target.value)}
          />
          <span>%</span>
        </span>
        {unloanTotalRepayment && otherBankTotalRepayment && (
          <Line
            id="graph-canvas"
            ref={chartRef}
            options={options}
            data={data}
            plugins={[chartAreaBorder, rightTextPlugin, textOverGradient]}
          />
        )}
      </div>
      <input type="hidden" id="current-hover-year" />
      <input type="hidden" id="other-loan-location" />
      <input type="hidden" id="unloan-location" />
      <div className="graph-content-wrapper">
        <TotalSaving totalSaving={totalSaving} rateType={rateType} />
        <div className="graph-content-section2">
          <LoanAmountSection
            loanAmount={loanAmount}
            setLoanAmount={setLoanAmount}
          />
          <LoanTermSection loanTerm={loanTerm} setLoanTerm={setLoanTerm} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<Unloangraph />, document.getElementById("unloangraph"));
