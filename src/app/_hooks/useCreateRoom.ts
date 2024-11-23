'use client'

import { useWebSocketContext } from '@/shared/function/websocket.context'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface RoomCreateResult {
  roomId: string
  memberId: string
}

interface RoomCreateInput {
  roomName: string
  memberName: string
  public: boolean
  memberCount: number
}

export default function useCreateRoom () {
  const [roomInput, setRoomInput] = useState<RoomCreateInput>({
    roomName: '',
    memberName: '',
    public: false,
    memberCount: 1
  })
  const router = useRouter()
  const { sendSync } = useWebSocketContext()
  const { set } = useLocalRoomInfo()

  return {
    roomInput,
    setRoomInput,
    submit: async () => {
      await sendSync<RoomCreateInput, RoomCreateResult>(
        'createRoom',
        roomInput,
        (data) => {
          router.push(`/room/${data.roomId}`)
          set(data.roomId, data.memberId, roomInput.memberName)
        }
      )
    }
  }
}
