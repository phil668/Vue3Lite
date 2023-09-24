import { createApp, h } from '@mini-vue-phil/runtime-core'

window.self = null
const App = {
  setup() {
    return {
      message: 'phil',
    }
  },
  render(): any {
    window.self = this
    // this.$el => 获取组件的根元素的dom
    return h('div', {}, [
      h('div', { class: 'red' }, this.message),
      h('div', { class: 'green' }, '123456'),
    ])
  },
}

createApp(App).mount('#app')

console.log(window.self.$el)
