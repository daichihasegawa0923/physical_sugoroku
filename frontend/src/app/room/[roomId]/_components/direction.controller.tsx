import { MainLogic } from '@/game/logic/monos/main/main.logic';
import { useStatusContext } from '@/shared/components/status.provider';
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo';
import { Box, Button, HStack, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface Props {
  roomId: string;
}

function DirectionController ({ roomId }: Props) {
  const { status, activeMemberId } = useStatusContext();
  const { getByRoomId } = useLocalRoomInfo();
  const [canSwipe, setCanSwipe] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const info = getByRoomId(roomId);

  useEffect(() => {
    if (status === 'DIRECTION') return;
    if (canSwipe) {
      setCanSwipe(false);
    }
    if (isWatching) {
      setIsWatching(false);
    }
  }, [status, canSwipe, setCanSwipe, isWatching, setIsWatching]);

  if (status !== 'DIRECTION' || info?.myMemberId !== activeMemberId) {
    return null;
  }

  if (!canSwipe && !isWatching) {
    return (
      <Box
        position="absolute"
        w="100svw"
        h="100svh"
        top="0"
        left="0"
        padding={4}
      >
        <VStack h="100%" justifyContent="end">
          <HStack w="100%" h="max-content" justifyContent="center" padding={4}>
            <Button
              onClick={() => {
                setCanSwipe(() => true);
              }}
            >
              スワイプして飛ばす
            </Button>
            <Button
              onClick={() => {
                setIsWatching(true);
                MainLogic.get()?.watchGoal(() => { setIsWatching(false); });
              }}
            >
              王将の位置を確認する
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  }

  if (isWatching) return <Box position="absolute" w="100svw" h="100svh" />;

  return (
    <Box
      position="absolute"
      w="max-content"
      h="max-content"
      bottom="5%"
      left="50%"
      transform="translate(-50%, 0)"
    >
      <Button onClick={() => { setCanSwipe(() => false); }}>キャンセル</Button>
    </Box>
  );
}

export default DirectionController;
