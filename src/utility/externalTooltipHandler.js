const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');
  
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.classList.add('graph-tooltip');
      tooltipEl.id = "graph-tooltip";
      tooltipEl.style.background = 'inherit';
      tooltipEl.style.borderRadius = '20px';
      tooltipEl.style.border = '1px solid rgba(33, 33, 33, 0.07)',
      tooltipEl.style.color = '#000000';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';
      tooltipEl.style.padding = "16px 0px 20px 0";
      tooltipEl.style.zIndex = "2";
      tooltipEl.style.backdropFilter= "blur(15px)";

      const table = document.createElement('table');
      table.style.width = '100%';

     //Tooltip arrow
     const tooltipArrowWrapper = document.createElement('div');
     const tooltipArrow = document.createElement('div');
     tooltipArrow.id = "tooltip-arrow";
     tooltipArrowWrapper.style.position = "relative"
     tooltipArrowWrapper.appendChild(tooltipArrow)

      tooltipEl.appendChild(table);
      tooltipEl.appendChild(tooltipArrowWrapper);
      chart.canvas.parentNode.appendChild(tooltipEl);

    }
  
    return tooltipEl;
  };
  
  const externalTooltipHandler = (context) => {
    // Tooltip Element
    const {chart, tooltip} = context;
    const tooltipEl = getOrCreateTooltip(chart);
  
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
  
    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map(b => b.lines);
      const tableHead = document.createElement('thead');
  
      titleLines.forEach(title => {
        const tr = document.createElement('tr');
        tr.style.borderWidth = 0;
  
        const th = document.createElement('th');
        th.style.borderWidth = 0;
        let year = +title + 1;
        const text = document.createTextNode('IN YEAR ' + year);
        if(document.getElementById('current-hover-year')){
            document.getElementById('current-hover-year').value = title;
        }
        th.appendChild(text);
        th.style.fontSize= '11px';
        th.style.color="#92949A";
        th.style.paddingBottom="5px";
        th.style.fontWeight="600";
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });
  
      const tableBody = document.createElement('tbody');
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];
  
        const span = document.createElement('div');
        var spanContent;
        if(i === 0){
           spanContent = document.createTextNode("Unloan");
           //span.style.background = 'linear-gradient(67.65deg, #F5C05A 16.53%, #EB88B1 35.44%, #B965E4 56.58%, #61A6F9 78.05%)'; //colors.backgroundColor;
        } else {
           spanContent = document.createTextNode("Other home loan");
          // span.style.background = "#C4C4C4"
        }
        span.appendChild(spanContent);
        span.style.fontSize = '14px';
        span.style.lineHeight = '1.3';
        span.style.borderWidth = '2px';
        span.style.borderRadius = '100px';
        span.style.height = '22px';
        span.style.maxWidth = '142px';
        span.style.textAlign = 'center';
        span.style.fontWeight = "600";

        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = 0;
        if(i === 0 ){
          tr.style.borderRight = '1px solid rgba(60, 60, 67, 0.18)';
        }
       
        const td = document.createElement('td');
        td.style.borderWidth = 0;
  
        const div = document.createElement('div');
        const roiData= body[0].split(':')[1];
        const roi = document.createTextNode( Number(roiData.trim()).toFixed(2)  + "%" );
        div.classList.add('graph-tooltip-primary-value');
        div.appendChild(roi);
        const roidiv = document.createElement('div');
        const roitext = document.createTextNode( "Interest rate" );
        roidiv.classList.add('graph-tooltip-secondary-text');
        roidiv.appendChild(roitext);
        const repaymentdiv = document.createElement('div');
        const repaymentAmount = parseInt(tooltip.dataPoints[i].dataset.repaymentData[Number(tooltip.title[0])])
        repaymentdiv.classList.add('graph-tooltip-primary-value');
        const repaymentdivContent = document.createTextNode( '$' + repaymentAmount.toLocaleString() );
        repaymentdiv.appendChild(repaymentdivContent);
        const totalrepaymentdiv = document.createElement('div');
        const totalrepaymentdivContent = document.createTextNode( "Monthly Repayment" );
        totalrepaymentdiv.classList.add('graph-tooltip-secondary-text');
        totalrepaymentdiv.appendChild(totalrepaymentdivContent);
  
        td.appendChild(span);
        td.appendChild(div);
        td.appendChild(roidiv);
        td.appendChild(repaymentdiv);
        td.appendChild(totalrepaymentdiv);
        tr.appendChild(td);
        tr.style.display = "inline-block";
        tableBody.style.display = "flex";
        td.style.display= "block";
        tableBody.appendChild(tr);
      });
  
      const tableRoot = tooltipEl.querySelector('table');
  
      // Remove old children
      while (tableRoot && tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
  
      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }
  
    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
  
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.textAlign = 'center';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    //console.log('tooltip.caretX', tooltip.caretX, 'tooltip.caretY', tooltip.caretY, chart.ctx)
    // Add behind elements.
    // chart.ctx.globalCompositeOperation = 'destination-over'
    // chart.ctx.fillStyle = "blue";
    // chart.ctx.fillRect(0, 0, chart.canvas.width, chart.canvas.height);
  };

  export default externalTooltipHandler;