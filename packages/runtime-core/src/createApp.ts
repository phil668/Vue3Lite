import { render } from './renderer'
import { createVnode } from './vnode'

function createApp(rootComponent: any) {
  return {
    mount(rootContainer: any) {
      // vnode
      if (typeof rootContainer === 'string')
        rootContainer = document.querySelector(rootContainer)
      console.log('rootContainer', rootContainer)
      const vnode = createVnode(rootComponent)
      render(vnode, rootContainer)
    },
  }
}

export { createApp }
