'use client'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Center, Input, VStack } from '@chakra-ui/react'
import useCreateRoom from '../_hooks/useCreateRoom'
import { useState } from 'react'
import Loading from '@/shared/components/loading'
import Heading from '@/shared/components/heading'
import ContentBox from '@/shared/components/content.box'

const Home = () => {
  const { roomInput, setMemberName, submit } = useCreateRoom()
  const [loading, setLoading] = useState(false)

  return (
    <>
      <Center>
        <VStack w="100%" height="400px" gap={8} justify="start" padding={4}>
          <Heading as="h1">将棋王</Heading>
          <ContentBox title="ゲームを始める">
            <VStack gap={8} align={'start'} padding={4}>
              <Field
                label="ニックネーム"
                required
                helperText="あなたは何と呼ばれたい？"
              >
                <Input
                  placeholder="例：ほげほげ太郎"
                  value={roomInput.memberName}
                  onChange={(e) => {
                    setMemberName(e.target.value)
                  }}
                />
              </Field>
              <Center w="100%">
                <Button
                  onClick={async () => {
                    setLoading(true)
                    await submit()
                    setLoading(false)
                  }}
                >
                  ルームを作成する
                </Button>
              </Center>
            </VStack>
          </ContentBox>
        </VStack>
      </Center>
      <Loading open={loading} />
    </>
  )
}

export default Home
