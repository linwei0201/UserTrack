import 'index.less';
import html2canvas from 'html2canvas';

const UserTrack = {
  _options: {
    btnText: 'User Feedback'
  },
  _isFeedbackMode: false,
  _startPoint: {
    x: 0,
    y: 0
  },
  _endPoint: {
    x: 0,
    y: 0
  },
  _clip() {
    html2canvas(document.querySelector('body')).then(canvas => {
      const { x: startX, y: startY } = this._startPoint;
      const { x: endX, y: endY } = this._endPoint;
      const width = endX - startX;
      const height = endY - startY;
      let clipedCanvas = document.createElement('canvas');

      clipedCanvas.width = width;
      clipedCanvas.height = height;
      const context = clipedCanvas.getContext('2d');

      console.log(
        'sx=', startX, ',sy=', startY,
        ',width=', width, ',height=', height,
        'canvas', canvas.width, canvas.height);

      context.drawImage(canvas, startX, startY, width, height, 0, 0, width, height);
      context.closePath();

      console.log('img====', clipedCanvas);
      console.log(clipedCanvas.toDataURL());
    });
    console.log('clipppp', this._startPoint, this._endPoint);
  },
  init(options) {
    const opt = Object.assign({}, this._options, options);
    const container = document.querySelector('body');
    const btn = document.createElement('button');

    btn.classList.add('feedback-btn');
    btn.innerText = opt.btnText;
    container.appendChild(btn);

    this.addClickListeners(btn);
  },
  addClickListeners(ele) {
    ele.addEventListener('click', () => {
      this.addMouseEventListeners();
    }, false);
  },
  addMouseEventListeners() {
    document.addEventListener('mousedown', this.mouseDownHandler.bind(this), false);
    document.addEventListener('mousemove', this.mouseMoveHandler.bind(this), false);
    document.addEventListener('mouseup', this.mouseUpHandler.bind(this), false);
  },
  removeMouseEventListeners() {
    document.removeEventListener('mousedown', this.mouseDownHandler.bind(this), false);
    document.removeEventListener('mousemove', this.mouseMoveHandler.bind(this), false);
    document.removeEventListener('mouseup', this.mouseUpHandler.bind(this), false);
  },
  mouseDownHandler(e) {
    const {pageX, pageY} = e;

    this._startPoint.x = pageX;
    this._startPoint.y = pageY;
  },
  mouseMoveHandler() {
    // console.log('mounse move....');
  },
  mouseUpHandler(e) {
    const {pageX, pageY} = e;

    this._endPoint.x = pageX;
    this._endPoint.y = pageY;

    this._clip();
  }
};

window.UserTrack = UserTrack;
export default UserTrack;
