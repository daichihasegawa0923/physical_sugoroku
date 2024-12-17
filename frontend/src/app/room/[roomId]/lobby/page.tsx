'use client';

import { useStatusInfo } from '@/shared/hooks/useStatusInfo';
import useTryJoin from '@/shared/hooks/useTryJoin';
import { useCommandContext } from '@/shared/components/command.provider';
import {
  Box,
  Button,
  createListCollection,
  Heading,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocketContext } from '@/shared/function/websocket.context';

export default function Page({ params }: { params: { roomId: string } }) {
  const { sendSync, add } = useWebSocketContext();
  const [stageClassName, setStageClassName] = useState(array[0].value);
  const { fetch, status, isHost } = useStatusInfo(params.roomId);
  const router = useRouter();
  const { setCommandText } = useCommandContext();
  useTryJoin(
    params.roomId,
    (data) => {
      if (!data.ok) {
        setCommandText('ルームに参加できませんでした。');
        return;
      }
      fetch().then(() => {});
    },
    (data) => {
      if (data.ok) {
        setCommandText(data.memberName + 'さんがルームに参加しました！');
        fetch().then(() => {});
      }
    }
  );

  useEffect(() => {
    if (status && status.status !== 'WAITING') {
      router.push(`/room/${params.roomId}`);
    }
    add('startGame', (_) => {
      router.push(`/room/${params.roomId}`);
    });
    (async () => {
      await fetch();
    })();
  }, [status?.status]);

  return (
    <VStack>
      <Heading as="h1">参加中のメンバー</Heading>
      {(status?.sequence ?? []).map((seq) => (
        <Box key={seq.memberId}>{seq.memberName}</Box>
      ))}
      {isHost && (
        <>
          <SelectRoot
            collection={list}
            defaultValue={['Stage1']}
            onValueChange={({ value }) => {
              setStageClassName(() => value[0]);
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
          <Button
            onClick={async () => {
              await sendSync('startGame', {
                roomId: params.roomId,
                stageClassName: stageClassName,
              });
            }}
          >
            開始する
          </Button>
        </>
      )}
    </VStack>
  );
}

const array = [
  { label: 'Stage1|初心者向け', value: 'Stage1' },
  { label: 'Stage2|中級者向け', value: 'Stage2' },
  { label: '超ミニステージ', value: 'StageTest' },
];

const list = createListCollection({
  items: array,
});
