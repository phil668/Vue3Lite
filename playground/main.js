const App = {
  setup() {
    return {
      message: 'phil',
    }
  },
  render() {
    return h('div', `hello${this.message}`)
  },
}

createApp(App).mount('#app')
