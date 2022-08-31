/*  eslint-env node */
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import postcssLit from 'rollup-plugin-postcss-lit';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';

const IS_DEV = process.env.ROLLUP_WATCH;

const serverOptions = {
  contentBase: ['.'],
  host: 'localhost',
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

export default {
  input: 'src/shutter-row.js',
  output: {
    dir: '.',
    format: 'es',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    json(),
    postcss({
      plugins: [
        postcssPresetEnv({
          stage: 1,
          features: {
            'nesting-rules': true,
          },
        }),
      ],
      extract: false,
    }),
    postcssLit(),
    IS_DEV && serve(serverOptions),
    !IS_DEV &&
      terser({
        output: {
          comments: false,
        },
      }),
  ],
};