import resolve from 'rollup-plugin-node-resolve'
import common from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import {terser} from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'

const config = {
  input: 'index.ts',
  external: ['ali-oss', 'fs-extra', 'path', 'ora', 'glob', 'ali-oss'],
  output: {
    format: 'cjs',
    exports: 'auto',
    name: 'OssManager',
  },
  plugins: [resolve(), common(), json(), typescript(), terser({compress: {drop_console: true}})],
}

export default config
