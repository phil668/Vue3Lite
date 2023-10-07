import { h, renderSlots } from '@mini-vue-phil/runtime-core'

const Slot = {
  name: 'Slot',
  setup() {
  },
  render() {
    const age = 18
    return h('div', {
      class: 'slot-container',
    }, [renderSlots(this.$slots, 'header', { age: 18 }), h('div', {}, '1'), renderSlots(this.$slots, 'footer', { age: 18 })])
  },
}

export default Slot
