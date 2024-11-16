'use client'

import { Button } from '@/chakra/components/ui/button'
import { Checkbox } from '@/chakra/components/ui/checkbox'
import { Field } from '@/chakra/components/ui/field'
import { StepperInput } from '@/chakra/components/ui/stepper-input'
import { Box, Center, Heading, Input, Tabs, VStack } from '@chakra-ui/react'
import Room from './room'
import useCreateRoom from '../_hooks/useCreateRoom'
import { useState } from 'react'
import Loading from '@/shared/components/loading'

const Home = () => {
  const { roomInput, setRoomInput, submit } = useCreateRoom()
  const [loading, setLoading] = useState(false)

  return (
    <>
      <Center>
        <VStack w="100%" height="400px" gap={8} justify="start" padding={4}>
          <Heading>バカすごろく</Heading>
          <Box
            w="100%"
            maxW="600px"
            padding={8}
            borderRadius={8}
            boxShadow="0px 1px 15px 0.1px"
            boxShadowColor={{ base: '#aaa', _dark: '#fff' }}
          >
            <Tabs.Root defaultValue="create_room" variant="outline">
              <Tabs.List>
                <Tabs.Trigger value="create_room">
                  ルームを作成する
                </Tabs.Trigger>
                <Tabs.Trigger value="search_room">ルームを探す</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="create_room">
                <VStack gap={8} align={'start'}>
                  <Field
                    label="ルーム名"
                    required
                    helperText="部屋名は他の人が部屋を探す際に使用します"
                  >
                    <Input
                      placeholder="例：ほげほげ部屋"
                      value={roomInput.roomName}
                      onChange={(e) => {
                        setRoomInput({
                          ...roomInput,
                          roomName: e.target.value
                        })
                      }}
                    />
                  </Field>
                  <Field
                    label="ニックネーム"
                    required
                    helperText="あなたは何と呼ばれたい？"
                  >
                    <Input
                      placeholder="例：ほげほげ太郎"
                      value={roomInput.memberName}
                      onChange={(e) => {
                        setRoomInput({
                          ...roomInput,
                          memberName: e.target.value
                        })
                      }}
                    />
                  </Field>
                  <Field label="参加人数" helperText="最大6人まで参加できます">
                    <StepperInput
                      min={1}
                      max={6}
                      value={roomInput.memberCount.toString()}
                      onValueChange={(e) => {
                        setRoomInput({
                          ...roomInput,
                          memberCount: Number(e.value)
                        })
                      }}
                    />
                  </Field>
                  <Checkbox
                    value={roomInput.public ? 'on' : 'off'}
                    onCheckedChange={(e) => {
                      const isPublic =
                        typeof e.checked !== 'boolean' ? false : e.checked
                      setRoomInput({ ...roomInput, public: isPublic })
                    }}
                  >
                    公開する
                  </Checkbox>
                  <Center w="100%">
                    <Button
                      onClick={async () => {
                        setLoading(true)
                        await submit()
                        setLoading(false)
                      }}
                    >
                      作成する
                    </Button>
                  </Center>
                </VStack>
              </Tabs.Content>
              <Tabs.Content value="search_room">
                <Box h="300px" w="100%" overflow="scroll">
                  <Room roomName="ああ部屋" createdAt="2024/10/10" />
                  <Room roomName="ああ部屋" createdAt="2024/10/10" />
                  <Room roomName="ああ部屋" createdAt="2024/10/10" />
                </Box>
              </Tabs.Content>
            </Tabs.Root>
          </Box>
        </VStack>
      </Center>
      <Loading open={loading} />
    </>
  )
}

export default Home
