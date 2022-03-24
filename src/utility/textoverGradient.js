export const textOverGradient = {
    id: 'textOverGradient',
    afterDraw: chart => {
        const { ctx } = chart;
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.font = '600 16px Inter ';

        let otherLoanDiv = document.getElementById('other-loan-location');
        let unLoanDiv = document.getElementById('unloan-location');
        ctx.globalCompositeOperation = "source-over"
        ctx.fillText("  Other home loan  ",60, Number(otherLoanDiv.dataset.y) + 7);
        let angle = (unLoanDiv.dataset.yend - unLoanDiv.dataset.ystart)/unLoanDiv.dataset.x
        ctx.save();
        ctx.fillStyle = '#ffffff';
        if(angle*100 > 30){
            ctx.translate(20 , -(angle * 35) );
        }else {
            ctx.translate(20 + angle*100 , -(angle * 20) );
        }
        ctx.rotate(angle);
        ctx.globalCompositeOperation = "source-over"
        ctx.fillText('Unloan',60 ,  Number(unLoanDiv.dataset.ystart) + 5 );
        ctx.restore();
    }
  }