import '@/assets/styles/index.scss';
import '@/utils/domUtils';
import Clipper from '@/utils/clipper';
import $ from 'jquery';
var jsrender = require('jsrender')($);

const UserTrack = {
  _options: {
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
  init(option) {
    this._options = {
      container: option.container,
      trigger: option.trigger,
      send: option.send,
      theme: option.theme || '#3986FF',
      license: option.license || '',
      proxy: option.proxy || null,
      title: option.title || '问题反馈',
      placeholder: option.placeholder || '请说明您的问题或分享您的想法',
      requiredTip: option.requiredTip || '必须添加说明',
      editTip: option.editTip || '点击编辑高亮或隐藏信息',
      loadingTip: option.loadingTip || '正在加载屏幕截图...',
      checkboxLabel: option.checkboxLabel || '包含截图',
      cancelLabel: option.cancelLabel || '取消',
      confirmLabel: option.confirmLabel || '发送',
      hightlightTip: option.hightlightTip || '突显问题',
      hideTip: option.hideTip || '隐藏敏感信息',
      editDoneLabel: option.editDoneLabel || '完成',
      state: {
        isEditMode: false,
        toolBarType: 'highlight'
      }
    };
    this._render();
    this._bindEvent();
  },
  _render() {
    var finalTpl, jsRenderTpl;

    // 获取模板
    jsRenderTpl = jsrender.templates(this._templates);
    // 模板与数据结合
    finalTpl = jsRenderTpl.render(this._options);
    $('body').append(finalTpl);
  },
  _bindEvent() {
    // bind trigger event
    this._options.trigger.addEventListener('click', () => {
      this._show();
    });

    $('.to-edit').click(() => {
      $.observable(this._options).setProperty('state.isEditMode', true);
    });

    // cancel event
    $('#feedback .flatbutton.cancel').click(() => { this._cancel();});
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
      if (typeof this._options.send === 'function') {
        let data = {
          text: $('#feedback textarea').val(),
          shot: $('#feedback #screenshotPrev').attr('src') || ''
        };

        this._options.send(data);
        this._cancel();
      }
    });
  },
  _cancel() {
    $('#feedback').hide();
    $('#feedbackDialog').hide();
  },
  _show() {
    this._clip();
    $('#feedback').show();
  },
  _clip() {

    Clipper.clip(this._options.proxy).then(dataUrl => {
      $('#screenshotPrev').attr('src', dataUrl);
      $('#feedbackDialog').show();
      // this.removeMouseEventListeners();
    });
  },
  _addMouseEventListeners() {
    debugger;
    document.addEventListener('mousedown', this._setStartPoint.bind(this), false);
    document.addEventListener('mousemove', this._updateClipRegion.bind(this), false);
    document.addEventListener('mouseup', this._setEndPoint.bind(this), false);
  },
  removeMouseEventListeners() {
    debugger;
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
    debugger;

    this._clip();
  },
  _templates: `<div id="feedback">
      <div id="googleFeedback">
          <div class="feedback-window">
              <div class="dialog-mask"></div>
              {{if !state.isEditMode}}
              <div id="feedbackDialog" class="dialog">
                  <div class="title" style="background: rgb(57, 134, 255);">{{:title}}</div>
                  <div class="feedback-area">
                      <textarea placeholder="{{:placeholder}}"></textarea>
                      <div class="shot-switch clearfix">
                          <div class="checkbox">
                              <svg class="checkbox-icon " focusable="false" aria-label="" fill="#757575" 
                              viewBox="0 0 24 24" height="24" width="24">
                                <path d="M19 
                                5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z">
                                </path></svg>
                              <svg class="checkbox-icon active" focusable="false" aria-label="" 
                              fill="#3986FF" viewBox="0 0 24 24" height="24" width="24">
                              <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 
                              2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 
                              14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z">
                              </path></svg>
                          </div>
                          <label>{{:checkboxLabel}}</label>
                      </div>
                      <div class="screenshot-area">
                          <div class="screenshot">
                              <div class="to-edit">
                                  <div class="edit-icon">
                                      <svg focusable="false" aria-label="" fill="#757575" 
                                      viewBox="0 0 24 24" height="48" width="48">
                                      <path d="M21 17h-2.58l2.51 2.56c-.18.69-.73 
                                      1.26-1.41 1.44L17 18.5V21h-2v-6h6v2zM19 
                                      7h2v2h-2V7zm2-2h-2V3.08c1.1 0 2 .92 2
                                       1.92zm-6-2h2v2h-2V3zm4 8h2v2h-2v-2zM9
                                       21H7v-2h2v2zM5 9H3V7h2v2zm0-5.92V5H3c0-1 
                                       1-1.92 2-1.92zM5 17H3v-2h2v2zM9 5H7V3h2v2zm4 
                                       0h-2V3h2v2zm0 16h-2v-2h2v2zm-8-8H3v-2h2v2zm0 8.08C3.9 21.08 3 20 3 19h2v2.08z">
                                       </path></svg>
                                  </div>
                                  <span class="edit-label">{{:editTip}}</span>
                              </div>
                              <img id="screenshotPrev" src="">
                          </div>
                      </div>
                      <div class="legal">如出于法律原因需要请求更改内容，请前往
                          <a href="">法律帮助</a>
                          页面。系统可能已将部分
                          <a href="">帐号和系统信息</a>
                          发送给Google。我们将根据自己的
                          <a href="">隐私权政策</a>和<a href="">服务条款</a>
                          使用您提供的信息帮助解决技术问题和改进我们的服务。
                      </div>
                      <div class="actions">
                          <div class="flatbutton cancel" style="color: rgb(117, 117, 117);">{{:cancelLabel}}</div>
                          <div class="flatbutton confirm" style="color: rgb(57, 134, 255);">{{:confirmLabel}}</div>
                      </div>
                  </div>
              </div>
              {{else}}
              <div class="tool-bar clearfix">
              </div>
              {{/if}}
              <div class="hightlight-area"></div>
              <div class="black-area"></div>
          </div>
          <canvas id="feedbackCanvas" data-html2canvas-ignore="true" 
          width="1904" height="803" style="cursor: crosshair;"></canvas>
          <canvas id="shadowCanvas" data-html2canvas-ignore="true" width="1904" height="803"></canvas>
      </div>
  </div>`
};

window.UserTrack = UserTrack;
export default UserTrack;
