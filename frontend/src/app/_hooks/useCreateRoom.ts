'use client'

import { useWebSocketContext } from '@/shared/function/websocket.context'
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
    roomName: '',
    memberName: getName() || '',
    public: false,
    memberCount: 1,
    stageClassName: 'Stage1'
  })
  const router = useRouter()
  const { sendSync } = useWebSocketContext()
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
      await sendSync('createRoom', roomInput, (data) => {
        router.push(`/room/${data.roomId}`)
        set(data.roomId, data.memberId, roomInput.memberName)
      })
    }
  }
}
