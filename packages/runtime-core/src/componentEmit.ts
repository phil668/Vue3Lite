import type { ComponentInternalInstance } from './types'

function emit(instance: ComponentInternalInstance, event: string, ...args: any[]) {
  const { props } = instance
  // find corresponding event from props
  const eventName = convertEventName(event)
  const handler = (props as any)[eventName]
  handler && handler(...args)
}

/**
 * normalize event name
 * add -> onAdd
 * add-foo -> onAddFoo
 * @param str
 * @returns
 */
function convertEventName(str: string) {
  return `on${capitalize(camelize(str))}`
}

function camelize(str: string) {
  return str.replace(/-(\w)/g, (_: string, c: string) => {
    return c ? c.toUpperCase() : ''
  })
}

/**
 * capitalize the fisrt letter
 * @param str
 * @returns str
 */
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export { emit }
