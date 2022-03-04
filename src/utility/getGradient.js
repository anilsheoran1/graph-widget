let width, height, gradient;
function getGradient(ctx, chartArea) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient( chartArea.left, 0, chartArea.right, 0);
    gradient.addColorStop(0, "#F5C05A");
    gradient.addColorStop(0.35, "#EB88B1");
    gradient.addColorStop(0.56, "#B965E4");
    gradient.addColorStop(1, "#61A6F9");  
  }

  return gradient;
}

export default getGradient;