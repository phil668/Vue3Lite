import { createVnode } from './vnode'

function createAppApi(render: any) {
  return function createApp(rootComponent: any) {
    return {
      mount(rootContainer: string | HTMLElement) {
        let container: HTMLElement
        if (typeof rootContainer === 'string') {
          const el = document.querySelector(rootContainer) as HTMLElement
          if (!el)
            return
          container = el
        }
        else
          container = rootContainer
        const vnode = createVnode(rootComponent)
        render(vnode, container)
      },
    }
  }
}

export { createAppApi }
