import { h, renderSlots } from '@mini-vue-phil/runtime-core'

const Slot = {
  name: 'Slot',
  setup() {
  },
  render() {
    console.log(this.$slots)
    return h('div', {
      class: 'slot-container',
    }, [renderSlots(this.$slots, 'header'), h('div', {}, '1'), renderSlots(this.$slots, 'footer')])
  },
}

export default Slot
