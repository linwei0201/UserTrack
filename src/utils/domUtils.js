(function () {
  if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault = function () {
      this.returnValue = false;
    };
  }
  if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation = function () {
      this.cancelBubble = true;
    };
  }
  if (!Element.prototype.addEventListener) {
    const eventListeners = [];

    const addEventListener = function (type, listener) {
      const self = this;

      const wrapper = function (e) {
        e.target = e.srcElement;
        e.currentTarget = self;
        if (typeof listener.handleEvent !== undefined) {
          listener.handleEvent(e);
        } else {
          listener.call(self, e);
        }
      };

      if (type === 'DOMContentLoaded') {
        const wrapper2 = function (e) {
          if (document.readyState === 'complete') {
            wrapper(e);
          }
        };

        document.attachEvent('onreadystatechange', wrapper2);
        eventListeners.push({object: this, type, listener, wrapper: wrapper2});

        if (document.readyState === 'complete') {
          const e = new Event();

          e.srcElement = window;
          wrapper2(e);
        }
      } else {
        this.attachEvent(`on${type}`, wrapper);
        eventListeners.push({object: this, type, listener, wrapper});
      }
    };

    const removeEventListener = function (type, listener) {
      let counter = 0;

      while (counter < eventListeners.length) {
        const eventListener = eventListeners[counter];

        if (eventListener.object === this && eventListener.type === type && eventListener.listener === listener) {
          if (type === 'DOMContentLoaded') {
            this.detachEvent('onreadystatechange', eventListener.wrapper);
          } else {
            this.detachEvent(`on${type}`, eventListener.wrapper);
          }
          eventListeners.splice(counter, 1);
          break;
        }
        ++counter;
      }
    };

    Element.prototype.addEventListener = addEventListener;
    Element.prototype.removeEventListener = removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener = addEventListener;
      HTMLDocument.prototype.removeEventListener = removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener = addEventListener;
      Window.prototype.removeEventListener = removeEventListener;
    }
  }
})();
