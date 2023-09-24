const publicPropsMap = {
  $el: (i: any) => i.vnode.el,
}

const publicInstanceHandler = {
  get({ _: instance }: { _: any }, key: string) {
    if (key in instance.setupState)
      return instance.setupState[key]

    const publicPropsGetter = (publicPropsMap as any)[key]
    if (publicPropsGetter)
      return publicPropsGetter(instance)
  },
}

export { publicInstanceHandler }
