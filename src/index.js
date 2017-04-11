/**
 * Created by cool.blue on 9/04/2017.
 */
import WebWorker from 'worker!./simpleWorker.js'
// import WebWorker from 'worker!./worker.js'
import {default as shared, fmtNow} from 'shared'
fmtNow();
const hostPath = document.location.pathname.match(/(^.*\/)\w+\.html/)[1];

function log(msg) {
  // Use a fragment: browser will only render/reflow once.
  var fragment = document.createDocumentFragment();
  fragment.appendChild(document.createTextNode(msg));
  fragment.appendChild(document.createElement('br'));

  document.querySelector("#log").appendChild(fragment);
}

const webWorker = new WebWorker();
// const webWorker = new Worker('src/simpleWorker.js');

log(`${performance.now().fmt()}\tBuilt in main`);

const routes = {
    message: function (m) {
        log(`${m} ${shared("Received in main")}`);
    },
    timeStamp: function (m) {
        this.message(`${m.t.fmt()}\t${m.m}`)
    },
    injected: function (m) {
        webWorker.postMessage({
            method: 'route',
            message: `${performance.now().fmt()}\tinjected`
        });
        this.message(m);
    },
    ready: function (m) {
        log(`${performance.now().fmt()}\tready:\tsimpleWorker.js`);
        webWorker.postMessage({
            method: 'inject',
            message: document.location.protocol + '//' + document.location.host + hostPath
        });
        this.timeStamp(m);
    }
};

webWorker.onmessage = function (e) {
  routes[e.data.method](e.data.message);
};

log(`${performance.now().fmt()}\tPosted in main`);
