'use client'

import { WebSocketContext } from '@/shared/function/websocket.context'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'

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
  const { send, addCb } = useContext(WebSocketContext)

  useEffect(() => {
    addCb<RoomCreateResult>('createRoom', (data) => {
      router.push(`/room/${data.roomId}`)
    })
  }, [])

  return {
    roomInput,
    setRoomInput,
    submit: async () => {
      await send({ name: 'createRoom', ...roomInput })
    }
  }
}
