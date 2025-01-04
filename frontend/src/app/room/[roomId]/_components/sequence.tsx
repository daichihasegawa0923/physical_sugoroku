import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { type ResultFromName } from 'physical-sugoroku-common/src/event';

function Sequence (props: Pick<ResultFromName<'status'>['value'], 'sequence'>) {
  return (
    <Box
      position="absolute"
      left={'1%'}
      top={'10%'}
      zIndex={99}
      fontSize={['xs', 's']}
    >
      <HStack
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
              <Box>
                <Box
                  w="10px"
                  h="10px"
                  borderWidth="5px"
                  borderColor="transparent"
                  borderBottomColor="white"
                />
                <Box w="10px" h="10px" bgColor="white" />
              </Box>
              <VStack bgColor="white" w="100%" gap={1} align="start">
                <Text
                  w="80px"
                  textWrap="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {seq.memberName}
                </Text>
                <Text>残機：{seq.life ?? 0}</Text>
              </VStack>
            </HStack>
          );
        })}
      </HStack>
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
      return '#00ff00';
    case 3:
      return '#aa00aa';
  }
}

export default Sequence;
