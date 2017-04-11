/**
 * Created by cool.blue on 11/04/2017.
 */
function message(m){
  self.postMessage({
    method: 'message',
    message: m
  })
}
function test(m){
  return m;
}

importScripts('https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js');

function route(m){
  message(`"${m}" ${test("received in worker")}`)
}
function inject(baseURL){
  self.postMessage({
    method: 'injected',
    message: `${performance.now()}\tloaded:\t${baseURL}src/common/bundle.js`
  });
}
self.onmessage = function (e) {
  var r = route, i = inject;
  self[e.data.method](e.data.message);
};
self.postMessage({
  method: 'ready',
  message: `${performance.now()}\tloaded:\tworker.js`
});
