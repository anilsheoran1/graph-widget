export const textOverGradient = {
    id: 'textOverGradient',
    afterDraw: chart => {
        const { ctx } = chart;
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.font = '600 16px Inter ';

        let otherLoanDiv = document.getElementById('other-loan-location');
        let unLoanDiv = document.getElementById('unloan-location');
        ctx.globalCompositeOperation = "destination-over"
        if(Math.abs(Number(unLoanDiv.dataset.ystart) - Number(otherLoanDiv.dataset.y)) > 30 ){
            ctx.fillText("  Other home loan  ",60, Number(otherLoanDiv.dataset.y) - 20);
        }else {
            ctx.fillText("  Other home loan  ",120, Number(otherLoanDiv.dataset.y) - 20);
        }
        
        ctx.restore();
        //let angle = (unLoanDiv.dataset.yend - unLoanDiv.dataset.ystart)/unLoanDiv.dataset.x;
        ctx.save();
        ctx.fillStyle = '#F3B76A';
        ctx.font = '600 16px Inter ';
        //ctx.translate(0,Number(unLoanDiv.dataset.ystart))
        // if(angle*100 > 37){
        //     ctx.translate(20 , -(angle * 35) );
        // }else {
        //     ctx.translate(20 + angle*100 , -(angle * 20) );
        // }
        //ctx.rotate(angle);
        //ctx.textAlign = "left";
        ctx.globalCompositeOperation = "source-over"
        ctx.fillText('Unloan',60 , Number(unLoanDiv.dataset.ystart) - 20);
        ctx.restore();
    }
  }