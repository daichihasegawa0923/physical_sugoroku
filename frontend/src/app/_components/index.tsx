'use client'

import { Button } from '@/chakra/components/ui/button'
import { Field } from '@/chakra/components/ui/field'
import { Box, Center, Heading, Input, VStack } from '@chakra-ui/react'
import useCreateRoom from '../_hooks/useCreateRoom'
import { useState } from 'react'
import Loading from '@/shared/components/loading'

const Home = () => {
  const { roomInput, setMemberName, submit } = useCreateRoom()
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

export default Home
