import {WeakMapExt} from "map-ext";

const wrapInWeakRef = <T extends object>(t: T) => new WeakRef(t);

export class WeakRefMap<K, V extends object> implements Map<K, V> {
  readonly #wk = new WeakMapExt<V, WeakRef<V>>(wrapInWeakRef);
  readonly #map: Map<K, WeakRef<V>>;

  constructor(values?: readonly [K, V][]) {
    this.#map = new Map<K, WeakRef<V>>();

    if (values) for (const [key, value] of values) this.set(key, value);
  }

  set(key: K, value: V): this {
    if (typeof value === 'object' && value) this.#map.set(key, this.#wk.get(value));
    return this;
  }

  get(key: K): V|undefined {
    const wk = this.#map.get(key);
    const ref = wk?.deref();
    // reference gone
    if (!ref && wk) {
      this.#map.delete(key);
    }
    return ref;
  }

  readonly [Symbol.toStringTag]: string;

  get size(): number {
    let i = 0;
    for (const _ of this) i++;
    return i;
  }

  * [Symbol.iterator](): IterableIterator<[K, V]> {
    for (const [key, weak] of this.#map) {
      const deref = weak.deref();
      if (deref) yield [key, deref];
    }
  }

  clear(): void {
    this.#map.clear();
  }

  delete(key: K): boolean {
    return this.#map.delete(key);
  }

  * entries(): IterableIterator<[K, V]> {
    for (const [key, value] of this) {
      yield [key, value]
    }
  }

  forEach(fn: (value: V, key: K, map: WeakRefMap<K, V>) => void, thisArg?: any): void {
    // first copy all in an array, so adding and deleting within the handler won't affect the for each, like a typical array
    [...this].forEach(([k, v]) => {
      if (thisArg) {
        fn.call(this, v, k, this);
      } else {
        fn(v, k, this)
      }
    });
  }

  has(key: K): boolean {
    this.#map.has(key);
    return false;
  }

  // no keys in a set, always return value
  * keys(): IterableIterator<K> {
    for (const [key] of this) yield key;
  }

  * values(): IterableIterator<V> {
    for (const [, value] of this) yield value;
  }

}