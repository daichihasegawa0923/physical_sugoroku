import Joystick from '@/app/room/[roomId]/_components/joystick';
import { MainLogic } from '@/game/logic/monos/main/main.logic';
import { useStatusContext } from '@/shared/components/status.provider';
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo';
import { Box, Button, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface Props {
  roomId: string;
  onMove: (x: number, y: number, maxVector: number) => void;
  onLeave: (x: number, y: number, maxVector: number) => void;
}

function DirectionController ({ roomId, onMove, onLeave }: Props) {
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
      <>
        <Box position="absolute" top="10%" right="1%">
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
        </Box>
        <VStack
          position="absolute"
          w="max-content"
          h="max-content"
          bottom="5%"
          left="50%"
          transform="translate(-50%, 0)"
          padding={4}
        >
          <Joystick
            size={100}
            joyStickColor="white"
            onMove={onMove}
            onLeave={onLeave}
          />
        </VStack>
      </>
    );
  } else {
    return <Box position="absolute" w="100svw" h="100svh" />;
  }
}

export default DirectionController;
