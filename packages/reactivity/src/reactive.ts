function reactive<T extends object>(raw: T): T {
  return new Proxy(raw, {
    get(target, key) {
      const value = Reflect.get(target, key);
      // TODO 依赖追踪
      return value;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);
      // TODO 触发依赖
      return res;
    },
  });
}

export { reactive };
