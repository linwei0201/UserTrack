import '@/assets/styles/index.scss';
import '@/utils/domUtils';
import Clipper from '@/utils/clipper';
import $ from 'jquery';
var jsrender = require('jsrender')($);

const DEFAULT_OPTION = {
  container: $('#feedback'),
  trigger: $('#btn'),
  submitCallback: () => {},
  theme: '#3986FF',
  license: '',
  proxy: null,
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

const UserTrack = {
  _options: {},
  init(option) {
    this._options = Object.assign({}, DEFAULT_OPTION, option);
    this._renderFeedbackModal();
    this._bindEvent();
  },
  _renderFeedbackModal() {
    var finalTpl, jsRenderTpl;

    jsRenderTpl = jsrender.templates(require('@/templates/feedback.html'));
    finalTpl = jsRenderTpl.render(this._options);
    $('body').append(finalTpl);
  },
  _bindEvent() {
    // bind trigger event

    const {trigger: feedbackBtn, submitCallback } = this._options;

    $(feedbackBtn).click(() => {
      this._showFeedback();
    });

    $('.to-edit').click(() => {
      // $.observable(this._options).setProperty('state.isEditMode', true);
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

        submitCallback(data);
        this._hideFeedback();
      }
    });
  },
  _hideFeedback() {
    $('#feedback').hide();
    $('#feedbackDialog').hide();
  },
  _showFeedback() {
    this._clip();
    $('#feedback').show();
    setTimeout(() => {
      $('#feedbackDialog').show();
    }, 0);
    $('#feedbackDialog').find('.loading').show();
  },
  _clip() {
    let videoPromise = new Promise((resolve, reject) => {
      this._handleVideo(document.body, resolve, reject);
    });

    $('#screenshotPrev').attr('src', '');
    Promise.all([videoPromise]).then(() => {
      Clipper.clip(this._options.proxy).then(dataUrl => {
        $('#screenshotPrev').attr('src', dataUrl);
        $('#feedbackDialog').find('.loading').hide();
      });
    });
  },
  _handleVideo(parent, resolve, reject) {
    let videoItem = parent.getElementsByTagName('video');

    if (videoItem === 0) {
      resolve();
      return;
    }
    for (let i = 0; i < videoItem.length; i++) {
      let video = videoItem[0];

      if (!video.style.backgroundImage) {
        let w = $(video).width();
        let h = $(video).height();

        $(video).after('<canvas width="' + w + '" height="' + h + '"></canvas>');
        let canvas = $(video).next('canvas').css({display: 'none'});

        let ctx = canvas.get(0).getContext('2d');

        ctx.drawImage(video, 0, 0, w, h);
        try {
          video.style.backgroundImage = 'url(' + canvas.get(0).toDataURL('image/png') + ')';
        } catch (e) {
          console.log(e);
        } finally {
          canvas.remove();
        }
      }
    }
    resolve();
  }
};

window.UserTrack = UserTrack;
export default UserTrack;
