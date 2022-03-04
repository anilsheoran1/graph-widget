const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');
  
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.classList.add('graph-tooltip');
      tooltipEl.style.background = '#ffffff';
      tooltipEl.style.borderRadius = '20px';
      tooltipEl.style.border = '1px solid rgba(33, 33, 33, 0.07)',
      tooltipEl.style.color = '#000000';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';
      tooltipEl.style.padding = "20px";

      const table = document.createElement('table');
      table.style.margin = '0px auto';
  
      tooltipEl.appendChild(table);
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
      const tableHead = document.createElement('thead');
  
      titleLines.forEach(title => {
        const tr = document.createElement('tr');
        tr.style.borderWidth = 0;
  
        const th = document.createElement('th');
        th.style.borderWidth = 0;
        const text = document.createTextNode(title + ' yrs');
        if(document.getElementById('current-hover-year')){
            document.getElementById('current-hover-year').value = title;
        }
        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });
  
      const tableBody = document.createElement('tbody');
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];
  
        const span = document.createElement('span');
        var spanContent;
        if(i === 0){
           spanContent = document.createTextNode("Unloan");
           span.style.background = 'linear-gradient(67.65deg, #F5C05A 16.53%, #EB88B1 35.44%, #B965E4 56.58%, #61A6F9 78.05%)'; //colors.backgroundColor;
        } else {
           spanContent = document.createTextNode("Other home loan");
           span.style.background = "#C4C4C4"
        }
        span.appendChild(spanContent);
        span.style.fontSize = '16px';
        span.style.lineHeight = '1.3';
        span.style.borderWidth = '2px';
        span.style.borderRadius = '100px';
        span.style.marginRight = '10px';
        span.style.height = '22px';
        span.style.maxWidth = '142px';
        span.style.display = 'inline-block';
        span.style.color = '#ffffff';;
        span.style.textAlign = 'center' 

        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = 0;
        if(i === 0 ){
          tr.style.borderRight = '1px solid rgba(60, 60, 67, 0.18)';
        }
       
        const td = document.createElement('td');
        td.style.borderWidth = 0;
  
        const div = document.createElement('div');
        const roi = document.createTextNode(  body[0].split(':')[1] + "%" );
        div.classList.add('graph-tooltip-primary-value');
        div.appendChild(roi);
        const roidiv = document.createElement('div');
        const roitext = document.createTextNode( "Interest rate" );
        roidiv.classList.add('graph-tooltip-secondary-text');
        roidiv.appendChild(roitext);
        const repaymentdiv = document.createElement('div');
        const repaymentdivContent = document.createTextNode( "$157230" );
        repaymentdiv.classList.add('graph-tooltip-primary-value');
        repaymentdiv.appendChild(repaymentdivContent);
        const totalrepaymentdiv = document.createElement('div');
        const totalrepaymentdivContent = document.createTextNode( "Total Repayment" );
        totalrepaymentdiv.classList.add('graph-tooltip-secondary-text');
        totalrepaymentdiv.appendChild(totalrepaymentdivContent);
  
        td.appendChild(span);
        td.appendChild(div);
        td.appendChild(roidiv);
        td.appendChild(repaymentdiv);
        td.appendChild(totalrepaymentdiv);
        tr.appendChild(td);
        tr.style.display = "inline-block";
        tableBody.appendChild(tr);
      });
  
      const tableRoot = tooltipEl.querySelector('table');
  
      // Remove old children
      while (tableRoot.firstChild) {
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
  };

  export default externalTooltipHandler;