'use client';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Box, Center, Image, Input, Text, VStack } from '@chakra-ui/react';
import useCreateRoom from '../_hooks/useCreateRoom';
import { useState } from 'react';
import Loading from '@/shared/components/loading';
import Heading from '@/shared/components/heading';
import ContentBox from '@/shared/components/content.box';

const Home = () => {
  const { roomInput, setMemberName, submit } = useCreateRoom();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Center>
        <VStack w={['90%', '70%']} gap={8} justify="start" padding={[4, 8]}>
          <ContentBox title="ゲームを始める">
            <VStack gap={8} align={'start'} padding={4}>
              <Field
                label="ニックネーム"
                required
                helperText="あなたは何と呼ばれたい？"
              >
                <Input
                  placeholder="例：ほげほげ太郎"
                  value={roomInput.memberName}
                  onChange={(e) => {
                    setMemberName(e.target.value);
                  }}
                />
              </Field>
              <Center w="100%">
                <Button
                  onClick={() => {
                    setLoading(true);
                    submit().then(() => {
                      setLoading(false);
                    });
                  }}
                >
                  ルームを作成する
                </Button>
              </Center>
            </VStack>
          </ContentBox>
          <Image alt="title" src="/layout/top.webp" w="100%" />
          <Box>
            <ContentBox>
              <Heading as="h2">将棋王とは？</Heading>
              <Heading as="h3">
                世界初！最大4人まで遊べるオンライン将棋ゲーム
              </Heading>
              <Text>
                将棋王はブラウザで無料で遊べるオンライン将棋バトルサイバイバル・ソウルライクゲームです。
              </Text>
              <Text>将棋のルールって難しいですよね・・。</Text>
              <Text>
                開発者も将棋ウォーズで5級まで頑張ったのですが、いまだに駒の並べ方に自信がないぐらいです。
              </Text>
            </ContentBox>
          </Box>
        </VStack>
      </Center>
      <Loading open={loading} />
    </>
  );
};

export default Home;
