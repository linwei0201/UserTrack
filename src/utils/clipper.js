import html2canvas from 'html2canvas';

export default {
  clip(proxy) {
    return new Promise((resolve, reject) => {
      html2canvas(document.querySelector('body'), {
        proxy,
        width: window.innerWidth,
        height: window.innerHeight,
        x: document.documentElement.scrollLeft || document.body.scrollLeft,
        y: document.documentElement.scrollTop || document.body.scrollTop
      }).then(canvas => {
        // const { x: startX, y: startY } = from;
        // const { x: endX, y: endY } = to;
        // const width = endX - startX;
        // const height = endY - startY;
        // let clipedCanvas = document.createElement('canvas');

        // clipedCanvas.width = width;
        // clipedCanvas.height = height;
        // const context = clipedCanvas.getContext('2d');

        // console.log(
        //   'sx=', startX, ',sy=', startY,
        //   ',width=', width, ',height=', height,
        //   'canvas', canvas.width, canvas.height);

        // context.drawImage(canvas, startX, startY, width, height, 0, 0, width, height);
        // context.closePath();

        // console.log('img====', clipedCanvas);
        // console.log(clipedCanvas.toDataURL());
        resolve(canvas.toDataURL());
      }).catch((e) => {
        reject(e);
      });
    });
  }
};
