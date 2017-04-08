import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

const { BUILD_TARGET } = process.env;

if (!BUILD_TARGET) {
  throw new Error('Specify build target via BUILD_TARGET environment variable.');
}

export default {
  entry: 'src/index.js',
  format: BUILD_TARGET,
  dest: `lib/redux-tree.${BUILD_TARGET}.js`,
  moduleName: 'ReduxTree',
  external: ['immutable'],
  globals: { immutable: 'Immutable' },
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    resolve(),
  ],
};
