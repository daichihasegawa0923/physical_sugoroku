'use client'

import { WebsocketResolver } from '@/shared/function/websocket.resolver'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { Button, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Props {
  roomId: string
}

function Goal ({ roomId }: Props) {
  const [name, setName] = useState('')
  const [goalMemberId, setGoalMemberId] = useState('')
  const info = useLocalRoomInfo().getByRoomId(roomId)
  const router = useRouter()
  if (info == null) return

  useEffect(() => {
    WebsocketResolver.add('goal', {
      id: 'onComponent',
      func: (data) => {
        setName(() => data.goalMemberName)
        setGoalMemberId(() => data.goalMemberId)
      }
    })
  }, [])

  if (!name) return null

  return (
    <VStack
      position="absolute"
      bgColor="#fff"
      borderRadius="8px"
      top="100px"
      maxWidth="300px"
      minWidth="180px"
      left="50%"
      transform="translate(-50%)"
      padding="8px"
      zIndex={100}
    >
      <Text fontSize="24px" fontWeight="bold" textAlign="center">
        王手！！
      </Text>
      <Text textAlign="center">{name}の勝利</Text>
      {info.myMemberId === goalMemberId && (
        <Button
          onClick={async () => {
            await WebsocketResolver.sendSync('replay', { roomId }, (_) => {
              router.push(`/room/${roomId}/lobby`)
            })
          }}
        >
          もう一度遊ぶ
        </Button>
      )}
    </VStack>
  )
}

export default React.memo(Goal)
