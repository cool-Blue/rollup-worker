/**
 * Created by cool.blue on 9/04/2017.
 */
let test;
function message(m){
  self.postMessage({
    method: 'message',
    message: m
  })
}
function timeStamp(ts){
    self.postMessage({
        method: 'timeStamp',
        message: ts
    })
}

function route(m) {
    message(`${m} ${test("received in worker")}`)
}

var inject = (function(imports, module) {

  const req = ['src/libs/require.js'];

  return function inject(baseURL) {

    let reqUrl = baseURL + req;
    let importsURL = imports.map(function (u) {
      return baseURL + u;
    });

    importScripts(reqUrl);
    timeStamp({t: performance.now(), m: `\tloaded:\t${reqUrl}`});

    require(['require'].concat(importsURL),
      function () {
        module.apply(this, Array.from(arguments).slice(1))
      });
  }
})(['src/common/bundle.js'], function (imports) {
  test = imports.default;
  imports.fmtNow();
  self.postMessage({
    method: 'injected',
    message: `${performance.now().fmt()}\tloaded:\tsrc/common/bundle.js`
  });
});

self.onmessage = function (e) {
  let r = route, i = inject;
  self[e.data.method](e.data.message);
};
self.postMessage({
    method: 'ready',
    message: {t: performance.now(), m: `\tloaded:\tsimpleWorker.js`}
});

