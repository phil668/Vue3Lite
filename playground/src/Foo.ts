import { h } from '@mini-vue-phil/runtime-core'

const Foo = {
  name: 'Foo',
  setup(props, { emit }) {
    props.count++
    const handleClick = () => {
      console.log('handleCLick')
      // console.log('emit', emit)
      // emit('add', 1, 2, 3, 4)
      emit('add-foo', 1, 2, 3, 4)
    }
    return { handleClick }
  },
  render() {
    return h('h1', {
      onClick: this.handleClick,
    }, `foo ${this.count}`)
  },
}

export default Foo
