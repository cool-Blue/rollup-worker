/**
 * Created by cool.blue on 9/04/2017.
 */
import WebWorker from 'worker!./simpleWorker.js'
import shared from 'shared'

const hostPath = document.location.pathname.match(/(^.*\/)\w+\.html/)[1];

function log(msg) {
  // Use a fragment: browser will only render/reflow once.
  var fragment = document.createDocumentFragment();
  fragment.appendChild(document.createTextNode(msg));
  fragment.appendChild(document.createElement('br'));

  document.querySelector("#log").appendChild(fragment);
}

const webWorker = new WebWorker();

const routes = {
  message: function (m) {
    log(`"${m}" ${shared("Received in main")}`);
  },
  injected: function (m) {
    webWorker.postMessage({
      method: 'route',
      message: "injected"
    });
    this.message(m);
  }
};
webWorker.onmessage = function (e) {
  routes[e.data.method](e.data.message);
};

webWorker.postMessage({
  method: 'inject',
  message: document.location.protocol + '//' + document.location.host + hostPath
});
