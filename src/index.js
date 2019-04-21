import '@/assets/styles/index.scss';
import '@/utils/domUtils';
import { img2base64, video2base64 } from '@/utils/canvas';
import { DEFAULT_OPTION } from '@/constants';
import ClipComponent from '@/utils/clipComponent';
import $ from 'jquery';
var jsviews = require('jsviews')($);

const UserTrack = {
  _component: {},
  init(option) {
    ClipComponent.config = Object.assign({}, DEFAULT_OPTION, option);
    this._component = ClipComponent;
    this._parseTags();
    this._renderFeedbackModal();
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
  _renderFeedbackModal() {
    var RenderTemplate = jsviews.templates(require('@/templates/feedback.html'));
    document.body.append('<div id="feedback"></div>');
    RenderTemplate.link('#feedback', this._component);
    this._component.componentDidMount();
  }
};
window.UserTrack = UserTrack;
export default UserTrack;
