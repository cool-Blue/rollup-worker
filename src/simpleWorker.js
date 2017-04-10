/**
 * Created by cool.blue on 9/04/2017.
 */
var test;
function message(m){
  self.postMessage({
    method: 'message',
    message: m
  })
}

function route(m){
  message(`"${m}" ${test("received in worker")}`)
}

var scripts = ['src/libs/require.js'];
function inject(baseURL){
  scripts.forEach(function(path){
    importScripts(baseURL + path);
    message(`${performance.now()}\tloaded:\t${baseURL + path}`)
  });
  require(['require', baseURL + 'src/common/bundle.js'], function(require, shared){
    test = shared;
    self.postMessage({
      method: 'injected',
      message: `${performance.now()}\tloaded:\t${baseURL}src/common/bundle.js`
    });
  });
}

self.onmessage = function (e) {
  let r = route, i = inject;
  self[e.data.method](e.data.message);
};

