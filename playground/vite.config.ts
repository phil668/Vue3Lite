import { defineConfig } from 'vite'
import { resolve } from "path";

export default defineConfig({
    resolve: {
        alias: {
            '@mini-vue-phil/runtime-core': resolve(__dirname, '../packages/runtime-core/src/index.ts'),
            '@mini-vue-phil/runtime-dom': resolve(__dirname, '../packages/runtime-dom/src/index.ts'),
            '@mini-vue-phil/reactivity': resolve(__dirname, '../packages/reactivity/src/index.ts'),
            '@mini-vue-phil/vue': resolve(__dirname, '../packages/vue/src/index.ts')
        }
    }
})
