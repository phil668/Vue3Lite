import { h } from '@mini-vue-phil/vue'

const Foo = {
  name: 'Foo',
  setup(props, { emit }) {
    props.count++
    const handleClick = () => {
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
