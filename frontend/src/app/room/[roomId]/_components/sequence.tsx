import ContentBox from '@/shared/components/content.box'
import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import { type ResultFromName } from 'physical-sugoroku-common/src/event'
import React from 'react'

function Sequence (props: Pick<ResultFromName<'status'>['value'], 'sequence'>) {
  return (
    <Box
      position="absolute"
      left={'50%'}
      top={'10%'}
      w="300px"
      zIndex={99}
      transform="translate(-50%, 0)"
    >
      <ContentBox title="メンバー">
        <Flex w="100%" justifyContent="space-between" wrap="wrap">
          {props.sequence.map((seq) => {
            return (
              <HStack key={seq.memberId} w="100px">
                <HStack>
                  <Box>
                    <Box
                      w="10px"
                      h="10px"
                      borderWidth="5px"
                      borderColor="transparent"
                      borderBottomColor={getColor(seq.sequence)}
                    />
                    <Box w="10px" h="10px" bgColor={getColor(seq.sequence)} />
                  </Box>
                  <Text
                    w="80px"
                    textWrap="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {seq.memberName}
                  </Text>
                </HStack>
              </HStack>
            )
          })}
        </Flex>
      </ContentBox>
    </Box>
  )
}

function getColor (sequence: number) {
  switch (sequence) {
    case 0:
      return '#ff0000'
    case 1:
      return '#0000ff'
    case 2:
      return '#00ff00'
    case 3:
      return '#ff00ff'
  }
}

export default Sequence
