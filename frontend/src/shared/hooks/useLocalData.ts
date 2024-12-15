export default function useLocalData () {
  function get<T> (key: string): T | null {
    if (typeof window === 'undefined') return null

    const json = localStorage?.getItem(key)
    if (!json) return null
    return JSON.parse(json) as T
  }

  function set<T> (key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data))
  }

  function remove (key: string): void {
    localStorage.removeItem(key)
  }

  return {
    get,
    set,
    remove
  }
}
