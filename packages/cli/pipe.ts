export function pipe<T>(item: T, ...fns: Function[]) {
  return fns.reduce((prev, fn) => fn(prev), item);
}
