import { render } from './renderer'
import { createVnode } from './vnode'

function createApp(rootComponent: any) {
  return {
    mount(rootContainer: any) {
      // vnode
      const vnode = createVnode(rootComponent)
      render(vnode, rootContainer)
    },
  }
}

export { createApp }
