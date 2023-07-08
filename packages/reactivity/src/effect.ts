/**
 * @desc 收集数据更新需要执行的函数
 * @param fn
 */
function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
  return _effect.run.bind(_effect)
}

let activeEffectFn: ReactiveEffect

class ReactiveEffect<T = any> {
  private _fn: () => T
  constructor(public fn: () => T) {
    this._fn = fn
  }

  run() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffectFn = this
    return this._fn()
  }
}

type TargetMap = Map<object, Map<string, Set<ReactiveEffect>>>
const targetMap: TargetMap = new Map()
/**
 * @desc 收集依赖
 * @param tagret
 * @param key
 */
function track<T extends object>(tagret: T, key: string) {
  let depsMap = targetMap.get(tagret)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(tagret, depsMap)
  }

  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  deps.add(activeEffectFn)
}

function trigger<T extends object>(target: T, key: string) {
  const depsMap = targetMap.get(target)
  if (!depsMap)
    return

  const deps = depsMap.get(key)
  if (!deps)
    return

  for (const fn of deps)
    fn.run()
}

export { effect, trigger, track }
