import type { CompInstance } from './types'

function initProps(instance: CompInstance, rawProps: object) {
  instance.props = rawProps
}

export { initProps }
