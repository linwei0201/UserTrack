
import Clipper from '@/utils/clipper';
import $ from 'jquery';
import { HIGH_LIGHT_ELEMENTS } from '@/constants';
const ClipComponent = {
  config: { },
  state: {
    docWidth: 0,
    docHeight: 0,
    winHeight: 0,
    isEditMode: false,
    device: 'pc',
    text: '',
    textError: '',
    shotOpen: true,
    loading: false,
    screenshotEdit: false,
    editMode: false,
    toolBarType: 'highlight',
    highlightItem: [],
    blackItem: [],
    snackbar: false,
    snackbarMsg: ''
  },
  screenShotSrc: '',
  move: false,
  eX: 0,
  eY: 0,
  ctx: null,
  dragRect: false,
  startX: 0,
  startY: 0,
  handleMoveMouseDown(e) {
    this.move = true;
    this.eX = e.clientX + window.scrollX;
    this.eY = e.clientY + window.scrollY;
  },
  handleMoveMouseUp(e) {
    this.move = false;
    this.canvasMD = false;
    if (this.dragRect) {
      let clientX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft),
        clientY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop),
        width = this.startX - clientX,
        height = this.startY - clientY;
      if (Math.abs(width) < 6 || Math.abs(height) < 6) {
        return;
      }
      let toolBarType = this.state.toolBarType,
        obj = {
          sx: clientX,
          sy: clientY,
          width: width,
          height: height
        };
      if (width < 0) {
        obj.sx = obj.sx + width;
        obj.width = Math.abs(width);
      }
      if (height < 0) {
        obj.sy = obj.sy + height;
        obj.height = Math.abs(height);
      }
      if (toolBarType === 'highlight') {
        $.observable(this.state.highlightItem).insert(obj);
      } else if (toolBarType === 'black') {
        $.observable(this.state.blackItem).insert(obj);
        // $.observable(this).setProperty('state.blackItem', blackItem);
      }
      setTimeout(() => {
        this.dragRect = false;
        this.drawHightlightBorder();
        this.drawHightlightArea();
      });
    }
  },

  handleMouseMove(e) {
    if (!this.move) return;
    let toolBar = $('#feedback .tool-bar.clearfix')[0];
    let eX = this.eX;
    let eY = this.eY;
    let newEX = e.clientX + window.scrollX;
    let newEY = e.clientY + window.scrollY;
    let oX = newEX - eX;
    let oY = newEY - eY;
    let curL = parseFloat(toolBar.style.left);
    let curT = parseFloat(toolBar.style.top);
    toolBar.style.left = `${curL + oX}px`;
    toolBar.style.top = `${curT + oY}px`;
    this.eX = newEX;
    this.eY = newEY;
  },
  canvasMouseDown(e) {
    this.canvasMD = true;
    this.startX = e.clientX + (document.documentElement.scrollLeft + document.body.scrollLeft);
    this.startY = e.clientY + (document.documentElement.scrollTop + document.body.scrollTop);
  },
  drawHightlightBorder() {
    let highlightItem = this.state.highlightItem;
    highlightItem.map((data, k) => {
      this.ctx.lineWidth = '5';
      this.ctx.strokeStyle = '#FEEA4E';
      this.ctx.rect(data.sx, data.sy, data.width, data.height);
      this.ctx.stroke();
    });
  },

  drawHightlightArea() {
    let highlightItem = this.state.highlightItem;
    highlightItem.map((data, k) => {
      this.sctx.clearRect(data.sx, data.sy, data.width, data.height);
      this.ctx.clearRect(data.sx, data.sy, data.width, data.height);
    });
  },
  initListeners() {
    document.addEventListener('mousemove', this._documentMouseMove(), false);
    document.addEventListener('click', this._elementHelperClick(), false);
    window.addEventListener('resize', this._windowResize(), false);
  },
  windowResize() {
    this.calcHeight();
  },
  calcHeight() {
    let docWidth = document.body.clientWidth,
      docHeight = document.body.clientHeight;
    let windowHeight = window.innerHeight;
    if (docHeight < windowHeight) {
      docHeight = windowHeight;
    }
    $.observable(this).setProperty('state.docWidth', docWidth);
    $.observable(this).setProperty('state.docHeight', docHeight);
    $.observable(this).setProperty('state.winHeight', windowHeight);
    setTimeout(() => {
      this.initCanvas(true);
    });
  },

  removeEventListener() {
    document.removeEventListener('mousemove', this._documentMouseMove(), false);
    document.removeEventListener('click', this._elementHelperClick(), false);
    window.removeEventListener('resize', this._windowResize(), false);
  },
  initCanvas(init) {
    let canvas = $('#feedback #feedbackCanvas')[0];
    if (!canvas) {
      return false;
    }
    let shadowCanvas = $('#feedback #shadowCanvas')[0];
    let docWidth = this.state.docWidth,
      docHeight = this.state.docHeight;
    if (!this.ctx) {
      this.ctx = canvas.getContext('2d');
    }
    if (!this.sctx) {
      this.sctx = shadowCanvas.getContext('2d');
    }
    if (init) {
      canvas.style.width = docWidth;
      canvas.style.height = docHeight;
      shadowCanvas.style.width = docWidth;
      shadowCanvas.style.height = docHeight;
    }
    canvas.width = docWidth;
    canvas.height = docHeight;
    shadowCanvas.width = docWidth;
    shadowCanvas.height = docHeight;
    this.sctx.fillStyle = 'rgba(0,0,0,0.38)';
    this.sctx.fillRect(0, 0, docWidth, docHeight);
  },
  drawElementHelper(info) {
    this.initCanvas();
    let toolBarType = this.state.toolBarType;
    if (toolBarType === 'highlight') {
      this.ctx.lineWidth = '5';
      this.ctx.strokeStyle = '#FEEA4E';
      this.ctx.rect(info.sx, info.sy, info.width, info.height);
      this.ctx.stroke();
      this.drawHightlightBorder();
      this.drawHightlightArea();
      this.ctx.clearRect(info.sx, info.sy, info.width, info.height);
      this.sctx.clearRect(info.sx, info.sy, info.width, info.height);
    } else if (toolBarType === 'black') {
      this.drawHightlightBorder();
      this.drawHightlightArea();
      this.ctx.fillStyle = 'rgba(0,0,0,.4)';
      this.ctx.fillRect(info.sx, info.sy, info.width, info.height);
    }
  },
  _documentMouseMove() {
    this.documentMouseMoveFn = this.documentMouseMoveFn || this.documentMouseMove.bind(this);
    return this.documentMouseMoveFn;
  },
  _elementHelperClick() {
    this.elementHelperClickFn = this.elementHelperClickFn || this.elementHelperClick.bind(this);
    return this.elementHelperClickFn;
  },
  _windowResize() {
    this.windowResizeFn = this.windowResizeFn || this.windowResize.bind(this);
    return this.windowResizeFn;
  },
  documentMouseMove(e) {
    if (this.canvasMD) {
      if (!this.dragRect) {
        this.dragRect = true;
      }
      let toolBarType = this.state.toolBarType;
      let clientX = e.clientX + (document.documentElement.scrollLeft + document.body.scrollLeft),
        clientY = e.clientY + (document.documentElement.scrollTop + document.body.scrollTop),
        width = this.startX - clientX,
        height = this.startY - clientY;
      this.initCanvas();
      this.drawHightlightBorder();
      if (toolBarType === 'highlight') {
        this.ctx.lineWidth = '5';
        this.ctx.strokeStyle = '#FEEA4E';
        this.ctx.rect(clientX, clientY, width, height);
        this.ctx.stroke();
        this.drawHightlightArea();
        this.ctx.clearRect(clientX, clientY, width, height);
        this.sctx.clearRect(clientX, clientY, width, height);
      } else if (toolBarType === 'black') {
        this.drawHightlightArea();
        this.ctx.fillStyle = 'rgba(0,0,0,.4)';
        this.ctx.fillRect(clientX, clientY, width, height);
      }
    } else {
      this.elementHelper(e);
    }
  },
  elementHelper(e) {
    let rectInfo = this.inElement(e);
    let canvas = $('#feedback #feedbackCanvas')[0];
    if (rectInfo) {
      canvas.style.cursor = 'pointer';
      this.drawElementHelper(rectInfo);
      this.hasHelper = true;
    } else {
      if (this.hasHelper) {
        this.hasHelper = false;
        this.initCanvas();
        this.drawHightlightBorder();
        this.drawHightlightArea();
      }
    }
  },
  inElement(e) {
    // console.log('HIGH_LIGHT_ELEMENTS', HIGH_LIGHT_ELEMENTS);
    let x = e.clientX,
      y = e.clientY;
    let el = document.elementsFromPoint(x, y)[3];
    let canvas = $('#feedback #feedbackCanvas')[0];
    canvas.style.cursor = 'crosshair';
    if (el && HIGH_LIGHT_ELEMENTS.indexOf(el.nodeName.toLocaleLowerCase()) > -1) {
      let rect = el.getBoundingClientRect();
      let rectInfo = {
        sx: rect.left + (document.documentElement.scrollLeft + document.body.scrollLeft),
        sy: rect.top + (document.documentElement.scrollTop + document.body.scrollTop),
        width: rect.width,
        height: rect.height
      };
      return rectInfo;
    }
    return false;
  },

  elementHelperClick(e) {
    if (this.dragRect) return;
    let nodeName = e.target.nodeName;
    if (nodeName !== 'CANVAS') return;
    let rectInfo = this.inElement(e);
    if (rectInfo) {
      let toolBarType = this.state.toolBarType;
      if (toolBarType === 'highlight') {
        $.observable(this.state.highlightItem).insert(rectInfo);
      } else if (toolBarType === 'black') {
        $.observable(this.state.blackItem).insert(rectInfo);
      }
    }
  },
  toEditMode() {
    this.initListeners();
    $.observable(this).setProperty('state.isEditMode', true);
    $.observable(this).setProperty('screenShotSrc', '');
    setTimeout(() => {
      let toolBar = $('#feedback .tool-bar.clearfix')[0],
        windowWidth = window.innerWidth,
        windowHeight = window.innerHeight;
      toolBar.style.left = `${windowWidth * 0.5}px`;
      toolBar.style.top = `${windowHeight * 0.6}px`;
    });
  },
  clearText() {
    this.state.text = '';
    $.observable(this).setProperty('state.text', '');
  },
  clearHightlights() {
    this.state.highlightItem = [];
    this.state.highlightItem.forEach((h, i) => {
      $.observable(this.state.highlightItem).remove(i);
    });
  },
  clearHightlight(k) {
    $.observable(this.state.highlightItem).remove(k);
    setTimeout(() => {
      this.initCanvas();
      this.drawHightlightBorder();
      this.drawHightlightArea();
    });
  },
  clearBlacks() {
    this.state.blackItem = [];
    this.state.blackItem.forEach((b, i) => {
      $.observable(this.state.blackItem).remove(i);
    });
  },
  clearBlack(k, e) {
    $.observable(this.state.blackItem).remove(k);
  },
  editCancel() {
    this.removeEventListener();
    $.observable(this).setProperty('state.isEditMode', false);
    setTimeout(() => {
      this.shotScreen();
    });
  },
  shotScreen() {
    if (this.state.loading) return;
    this.loadingState(true);
    let highlightItem = this.state.highlightItem;
    this.switchCanvasVisible(highlightItem.length > 0);
    Clipper.clip(this._options).then(dataUrl => {
      $.observable(this).setProperty('screenShotSrc', dataUrl);
      $('#feedback #screenshotPrev')[0].onload = () => {
        $.observable(this).setProperty('state.screenshotEdit', true);
      };
      this.loadingState(false);
    }).catch((e) => {
      $.observable(this).setProperty('state.screenshotEdit', false);
      this.loadingState(false);
      console.log(e);
    });
  },
  switchCanvasVisible(visible) {
    let shadowCanvas = $('#feedback #shadowCanvas')[0];
    if (visible) {
      shadowCanvas.removeAttribute('data-html2canvas-ignore');
    } else {
      shadowCanvas.setAttribute('data-html2canvas-ignore', 'true');
    }
  },
  setToolBarType(type) {
    $.observable(this).setProperty('state.toolBarType', type);
  },
  loadingState(state) {
    $.observable(this).setProperty('state.loading', state);
  },
  send() {
    if (this.state.loading) {
      this.snackbar(this.config.loadingTip);
      return;
    }
    let text = this.state.text;
    if (!text) {
      $.observable(this).setProperty('state.textError', this.config.requiredTip);
      $('#feedback textarea').focus();
      return;
    }
    if (typeof this.config.submitCallback === 'function') {
      let data = {
        text: this.state.text
      };
      if (this.state.shotOpen) {
        data.shot = this.screenShotSrc || '';
      }
      this.config.submitCallback(data);
      this.cancel();
    }
    $.observable(this).setProperty('screenShotSrc', '');
    this.clearHightlights();
    this.clearBlacks();
    this.clearText();
  },
  setTextError() {
    $.observable(this).setProperty('state.textError', '');
  },
  cancel() {
    // this.removeEventListener();
    $.observable(this).setProperty('state.isOpen', false);
  },
  snackbar(msg) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    $.observable(this).setProperty('state.snackbar', true);
    $.observable(this).setProperty('state.snackbarMsg', msg || '');
    this.timer = setTimeout(() => {
      $.observable(this).setProperty('state.snackbar', false);
      $.observable(this).setProperty('state.snackbarMsg', '');
    }, 1500);
  },
  checkboxHandle() {
    $.observable(this).setProperty('state.shotOpen', !this.state.shotOpen);
    if (!this.state.shotOpen) {
      this.shotScreen();
    }
  },
  componentDidMount() {
    const triggerElement = this.config.trigger;
    if (triggerElement) {
      triggerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        $.observable(this).setProperty('state.isOpen', true);
        this.calcHeight();
        if (this.state.shotOpen) {
          this.shotScreen();
        }
      });
    }
  }
};
export default ClipComponent;
