export const randomLenNum = (length = 4) => {
  const str = (Math.random() * Math.pow(10, length)).toFixed(0);
  const fillZero = new Array(length - str.length).fill("0").join("");
  return Number(fillZero + str);
};

export const uniqueNum = (arr: number[], length = 4): number => {
  const num = randomLenNum(length);
  if (arr.includes[num]) return uniqueNum(arr, length);
  return num;
};

export class GMap<K, V> extends Map<K, V> {
  static array<Key, Value>(map: GMap<Key, Value> | Map<Key, Value>) {
    return Array.from(map);
  }
  getkeys() {
    return Array.from(this).map(([k]) => k);
  }
  getValues() {
    return Array.from(this).map(([, v]) => v);
  }
  getEntries() {
    return Array.from(this);
  }
  map<R>(fn: (v: V, k: K, i: number) => R): R[] {
    return Array.from(this).map(([k, v], i) => fn(v, k, i));
  }
  filter(fn: (m: V) => boolean) {
    const arr: V[] = [];
    this.forEach(m => {
      if (fn(m)) arr.push(m);
    });
    return arr;
  }
}
