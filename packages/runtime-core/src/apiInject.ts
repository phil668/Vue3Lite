import { getCurrentInstance } from '.'

function provide(key: string, value: unknown) {
  const instance = getCurrentInstance()
  if (!instance)
    return

  const provides: any = instance.provides

  provides[key] = value
}

function inject(key: string) {
  const instance = getCurrentInstance()
  if (!instance)
    return

  const parentProvides = instance.parent?.provides

  if (parentProvides)
    return parentProvides[key]
}

export { provide, inject }
