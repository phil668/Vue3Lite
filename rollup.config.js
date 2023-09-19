import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createRequire } from 'node:module'
import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
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
    {
      file: resolve(`dist/${name}.global.js`),
      format: 'iife',
      name: 'miniVue',
    },
    ],
    plugins: [
      nodeResolve(),
      esbuild({
        tsconfig: resolve('tsconfig.json'),
      }),
    ],
  },
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
