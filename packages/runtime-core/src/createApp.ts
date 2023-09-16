import { render } from './renderer'
import { createVnode } from './vnode'

function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // vnode
      const vnode = createVnode(rootComponent)
      render(vnode, rootContainer)
    },
  }
}
