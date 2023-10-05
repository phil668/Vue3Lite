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
          console.log('click', this.message)
        },
        onMousedown() {
          console.log('mouseDown')
        },
      }, this.message),
      h('div', { class: 'green' }, this.message),
      h(Foo, {
        count: 1,
        onAdd(a, b, c) {
          console.log('onAdd', a, b, c)
        },
        onAddFoo(a, b, c) {
          console.log('onAddFoo', a, b, c)
        },
      }),
    ])
  },
}
createApp(App).mount('#app')
