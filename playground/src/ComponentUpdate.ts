// 在 render 中使用 proxy 调用 emit 函数
// 也可以直接使用 this
// 验证 proxy 的实现逻辑
import { createApp, h, ref } from '@mini-vue-phil/vue'

const Child = {
  name: 'Child',
  setup(props, { emit }) {},
  render(proxy) {
    return h('div', {}, [h('div', {}, `child${this.$props.msg}`)])
  },
}

const App = {
  name: 'App',
  setup() {
    const msg = ref('123')
    window.msg = msg

    const changeChildProps = () => {
      msg.value = '123'
    }

    return { msg, changeChildProps }
  },

  render() {
    return h('div', {}, [
      h('div', {}, '你好'),
      h(
        'button',
        {
          onClick: this.changeChildProps,
        },
        'change child props',
      ),
      h(Child, {
        msg: this.msg,
      }),
    ])
  },
}

createApp(App).mount('#app')
