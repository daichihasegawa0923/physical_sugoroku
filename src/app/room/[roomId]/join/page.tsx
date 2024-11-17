'use client'

import useJoin from '@/app/room/[roomId]/join/_hooks/useJoin'
import { Button } from '@/chakra/components/ui/button'
import { Field } from '@/chakra/components/ui/field'
import { Input, Text, VStack } from '@chakra-ui/react'

export default function Page ({
  params: { roomId }
}: {
  params: { roomId: string }
}) {
  const { name, setName, error, onClick } = useJoin(roomId)

  return (
    <VStack padding={8} gap={8}>
      <Field label="ニックネーム" w={64}>
        {error && <Text color="red">{error}</Text>}
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </Field>
      <Button type="submit" w={32} onClick={onClick}>
        参加する
      </Button>
    </VStack>
  )
}
