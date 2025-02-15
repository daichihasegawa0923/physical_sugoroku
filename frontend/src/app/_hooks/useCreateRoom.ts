'use client'

import { WebsocketResolver } from '@/shared/function/websocket.resolver'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { useLocalUserName } from '@/shared/hooks/useLocalUserName'
import { useRouter } from 'next/navigation'
import { type InputFromNameOmitName } from 'physical-sugoroku-common/src/event'
import { useState } from 'react'

export default function useCreateRoom () {
  const { getName, setName } = useLocalUserName()
  const [roomInput, setRoomInput] = useState<
  InputFromNameOmitName<'createRoom'>
  >({
    memberName: getName() || ''
  })
  const router = useRouter()
  const { set } = useLocalRoomInfo()

  return {
    roomInput,
    setRoomInput,
    setMemberName: (name: string) => {
      setRoomInput((prev) => {
        setName(name)
        return { ...prev, memberName: name }
      })
    },
    submit: async () => {
      await WebsocketResolver.sendSync('createRoom', roomInput, (data) => {
        router.push(`/room/${data.roomId}/lobby`)
        set(data.roomId, data.memberId, roomInput.memberName)
      })
    }
  }
}
