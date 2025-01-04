import Koma from '@/app/room/[roomId]/_components/koma';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { type ResultFromName } from 'physical-sugoroku-common/src/event';
import { useCallback } from 'react';

function Sequence (props: Pick<ResultFromName<'status'>['value'], 'sequence'>) {
  const Lives = useCallback(
    ({ life }: { life: number }) => {
      const lives = [];
      for (let i = 0; i < 3; i++) {
        lives.push(<Koma size={6} color="#ddd" key={`${i}_koma`} />);
      }
      for (let i = 0; i < life; i++) {
        lives[i] = <Koma size={6} color="black" key={`${i}_koma`} />;
      }
      return lives;
    },
    [props]
  );

  return (
    <Box
      position="absolute"
      left={'1%'}
      top={'10%'}
      zIndex={99}
      fontSize={['xs', 's']}
    >
      <VStack
        maxW="100%"
        align="start"
        gap={1}
        justifyContent="space-between"
        wrap="wrap"
      >
        {props.sequence.map((seq) => {
          return (
            <HStack
              key={seq.memberId}
              w="max-content"
              h="max-content"
              backgroundColor={getColor(seq.sequence)}
              borderWidth={'1px'}
              borderColor={getColor(seq.sequence)}
              padding={1}
              borderRadius={'8px'}
            >
              <Text
                w="80px"
                textWrap="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                color="white"
              >
                {seq.memberName}
              </Text>
              <HStack w="max-content" padding={1} bgColor="white">
                <Lives life={seq.life} />
              </HStack>
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
}

function getColor (sequence: number) {
  switch (sequence) {
    case 0:
      return '#ff0000';
    case 1:
      return '#0000ff';
    case 2:
      return '#00aa00';
    case 3:
      return '#aa00aa';
  }
}

export default Sequence;
