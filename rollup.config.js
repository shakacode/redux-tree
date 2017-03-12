import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/index.js',
  format: 'cjs',
  dest: 'lib/index.js',
  external: ['immutable'],
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    resolve({ main: true }),
  ],
};
