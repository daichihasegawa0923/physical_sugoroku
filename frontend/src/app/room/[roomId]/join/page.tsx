'use client'

import useJoin from '@/app/room/[roomId]/join/_hooks/useJoin'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import ContentBox from '@/shared/components/content.box'
import { Box, Input, Text, VStack } from '@chakra-ui/react'

export default function Page ({
  params: { roomId }
}: {
  params: { roomId: string }
}) {
  const { name, setName, error, onClick } = useJoin(roomId)

  return (
    <Box padding={4}>
      <ContentBox title="参加する">
        <VStack gap={8}>
          <Field label="ニックネーム" w={64} required>
            {error && <Text color="red">{error}</Text>}
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
              minLength={1}
              maxLength={10}
            />
          </Field>
          <Button disabled={!name} type="submit" w={32} onClick={onClick}>
            参加する
          </Button>
        </VStack>
      </ContentBox>
    </Box>
  )
}
