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

export { isObject, hasChanged, isString, isOn }
export * from './shapeFlag'
