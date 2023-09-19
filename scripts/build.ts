import * as fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { execa } from 'execa'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function run() {
  const targets = await getAllTargets()
  console.log('targets', targets)
  for (const target of targets)
    await build(target)
}

async function build(target: string) {
  await execa('rollup', [
    '-c',
    '--environment',
    [
        `TARGET:${target}`,
    ].join(','),
  ],
  { stdio: 'inherit' })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()

function getAllTargets() {
  return fs.readdir(resolve(__dirname, '../packages'))
}
