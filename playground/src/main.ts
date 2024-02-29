import { createApp, h, ref } from '@mini-vue-phil/vue'

const App = {
  name: 'App',
  setup() {
    const count = ref(1)

    const handleClick = () => {
      count.value = count.value + 1
      console.log('count.value', count.value)
    }

    return {
      count,
      handleClick,
    }
  },
  render(): any {
    return h('div', {}, [h('p', {}, `Count - ${this.count}`), h('button', { onClick: this.handleClick }, 'add')])
  },
}

createApp(App).mount('#app')
