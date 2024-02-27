import { h, inject, provide } from '@mini-vue-phil/runtime-core'

const Counsumer = {
  name: 'Counsumer',
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    console.log('foo', { foo, bar })
    return { foo, bar }
  },
  render(): any {
    return h('div', {}, `Consumer: foo-${this.foo},bar-${this.bar}`)
  },
}

const Provider2 = {
  name: 'Provider2',
  setup() {
    // provide('foo', 'fooVal2')
    // provide('bar', 'barVal2')
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider2'), h(Counsumer)])
  },
}

const Provider = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooVal')
    provide('bar', 'barVal')
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider'), h(Provider2)])
  },
}

export default {
  name: 'App',
  setup() {},
  render(): any {
    return h('div', {}, [h('p', {}, 'App'), h(Provider)])
  },
}
