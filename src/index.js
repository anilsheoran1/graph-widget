import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useRef } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  import Slider from '@mui/material/Slider';
  import externalTooltipHandler from './utility/externalTooltipHandler';
  import getGradient from './utility/getGradient';
  import "./graphstyle.css";
  import { useTheme, useMediaQuery } from '@material-ui/core';
  
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
      const isTablet = useMediaQuery(theme.breakpoints.up('sm'));
      const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
      const [totalSaving, setTotalSaving] = useState(25000);
      const [loanAmount, setLoanAmount] = useState(96000);
      const [loanTerm, setLoanTerm] = useState(20);
      const [otherLoanROI, setOtherLoanROI] = useState(3.32);
      const labels = Array.from(Array(loanTerm + 1).keys());
      const otherRoiInputRef = useRef();

      const chartAreaBorder = {
        id: 'chartAreaBorder',
        beforeDraw(chart, args, options) {
          const {ctx, chartArea: {left, top, width, height}} = chart;
          ctx.save();
          ctx.strokeStyle = options.borderColor;
          ctx.lineWidth = options.borderWidth;
          ctx.setLineDash(options.borderDash || []);
          ctx.lineDashOffset = options.borderDashOffset;
          ctx.strokeRect(left, top, width, height);
          ctx.restore();
        }
      };    

      const rightTextPlugin = {
        id: 'rightTextPlugin',
        beforeDraw: chart => {
          const datasets = chart.config.data.datasets;
          if (datasets) {
            const { ctx } = chart;
            ctx.save();
            ctx.fillStyle = '#212121';
            ctx.font = '600 20px Inter';
    
            for (let i = 0; i < datasets.length ; i++) {
              const ds = datasets[i];
              const label = ds.label;
              const meta = chart.getDatasetMeta(i);
              const len = meta.data.length - 1;
              const xOffset = chart.canvas.width - 90;
              if(meta.data[len]){
                const yOffset = meta.data[len].y;
                if(i == 1){
                    ctx.fillText(label, xOffset, yOffset);
                    const unLoanDiv = document.getElementById('unloan-location');
                    unLoanDiv.dataset.x = xOffset;
                    unLoanDiv.dataset.ystart =  meta.data[0].y;
                    unLoanDiv.dataset.yend =  yOffset;
                }
                const otherLoanDiv = document.getElementById('other-loan-location');
                if(otherLoanDiv && i === 0){
                    otherLoanDiv.dataset.x = xOffset;
                    otherLoanDiv.dataset.y = yOffset;
                    if(otherRoiInputRef){
                        otherRoiInputRef.current.style.top =   yOffset + 'px';
                        otherRoiInputRef.current.style.right =  '15px';
                        otherRoiInputRef.current.style.position = 'absolute';
                    }
                }
              }
            }
            ctx.restore();
          }
        }
      }

      const textOverGradient = {
        id: 'textOverGradient',
        afterDraw: chart => {
            const { ctx } = chart;
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.font = '600 16px Inter ';

            let otherLoanDiv = document.getElementById('other-loan-location');
            let unLoanDiv = document.getElementById('unloan-location');
            ctx.fillText("  Other home loan  ",50, Number(otherLoanDiv.dataset.y) + 5);
            let angle = (unLoanDiv.dataset.yend - unLoanDiv.dataset.ystart)/unLoanDiv.dataset.x
            ctx.save();
            ctx.translate(20, -(angle * 10) );
            ctx.rotate(angle);
            ctx.fillText('Unloan',50,  Number(unLoanDiv.dataset.ystart) + 5 );
            ctx.restore();
        }
      }
      
      const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        layout: {
            padding: {
                right: 110
            }
        },
        plugins: {
            legend: {
              display: false
            },
            chartAreaBorder: {
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
            },
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: externalTooltipHandler
            },
            rightTextPlugin: {},
        },
        scales: {
            y: {
                display: false,
               // beginAtZero: true,
                ticks: {
                    display: false,
                },
            },
            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    drawTicks: false,
                },
            },
        }
      };

      const data = {
        labels,
        datasets: [
          {
            label: otherLoanROI + '%',
            data: Array(loanTerm + 1).fill(otherLoanROI)  ,
            borderColor: '#C4C4C4',
            borderWidth: isDesktop ? '40' : isTablet ? '30' : '20',
            borderCapStyle: 'round',
            pointBorderWidth: '0',
            pointBorderColor: 'transparent',
            pointBackgroundColor: 'transparent',
          },
          {
            label: getUnloanROI(loanTerm, 1.98) + '%',
            data: getUnloanROIArray(loanTerm , 1.98),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            borderWidth: isDesktop ? '40' : isTablet ? '30' : '20',
            borderCapStyle: 'round',
            pointBorderWidth: '0',
            pointBorderColor: 'transparent',
            pointBackgroundColor: 'transparent',
            borderColor: function(context) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
        
                if (!chartArea) {
                  // This case happens on initial chart load
                  return;
                }
                return getGradient(ctx, chartArea);
            },
          },
        ],
      };
    

      function getUnloanROIArray(term, baseROI){
        var roi = [];
        for(var i =0; i<= term; i++){
            roi.push(baseROI  - i * 0.01)
        }
        return roi;
      }

      function getUnloanROI(term, baseROI){
          let roi = baseROI  - term * 0.01;
          return roi.toFixed(2)
      }
      
    return (
        <div>
            <div style={{maxWidth: "1167px", margin: "0 auto", position: "relative"}}>
                <span className="other-roi-wrapper" ref={otherRoiInputRef}>
                    <input className="other-roi-input" type="text" value={otherLoanROI} onChange={(e)=> setOtherLoanROI(e.target.value)} />
                    <span>%</span>
                </span>
                <Line id="graph-canvas" options={options} data={data} plugins={[chartAreaBorder, rightTextPlugin, textOverGradient]} />
            </div>
            <input type="hidden" id="current-hover-year" />
            <input type="hidden" id="other-loan-location" />
            <input type="hidden" id="unloan-location" />
            <div className="graph-content-wrapper">
                <div className="graph-content-section1">
                    <div className="saving-header">You could save</div>
                    <div className="saving-total">${totalSaving.toLocaleString()}</div>
                    <div className="saving-terms">over the life of your loan, based on a 1.98% p.a. variable rate and 1.89% p.a. comparison rate, including loyalty discount of 0.01% per year.</div>
                </div>
                <div className="graph-content-section2">
                    <div className= "graph-content-section2-subsection" >
                        <div className="tertiary-text">Loan Amount</div>
                        <div className="graph-input-wrapper">
                            <span className="graph-input-dollarsign">$</span>
                            <input className="graph-input-1" type="text" value={loanAmount.toLocaleString()} onChange={(e)=> setLoanAmount(Number(e.target.value.replace(/\D/g, '')))} />
                        </div>
                        <Slider
                            className="sliders"
                            size="small"
                            value={loanAmount}
                            max={100000}
                            aria-label="Small"
                            valueLabelFormat={value => <div>in {value} year</div>}
                            onChange={(e, val) => setLoanAmount(val)}
                            sx={{
                                color: '#3C3C43',
                                height: 6,
                            '& .MuiSlider-thumb': {
                                    left: "100%",
                                    height: "40px",
                                    width: "40px",
                                    borderRadius: "48px",
                                    color: "#ffffff",
                                    border: "1px solid rgba(33, 33, 33, 0.05)",
                            }     
                            }} 
                        />
                    </div>
                    <div className= "graph-content-section2-subsection">
                        <div className="tertiary-text">Loan Term</div>
                        <div className="graph-input-wrapper">
                            <input className="graph-input-2" type="text" value={loanTerm} onChange={(e)=> setLoanTerm(Number(e.target.value))} />
                            <span className="graph-input-years">years</span>
                        </div>
                        <Slider
                             className="sliders"
                            size="small"
                            value={loanTerm}
                            max={30}
                            aria-label="Small"
                            valueLabelFormat={value => <div>in {value} year</div>}
                            onChange={(e, val) => setLoanTerm(val)}
                            sx={{
                                color: '#3C3C43',
                                height: 6,
                            '& .MuiSlider-thumb': {
                                    left: "100%",
                                    height: "40px",
                                    width: "40px",
                                    borderRadius: "48px",
                                    color: "#ffffff",
                                    border: "1px solid rgba(33, 33, 33, 0.05)",
                            }     
                            }} 
                        />
                    </div>
                </div>
               
            </div>
        </div>
        )
  }


ReactDOM.render(<Unloangraph />, document.getElementById('unloangraph'));
