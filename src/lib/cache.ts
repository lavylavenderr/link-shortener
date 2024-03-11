import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

function set<T>(key: string, value: T): boolean {
  return cache.set(key, value);
}

function get<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

function clear(): void {
  cache.flushAll();
}

export { set, get, clear };
