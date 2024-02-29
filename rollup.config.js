import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createRequire } from 'node:module'
import { defineConfig } from 'rollup'
import { dts } from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

if (!process.env.TARGET)
  throw new Error('process env target can not be undefined')

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const resolve = p => path.resolve(packageDir, p)

const pkg = require(resolve('package.json'))
const name = path.basename(packageDir)

export default defineConfig([
  {
    input: resolve('src/index.ts'),
    output: [{
      file: resolve(`dist/${name}.cjs.js`),
      format: 'cjs',
    },
    {
      file: resolve(`dist/${name}.esm.js`),
      format: 'esm',
    },
    ],
    plugins: [
      esbuild({
        tsconfig: resolve('tsconfig.json'),
      }),
    ],
    external: ['@mini-vue-phil/reactivity', '@mini-vue-phil/runtime-dom', '@mini-vue-phil/runtime-core', '@mini-vue-phil/shared'],
  },
  // {
  //   input: resolve('src/index.ts'),
  //   output: [
  //     {
  //       file: resolve(`dist/${name}.global.js`),
  //       format: 'iife',
  //       name,
  //     },
  //   ],
  //   plugins: [nodeResolve()],
  // },
  {
    input: resolve('src/index.ts'),
    output: [{
      file: resolve('dist/index.d.ts'),
      format: 'esm',
    }],
    plugins: [
      dts(),
    ],
  },
])
