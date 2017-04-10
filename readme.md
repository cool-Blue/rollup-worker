# Natural workflow to web workify _and_ share code, with rollup
rollup-plugin-bundle-worker does a great job of shimming web workers into a rollup bundle, this example shows how to extend it to allow `importScripts` statements inside the web worker and to share code between the main bundle and the web worker.

## Motivation
The serialise/de-serialise processes for transferring objects to and from web workers is the same in both domains, so this is a natural use case but generally speaking, the UMD bundle for shared code can be consumed in both domains.
The main problem in doing this is that rollup-plugin-bundle-worker materialises the worker as a blob URL and when `importScripts` is called from such a domain, it will resolve the file URLs accordingly and the loads will fail.  This example is one solution to that problem.

## Basic architecture
The code is divided into two UMD bundles: the main bundle, which contains the purely web worker code as well as the main app; and the shared bundle, which contains common code.  It's exactly the same bundle for both so is cached and loaded only once.
In order to re-base the URLs for the `importScripts` statements in the worker, it needs the app, base URL.  This is posted to the worker by the app as an initialisation step.  In response, the worker uses the base URL to load `requirejs` from the server, which it then uses to asynchronously load the shared bundle.
After the shared code is loaded, the worker posts back to the main app to signal it's readiness.

The shared code is written as ES2015 modules and rolled up into a UMD bundle, so there is a seperate build step for that that must be done in the src/common directory.  The main bundle is then built from the project root in a separate step.  It consumes the common bundle, as a global object, with an ES2015 `import` statement and the web worker code, which is not an ES2015 module.  The build steps are chained in the package.json build script.