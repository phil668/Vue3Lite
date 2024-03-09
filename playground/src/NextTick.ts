import { createApp, getCurrentInstance, h, nextTick, ref } from '@mini-vue-phil/vue'

const Child = {
  name: 'child',
  setup() {
    const count = ref(0)
    const instance = getCurrentInstance()

    async function handleClick() {
      for (let i = 0; i < 100; i++) {
        count.value = count.value + 1
        console.log('count.value', count.value)
      }
      if (instance)
        console.log('instance.vnode.el2', instance.vnode.el?.textContent)
      await nextTick()
      if (instance)
        console.log('instance.vnode.el', instance.vnode.el?.textContent)
    }
    return {
      count,
      handleClick,
    }
  },
  render() {
    return h('div', {}, [
      h('button', { onClick: this.handleClick }, 'click'),
      h('p', {}, `count:${this.count}`),
    ])
  },
}

const App = {
  name: 'app',
  setup() {

  },
  render() {
    return h('div', {}, [h(Child, {}, '')])
  },
}

createApp(App).mount('#app')
