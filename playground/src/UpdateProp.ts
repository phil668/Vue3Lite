import { h, ref } from '@mini-vue-phil/vue'

export default {
  name: 'App',
  setup() {
    const count = ref(1)

    const handleClick = () => {
      count.value = count.value + 1
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
