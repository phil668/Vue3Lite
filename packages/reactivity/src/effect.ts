class ReactiveEffect<T = any> {
  private _fn: () => T;
  constructor(public fn: () => T) {
    this._fn = fn;
  }

  run() {
    this._fn();
  }
}

function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}

export { effect };
