/**
 * Created by cool.blue on 2/04/2017.
 */
import bundleWorker from 'rollup-plugin-bundle-worker';

export default {
  entry: './src/index.js',
  format: 'umd',
  moduleName: 'test',
  dest: './build/bundle.js',
  globals: {
    shared: 'shared'
  },
  plugins: [
    bundleWorker(),
  ]
};