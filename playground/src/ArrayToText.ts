import { createApp, h, ref } from '@mini-vue-phil/vue'

const array = [h('p', {}, 'A'), h('p', {}, 'A')]

const text = 'text'

// const App = {
//   name: 'ArrayToText',
//   setup() {
//     const isChange = ref(false)

//     window.isChange = isChange

//     return {
//       isChange,
//     }
//   },
//   render(): any {
//     return h('div', {}, this.isChange ? text : array)
//   },
// }

// const App = {
//   name: 'TextToText',
//   setup() {
//     const isChange = ref(true)

//     window.isChange = isChange

//     return {
//       isChange,
//     }
//   },
//   render(): any {
//     return h('div', {}, this.isChange ? text : 'new Text')
//   },
// }

const App = {
  name: 'TextToArray',
  setup() {
    const isChange = ref(false)

    window.isChange = isChange

    return {
      isChange,
    }
  },
  render(): any {
    return h('div', {}, this.isChange ? array : text)
  },
}

createApp(App).mount('#app')
