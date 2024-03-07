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

// const App = {
//   name: 'TextToArray',
//   setup() {
//     const isChange = ref(false)

//     window.isChange = isChange

//     return {
//       isChange,
//     }
//   },
//   render(): any {
//     return h('div', {}, this.isChange ? array : text)
//   },
// }

// 左侧对比
// const prevChilldren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C'),
// ]

// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'D' }, 'D'),
//   h('p', { key: 'E' }, 'E'),
// ]

// 右侧对比
// const prevChilldren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C'),
// ]

// const nextChildren = [
//   h('p', { key: 'D' }, 'D'),
//   h('p', { key: 'E' }, 'E'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C'),
// ]

// 新的比老的多右侧
// const prevChilldren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
// ]

// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C'),
//   h('p', { key: 'D' }, 'D'),
// ]

// 新的比老的多 - 左侧
// const prevChilldren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
// ]

// const nextChildren = [
//   h('p', { key: 'C' }, 'C'),
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
// ]

// 老的比新的多 - 右侧
// e1 -> 2
// e2 -> 1
// i -> 2
// const prevChilldren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C'),
// ]

// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
// ]

// 老的比新的多 - 左侧
// e1 -> 2
// e2 -> 1
// i -> 2
// const prevChilldren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
//   h('p', { key: 'C' }, 'C'),
// ]

// const nextChildren = [
//   h('p', { key: 'A' }, 'A'),
//   h('p', { key: 'B' }, 'B'),
// ]

// 更新中间
// ab ced f
// ab dceg f
const prevChilldren = [
  h('p', { key: 'A' }, 'A'),
  h('p', { key: 'B' }, 'B'),
  h('p', { key: 'C' }, 'C'),
  h('p', { key: 'E' }, 'E'),
  h('p', { key: 'D' }, 'D'),
  h('p', { key: 'F' }, 'F'),
]

const nextChildren = [
  h('p', { key: 'A' }, 'A'),
  h('p', { key: 'B' }, 'B'),
  h('p', { key: 'D' }, 'D'),
  h('p', { key: 'C' }, 'C'),
  h('p', { key: 'E' }, 'E'),
  h('p', { key: 'G' }, 'G'),
  h('p', { key: 'F' }, 'F'),
]

const App = {
  name: 'ArrayToArray',
  setup() {
    const isChange = ref(false)

    window.isChange = isChange

    return {
      isChange,
    }
  },
  render(): any {
    return h('div', {}, this.isChange ? nextChildren : prevChilldren)
  },
}

createApp(App).mount('#app')
