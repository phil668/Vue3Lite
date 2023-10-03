function isObject(value: any) {
  return value !== null && typeof value === 'object'
}

function hasChanged(value: any, newValue: any) {
  return !Object.is(value, newValue)
}

function isString(value: any) {
  return typeof value === 'string'
}

export { isObject, hasChanged, isString }
export * from './shapeFlag'
