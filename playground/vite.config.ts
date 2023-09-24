import { defineConfig } from 'vite'
import { resolve } from "path";

export default defineConfig({
    resolve: {
        alias: {
            '@mini-vue-phil/runtime-core': resolve(__dirname, '../packages/runtime-core/src/index.ts')
        }
    }
})
