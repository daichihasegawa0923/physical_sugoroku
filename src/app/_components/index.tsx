'use client'

import { Button } from '@/chakra/components/ui/button'
import { Field } from '@/chakra/components/ui/field'
import { StepperInput } from '@/chakra/components/ui/stepper-input'
import {
  Box,
  Center,
  Heading,
  Input,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  VStack,
  createListCollection
} from '@chakra-ui/react'
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
          <Heading as="h1">将棋王</Heading>
          <Heading as="h2">ルームを作成する</Heading>
          <Box
            w="100%"
            maxW="600px"
            padding={8}
            borderRadius={8}
            boxShadow="0px 1px 15px 0.1px"
            boxShadowColor={{ base: '#aaa', _dark: '#fff' }}
          >
            <VStack gap={8} align={'start'}>
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
              <Field label="参加人数" helperText="最大4人まで参加できます">
                <StepperInput
                  min={1}
                  max={4}
                  value={roomInput.memberCount.toString()}
                  onValueChange={(e) => {
                    setRoomInput({
                      ...roomInput,
                      memberCount: Number(e.value)
                    })
                  }}
                />
              </Field>
              <SelectRoot
                collection={list}
                defaultValue={['Stage1']}
                onValueChange={({ value }) => {
                  setRoomInput({ ...roomInput, stageClassName: value[0] })
                }}
              >
                <SelectLabel>ステージを選択する</SelectLabel>
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
          </Box>
        </VStack>
      </Center>
      <Loading open={loading} />
    </>
  )
}

const list = createListCollection({
  items: [
    { label: 'Stage1|初心者向け', value: 'Stage1' },
    { label: 'Stage2|中級者向け', value: 'Stage2' }
  ]
})

export default Home
