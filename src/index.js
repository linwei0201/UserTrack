import '@/assets/styles/index.less';
import '@/utils/domUtils';
import Clipper from '@/utils/clipper';

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
  init(options) {
    const opt = Object.assign({}, this._options, options);
    const container = document.querySelector('body');
    const btn = document.createElement('button');

    btn.classList.add('feedback-btn');
    btn.innerText = opt.btnText;
    container.appendChild(btn);

    this._addClickListeners(btn);
  },
  _clip() {
    const { x: startX, y: startY } = this._startPoint;
    const { x: endX, y: endY } = this._endPoint;
    const from = { x: startX, y: startY};
    const to = { x: endX, y: endY};

    Clipper.clip(from, to).then(dataUrl => {
      console.log('dataUrl', dataUrl);
    });
  },
  _addClickListeners(ele) {
    ele.addEventListener('click', () => {
      this._addMouseEventListeners();
    }, false);
  },
  _addMouseEventListeners() {
    document.addEventListener('mousedown', this._setStartPoint.bind(this), false);
    document.addEventListener('mousemove', this._updateClipRegion.bind(this), false);
    document.addEventListener('mouseup', this._setEndPoint.bind(this), false);
  },
  removeMouseEventListeners() {
    document.removeEventListener('mousedown', this._setStartPoint.bind(this), false);
    document.removeEventListener('mousemove', this._updateClipRegion.bind(this), false);
    document.removeEventListener('mouseup', this._setEndPoint.bind(this), false);
  },
  _setStartPoint(e) {
    const {pageX, pageY} = e;

    this._startPoint.x = pageX;
    this._startPoint.y = pageY;
  },
  _updateClipRegion() {
    // console.log('mounse move....');
  },
  _setEndPoint(e) {
    const {pageX, pageY} = e;

    this._endPoint.x = pageX;
    this._endPoint.y = pageY;

    this._clip();
  }
};

window.UserTrack = UserTrack;
export default UserTrack;
