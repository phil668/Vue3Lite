function isObject(value: any) {
  return value !== null && typeof value === 'object'
}

function hasChanged(value: any, newValue: any) {
  return !Object.is(value, newValue)
}

export { isObject, hasChanged }
