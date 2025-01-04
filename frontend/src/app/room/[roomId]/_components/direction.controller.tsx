import { MainLogic } from '@/game/logic/monos/main/main.logic';
import { useStatusContext } from '@/shared/components/status.provider';
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo';
import { Box, Button, HStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface Props {
  roomId: string;
}

function DirectionController ({ roomId }: Props) {
  const { status, activeMemberId } = useStatusContext();
  const { getByRoomId } = useLocalRoomInfo();
  const [isWatching, setIsWatching] = useState(false);
  const info = getByRoomId(roomId);

  useEffect(() => {
    if (status === 'DIRECTION') return;
    if (isWatching) {
      setIsWatching(false);
    }
  }, [status, isWatching, setIsWatching]);

  if (status !== 'DIRECTION' || info?.myMemberId !== activeMemberId) {
    return null;
  }

  if (!isWatching) {
    return (
      <Box
        position="absolute"
        w="max-content"
        h="max-content"
        bottom="5%"
        left="50%"
        transform="translate(-50%, 0)"
        padding={4}
      >
        <HStack w="100%" h="max-content" justifyContent="center" padding={4}>
          <Button
            onClick={() => {
              setIsWatching(true);
              MainLogic.get()?.watchGoal(() => {
                setIsWatching(false);
              });
            }}
          >
            王将の位置を確認する
          </Button>
        </HStack>
      </Box>
    );
  } else {
    return <Box position="absolute" w="100svw" h="100svh" />;
  }
}

export default DirectionController;
