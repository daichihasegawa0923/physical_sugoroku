'use client';

import ContentBox from '@/shared/components/content.box';
import { useStatusContext } from '@/shared/components/status.provider';
import { WebsocketResolver } from '@/shared/function/websocket.resolver';
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Props {
  roomId: string;
}

function Goal ({ roomId }: Props) {
  const [name, setName] = useState('');
  const { status } = useStatusContext();
  const info = useLocalRoomInfo().getByRoomId(roomId);
  const router = useRouter();
  if (info == null) return;

  useEffect(() => {
    WebsocketResolver.add('goal', {
      id: 'onComponent',
      func: (data) => {
        setName(() => data.goalMemberName);
      }
    });
  }, []);

  if (status !== 'RESULT') return null;

  return (
    <Box
      position="absolute"
      top="100px"
      left="50%"
      zIndex={100}
      transform="translate(-50%)"
    >
      <ContentBox>
        <VStack maxWidth="300px" minWidth="180px" padding="8px">
          <Text fontSize="24px" fontWeight="bold" textAlign="center">
            {name ? '王手!!' : '引き分け'}
          </Text>
          {name && <Text textAlign="center">{name}の勝利</Text>}
          <Button
            onClick={async () => {
              await WebsocketResolver.sendSync('replay', { roomId }, (_) => {
                router.push(`/room/${roomId}/lobby`);
              });
            }}
          >
            もう一度遊ぶ
          </Button>
        </VStack>
      </ContentBox>
    </Box>
  );
}

export default React.memo(Goal);
