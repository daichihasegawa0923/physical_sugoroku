import useLocalData from '@/shared/hooks/useLocalData'

const key = 'user_name'

export function useLocalUserName () {
  const { get, set } = useLocalData()

  return {
    getName: () => get<string>(key) ?? '',
    setName: (value: string) => {
      set(key, value)
    }
  }
}
