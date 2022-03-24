import externalTooltipHandler from './externalTooltipHandler';
export const options = {
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
           // display: false,
            ticks: {
                display: false,
            },
            grid: {
                drawTicks: false,
            },
           // offset: 1
        },
    }
  };