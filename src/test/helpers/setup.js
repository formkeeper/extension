const EVENT_NAME = "on_badge_click";

class ChromeStub {
  constructor() {
    this._eventTarget = new EventTarget();
    this.runtime = {
      onMessage: {
        addListener: this._addListener.bind(this),
        removeListener: this._removeListener.bind(this),
      },
      getURL: function() {
        return "#";
      }
    };
  }

  _addListener(fn) {
    this._eventTarget.addEventListener.call(
      this._eventTarget,
      EVENT_NAME,
      fn
    );
  }

  _removeListener(fn) {
    this._eventTarget.removeEventListener.call(
      this._eventTarget,
      EVENT_NAME,
      fn
    );
  }

  async dispatchMessage(event, msg) {
    let evt = new Event(event);
    evt.data = msg;
    this._eventTarget.dispatchEvent(evt);
    return this;
  }
}


class Setup {
  static createChromeStub() {
    let chromeStub = null;

    if (window.chrome) {
      return;
    }

    chromeStub = new ChromeStub();
    window["chrome"] = chromeStub;

    return chromeStub;
  }
}

export default Setup;