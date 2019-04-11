import html2canvas from 'html2canvas';

export default {
  clip(options) {
    return new Promise((resolve, reject) => {
      const body = document.body;
      html2canvas(body, {
        width: window.innerWidth,
        height: window.innerHeight,
        x: document.documentElement.scrollLeft || document.body.scrollLeft,
        y: document.documentElement.scrollTop || document.body.scrollTop
      }).then(canvas => {
        resolve(canvas.toDataURL());
      }).catch((e) => {
        reject(e);
      });
    });
  }
};
