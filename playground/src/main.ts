import { createApp, h } from '@mini-vue-phil/runtime-core'
import Slot from './Slot'

const App = {
  name: 'App',
  setup() {
    return {
      message: 'phil',
    }
  },
  render(): any {
    // this.$el => 获取组件的根元素的dom
    return h('div', { class: 'app' },
      [
      // h('div', {
      //   class: 'red',
      //   onClick() {
      //     console.log('click', this.message)
      //   },
      //   onMousedown() {
      //     console.log('mouseDown')
      //   },
      // }, this.message),
      // h('div', { class: 'green' }, this.message),
      // h(Foo, {
      //   count: 1,
      //   onAdd(a, b, c) {
      //     console.log('onAdd', a, b, c)
      //   },
      //   onAddFoo(a, b, c) {
      //     console.log('onAddFoo', a, b, c)
      //   },
      // }),
      // h(Slot, {}, [h('p', {}, 'slot children'), h('p', {}, 'another slot children')]),
        h(Slot, {}, {
          header: h('p', {}, 'slot children header'),
          footer: h('p', {}, 'slot children footer'),
        }),
      ],
    )
  },
}

createApp(App).mount('#app')
