import type { ComponentInternalInstance } from './types'

function initProps(instance: ComponentInternalInstance, rawProps: object) {
  instance.props = rawProps
}

export { initProps }
