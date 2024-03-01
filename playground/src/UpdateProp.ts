import { createApp, h, ref } from '@mini-vue-phil/vue'

const App = {
  name: 'App',
  setup() {
    const count = ref(1)

    const handleClick = () => {
      count.value = count.value + 1
    }

    const props = ref({
      foo: 'foo',
      bar: 'bar',
    })

    const changeProps = () => {
      props.value.foo = 'new-foo'
    }

    const changeProps2 = () => {
      props.value.foo = undefined
    }

    const changeProps3 = () => {
      props.value = {
        foo: 'foo',
      }
    }

    return {
      count,
      handleClick,
      changeProps,
      changeProps2,
      changeProps3,
      props,
    }
  },
  render(): any {
    return h('div', { foo: this.props.foo, bar: this.props.bar }, [h('p', { }, `Count - ${this.count}`), h('button', { onClick: this.handleClick }, 'add'), h('button', { onClick: this.changeProps }, 'changeProps'), h('button', { onClick: this.changeProps2 }, 'changeProps2'), h('button', { onClick: this.changeProps3 }, 'changeProps3')])
  },
}

createApp(App).mount('#app')
