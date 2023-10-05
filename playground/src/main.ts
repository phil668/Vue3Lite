import { createApp, h } from '@mini-vue-phil/runtime-core'
import Foo from './Foo'

const App = {
  name: 'App',
  setup() {
    return {
      message: 'phil',
    }
  },
  render(): any {
    // this.$el => 获取组件的根元素的dom
    return h('div', {}, [
      h('div', {
        class: 'red',
        onClick() {
          console.log('click')
        },
        onMousedown() {
          console.log('mouseDown')
        },
      }, this.message),
      h('div', { class: 'green' }, '123456'),
      h(Foo, { count: 1 }),
    ])
  },
}
createApp(App).mount('#app')
