'use client'

import { useSequence } from '@/app/room/[roomId]/_hooks/useSequence'
import useTryJoin from '@/app/room/[roomId]/_hooks/useTryJoin'
import { useCommandContext } from '@/shared/components/command.provider'
import { Box, Heading, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'

export default function Page ({ params }: { params: { roomId: string } }) {
  const { fetch, sequence } = useSequence(params.roomId)
  const { setCommandText } = useCommandContext()
  const { tryReJoin } = useTryJoin(
    params.roomId,
    (data) => {
      if (!data.ok) {
        setCommandText('ルームに参加できませんでした。')
        return
      }
      fetch().then(() => {})
    },
    (data) => {
      if (data.ok) {
        setCommandText(data.memberName + 'さんがルームに参加しました！')
        fetch().then(() => {})
      }
    }
  )

  useEffect(() => {
    (async () => {
      await tryReJoin()
    })()
  }, [])

  return (
    <VStack>
      <Heading as="h1">参加中のメンバー</Heading>
      {sequence.sequence.map((seq) => (
        <Box key={seq.memberId}>{seq.memberName}</Box>
      ))}
    </VStack>
  )
}
