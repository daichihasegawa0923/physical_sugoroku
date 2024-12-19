'use client'

import { useStatusInfo } from '@/shared/hooks/useStatusInfo'
import useTryJoin from '@/shared/hooks/useTryJoin'
import { useCommandContext } from '@/shared/components/command.provider'
import {
  Box,
  Button,
  createListCollection,
  Flex,
  Text,
  Heading,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  VStack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWebSocketContext } from '@/shared/function/websocket.context'

export default function Page ({ params }: { params: { roomId: string } }) {
  const { sendSync, add } = useWebSocketContext()
  const [stageClassName, setStageClassName] = useState(array[0].value)
  const { fetch, status, isHost } = useStatusInfo(params.roomId)
  const router = useRouter()
  const { setCommandText } = useCommandContext()
  useTryJoin(
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
    if (status && status.status !== 'WAITING') {
      router.push(`/room/${params.roomId}`)
    }
    add('startGame', (_) => {
      router.push(`/room/${params.roomId}`)
    });
    (async () => {
      await fetch()
    })()
  }, [status?.status])

  return (
    <VStack w="100%" maxW="540px" padding="8px" gap="16px" margin="0 auto">
      <Heading as="h1">待機室</Heading>
      <Flex
        position="relative"
        w="100%"
        gap="8px"
        borderRadius="8px"
        minH="64px"
        border="1px solid #000"
        padding="8px"
        alignItems="center"
      >
        <Box
          position="absolute"
          w="max-content"
          h="16px"
          top="0"
          bgColor="#fff"
          alignItems="center"
          transform="translate(0, -50%)"
          fontSize="11px"
          padding="0 8px"
        >
          <Text>参加メンバー</Text>
        </Box>
        {(status?.sequence ?? []).map((seq) => (
          <Box key={seq.memberId}>{seq.memberName}</Box>
        ))}
      </Flex>
      {isHost && (
        <VStack w="100%" gap="16px">
          <SelectRoot
            collection={list}
            defaultValue={['Stage1']}
            onValueChange={({ value }) => {
              setStageClassName(() => value[0])
            }}
          >
            <SelectLabel>遊ぶステージ</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Select movie" />
            </SelectTrigger>
            <SelectContent>
              {list.items.map((item) => (
                <SelectItem item={item} key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <Button
            onClick={async () => {
              await sendSync('startGame', {
                roomId: params.roomId,
                stageClassName
              })
            }}
          >
            開始する
          </Button>
        </VStack>
      )}
    </VStack>
  )
}

const array = [
  { label: 'Stage1|初心者向け', value: 'Stage1' },
  { label: 'Stage2|中級者向け', value: 'Stage2' },
  { label: '超ミニステージ', value: 'StageTest' }
]

const list = createListCollection({
  items: array
})
