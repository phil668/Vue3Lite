import { h } from '@mini-vue-phil/runtime-core'

const Foo = {
  name: 'Foo',
  setup(props) {
    props.count++
    console.log('props', props)
  },
  render() {
    return h('h1', {}, `foo ${this.count}`)
  },
}

export default Foo
