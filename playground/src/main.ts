import { createApp, h } from '@mini-vue-phil/runtime-core'

const App = {
  setup() {
    return {
      message: 'phil',
    }
  },
  render(): any {
    return h('div', {}, [
      h('div', { class: 'red' }, '123456'),
      h('div', { class: 'green' }, '123456'),
    ])
  },
}

createApp(App).mount('#app')
