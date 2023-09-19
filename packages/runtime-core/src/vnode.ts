function createVnode(type: any, props?: any, children?: any) {
  return {
    type,
    props,
    children,
  }
}

export { createVnode }
