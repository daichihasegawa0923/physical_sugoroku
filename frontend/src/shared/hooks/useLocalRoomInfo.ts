import useLocalData from './useLocalData'

interface RoomJoinInfo {
  createdAt: Date
  roomId: string
  myMemberId: string
  myMemberName: string
}

const MAX = 10
const KEY_NAME = 'room'

export default function useLocalRoomInfo () {
  const { set: setLocal, get: getLocal } = useLocalData()

  function get () {
    return getLocal<RoomJoinInfo[]>(KEY_NAME) ?? []
  }

  function getByRoomId (roomId: string) {
    return get().find((r) => r.roomId === roomId)
  }

  function set (roomId: string, memberId: string, name: string) {
    const data = get()
    if (!!data && data.length >= MAX) {
      data
        .sort((d1, d2) => {
          return (
            new Date(d1.createdAt).getTime() - new Date(d2.createdAt).getTime()
          )
        })
        .shift()
    }
    setLocal<RoomJoinInfo[]>(KEY_NAME, [
      ...(data ?? []),
      {
        roomId,
        createdAt: new Date(),
        myMemberId: memberId,
        myMemberName: name
      }
    ])
  }

  return {
    set,
    getByRoomId
  }
}
