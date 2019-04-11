export default {
  img2base64(img) {
    return new Promise((resolve, reject) => {
      const { width, height } = img;
      const canvas = document.createElement('canvas');

      if (!width || !height) {
        resolve();
        return ;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      const newImg = new Image();

      newImg.setAttribute('crossOrigin', 'anonymous');
      newImg.src = img.src;
      newImg.onload = () => {
        ctx.drawImage(newImg, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
    });
  },
  getVideoBackground(video) {
    if (!video.style.backgroundImage) {
      const { width, height } = video.getBoundingClientRect();
      let canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      document.body.appendChild(canvas);
      let ctx = canvas.getContext('2d');

      ctx.drawImage(video, 0, 0, width, height);
      try {
        const base64 = canvas.toDataURL('image/png');
        return base64;
      } catch (e) {
        console.log(e);
      } finally {
        canvas.remove();
      }
    }
  }
};
