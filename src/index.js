import '@/assets/styles/index.scss';
import '@/utils/domUtils';
import { img2base64, video2base64 } from '@/utils/canvas';
import Clipper from '@/utils/clipper';
import $ from 'jquery';
var jsviews = require('jsviews')($);
var jsrender = require('jsrender')($);

const DEFAULT_OPTION = {
  container: $('#feedback'),
  trigger: $('#btn'),
  submitCallback: () => {},
  theme: '#3986FF',
  license: '',
  title: 'Send feedback',
  placeholder: 'Describe your issue or share your ideas',
  requiredTip: 'description is required',
  editTip: 'Click to highlight or hide info',
  loadingTip: 'loading screenshot...',
  checkboxLabel: 'Include screenshot',
  cancelLabel: 'cancel',
  confirmLabel: 'send',
  hightlightTip: 'Highlight issues',
  hideTip: 'Hide sensitive info',
  editDoneLabel: 'Done',
  state: {
    isEditMode: false,
    toolBarType: 'highlight'
  }
};
var app;

const UserTrack = {
  _options: {},
  init(option) {
    app = Object.assign({}, DEFAULT_OPTION, option);
    this._options = Object.assign({}, DEFAULT_OPTION, option);
    this._renderFeedbackModal();
    this._bindEvent();
    this._parseTags();
    console.log(app);
  },
  _renderFeedbackModal() {
    var jsRenderTpl;

    jsRenderTpl = jsrender.templates(require('@/templates/feedback.html'));
    jsRenderTpl.link('#feedback', app);
  },
  _bindEvent() {
    // bind trigger event

    const {trigger: feedbackBtn, submitCallback } = this._options;

    $(feedbackBtn).click(() => {
      this._showFeedback();
    });

    $('.to-edit').click(() => {
      console.log(app);
      jsviews.observable(app).setProperty('state.isEditMode', true);
    });

    $('#feedback .checkbox .checkbox-icon').click((e) => {
      const $target = $(e.currentTarget);
      if ($target.hasClass('active')) {
        $target.removeClass('active');
        $target.siblings('svg').addClass('active');
      } else {
        $target.addClass('active');
        $target.siblings('svg').removeClass('active');
      }
      if ($('#feedback .checkbox .checkbox-icon.include-shot').hasClass('active')) {
        this._clip();
        $('#feedbackDialog').find('.screenshot-area').show();
      } else {
        $('#feedbackDialog').find('.screenshot-area').hide();
      }
    });

    // cancel event
    $('#feedback .flatbutton.cancel').click(() => { this._hideFeedback();});
    // send event
    $('#feedback .flatbutton.confirm').click(() => {
      // if (this.state.loading) {
      //   this.snackbar(this.props.loadingTip || '正在加载屏幕截图...');
      //   return;
      // }
      // let text = this.state.text;

      // if (!text) {
      //   this.setState({
      //     textError: this.props.requiredTip || '必须添加说明'
      //   });
      //   this.refs.textarea.focus();
      //   return;
      // }
      if (typeof submitCallback === 'function') {
        const data = {
          text: $('#feedback textarea').val(),
          shot: $('#feedback #screenshotPrev').attr('src') || ''
        };

        if ($('#feedback .checkbox .checkbox-icon.exclude-shot').hasClass('active')) {
          delete data.shot;
        }
        submitCallback(data);
        this._hideFeedback();
      }
    });
    $('#feedback .tool-bar clearfix .flatbutton done').click(() => {
      this._hideFeedback();
    });
  },
  _hideFeedback() {
    $('#feedback').hide();
    $('#feedbackDialog').hide();
  },
  _showFeedback() {
    this._clip();
    $('#feedback').show();
    $('#feedbackDialog').find('.loading').show();
  },
  _clip() {
    $('#screenshotPrev').attr('src', '');
    Clipper.clip(this._options).then(dataUrl => {
      this.imgurl = dataUrl;
      $('#feedbackDialog').show();
      $('#screenshotPrev').attr('src', dataUrl);
      $('#feedbackDialog').find('.loading').hide();
    });
  },
  _parseTags() {
    this._parseImg(document.body);
    this._parseVideo(document.body);
  },
  _parseImg(container) {
    const imgs = Array.from(container.querySelectorAll('img')).filter(img => img.width && img.height);

    if (!imgs.length) {
      return false;
    }
    const promises = [];
    imgs.forEach(img => {
      const p = img2base64(img);
      promises.push(p);
    });
    Promise.all(promises).then(results => {
      results.forEach((base64, i) => {
        imgs[i].src = base64;
      });
    });
  },
  _parseVideo(container) {
    let videos = container.querySelectorAll('video');

    if (videos === 0) {
      return false;
    }

    videos.forEach(video => {
      video.style.backgroundImage = `url(${video2base64(video)})`;
    });
  },
  handleMouseMove(e) {
    if (!this.move) return;
    let toolBar = this.refs.toolBar;
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
  }
};

window.UserTrack = UserTrack;
export default UserTrack;
