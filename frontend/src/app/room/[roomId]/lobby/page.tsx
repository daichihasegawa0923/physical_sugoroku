'use client';

import { useStatusInfo } from '@/shared/hooks/useStatusInfo';
import useTryJoin from '@/shared/hooks/useTryJoin';
import { useCommandContext } from '@/shared/components/command.provider';
import {
  Box,
  Button,
  createListCollection,
  Text,
  VStack,
  HStack
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WebsocketResolver } from '@/shared/function/websocket.resolver';
import ContentBox from '@/shared/components/content.box';
import {
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValueText
} from '@/components/ui/select';
import InviteUrl from '@/app/room/[roomId]/lobby/_components/invite.url';
import Loading from '@/shared/components/loading';

export default function Page ({ params }: { params: { roomId: string } }) {
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
    WebsocketResolver.add('startGame', (_) => {
      router.push(`/room/${params.roomId}`);
    });
    (async () => {
      await fetch();
    })();
  }, [status?.status]);

  if (isHost == null) {
    return <Loading text="読み込み中" open={true} />;
  }

  return (
    <VStack w="100%" maxW="540px" padding="16px 8px" gap="16px" margin="0 auto">
      <ContentBox title="招待リンク">
        <InviteUrl />
      </ContentBox>
      <ContentBox title="参加メンバー">
        <HStack
          wrap="wrap"
          alignItems="center"
          justifyContent="center"
          width="100%"
          minH="48px"
        >
          {(status?.sequence ?? []).map((info, index) => (
            <React.Fragment key={info.memberId}>
              <Box>{info.memberName}</Box>
              {index < (status?.sequence.length ?? 0) - 1 && '|'}
            </React.Fragment>
          ))}
        </HStack>
      </ContentBox>
      {isHost
        ? (
        <ContentBox title="ゲームの設定">
          <VStack w="100%" gap={16}>
            <SelectRoot
              collection={list}
              size="md"
              defaultValue={[list.items[0].value]}
              onValueChange={({ value }) => {
                setStageClassName(() => value[0]);
              }}
            >
              <SelectLabel>ステージ</SelectLabel>
              <SelectTrigger>
                <SelectValueText placeholder="ステージを選択してください。" />
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
                await WebsocketResolver.sendSync('startGame', {
                  roomId: params.roomId,
                  stageClassName
                });
              }}
            >
              スタート
            </Button>
          </VStack>
        </ContentBox>
          )
        : (
        <HStack>
          <Text>
            ホストがルームの設定をしています。しばらくお待ちください。
          </Text>
        </HStack>
          )}
    </VStack>
  );
}

const array = [
  { label: 'Stage1|初心者向け', value: 'Stage1' },
  { label: 'Stage2|中級者向け', value: 'Stage2' },
  { label: 'Stage3|上級者向け', value: 'Stage3' },
  { label: '超ミニステージ', value: 'StageTest' }
];

const list = createListCollection({
  items: array
});
