function createVnode(type, props?, children?) {
  return {
    type,
    props,
    children,
  }
}

export { createVnode }
