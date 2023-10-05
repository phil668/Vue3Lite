function isObject(value: any) {
  return value !== null && typeof value === 'object'
}

function hasChanged(value: any, newValue: any) {
  return !Object.is(value, newValue)
}

function isString(value: any) {
  return typeof value === 'string'
}

function isOn(key: string) {
  return /^on[A-Z]/.test(key)
}

function hasOwn(obj: object, key: string) {
  return isObject(obj) && Object.hasOwn.call(obj, obj, key)
}
export { isObject, hasChanged, isString, isOn, hasOwn }
export * from './shapeFlag'
