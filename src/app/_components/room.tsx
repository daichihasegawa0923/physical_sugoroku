import { Button } from '@/chakra/components/ui/button'
import { Box } from '@chakra-ui/react'

interface Props {
  roomName: string
  createdAt: string
}

const Room = ({ roomName, createdAt }: Props) => {
  return (
    <Box padding={8}>
      <Box>ルーム名：{roomName}</Box>
      <Box>作成日：{createdAt}</Box>
      <Button>参加する</Button>
    </Box>
  )
}
export default Room
