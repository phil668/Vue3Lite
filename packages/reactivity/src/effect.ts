type TargetMap = Map<object, Map<string, Set<ReactiveEffect>>>

type Fn = (...args: any[]) => void | any

interface EffectOptions {
  scheduler?: Fn
  onStop?: Fn
}

interface Runner {
  (): any
  effect?: ReactiveEffect
}

let activeEffectFn: ReactiveEffect
let shouldTrack: boolean

/**
 * @desc 收集数据更新需要执行的函数
 * @param fn
 */
function effect<T = any>(fn: () => T, options?: EffectOptions) {
  const _effect = new ReactiveEffect(fn, options)
  _effect.run()
  const runner: Runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

class ReactiveEffect<T = any> {
  private _fn: () => T
  public deps: (Set<ReactiveEffect>)[] = []
  private active = true
  public scheduler?: Fn | undefined
  public onStop?: Fn | undefined
  constructor(public fn: () => T, options?: EffectOptions) {
    this._fn = fn
    if (options?.scheduler)
      this.scheduler = options.scheduler
    if (options?.onStop)
      this.onStop = options.onStop
  }

  run() {
    if (!this.active)
      return this._fn()

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffectFn = this
    shouldTrack = true
    const result = this._fn()
    shouldTrack = false
    return result
  }

  stop() {
    if (this.active) {
      cleanUp(this)
      this.active = false
    }
    this.onStop && this.onStop()
  }
}

function cleanUp(effect: ReactiveEffect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })
}

const targetMap: TargetMap = new Map()
/**
 * @desc 收集依赖
 * @param tagret
 * @param key
 */
function track<T extends object>(tagret: T, key: string) {
  if (!shouldTrack)
    return
  if (!activeEffectFn)
    return
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
  activeEffectFn.deps.push(deps)
}

/**
 * @desc 触发依赖
 * @param target
 * @param key
 * @returns
 */
function trigger<T extends object>(target: T, key: string) {
  const depsMap = targetMap.get(target)
  if (!depsMap)
    return

  const deps = depsMap.get(key)
  if (!deps)
    return

  for (const fn of deps) {
    if (fn.scheduler)
      fn.scheduler()

    else
      fn.run()
  }
}

function stop(runner: Runner) {
  runner.effect?.stop()
}

export { effect, trigger, track, stop }
