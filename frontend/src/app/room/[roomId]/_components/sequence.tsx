import { Box, Flex, HStack } from '@chakra-ui/react'
import { type ResultFromName } from 'physical-sugoroku-common/src/event'

function Sequence (props: Pick<ResultFromName<'status'>['value'], 'sequence'>) {
  return (
    <Flex
      position="absolute"
      bgColor="#FFF"
      borderRadius="8px"
      padding="8px"
      left={'50%'}
      bottom={'5%'}
      zIndex={99}
      w="300px"
      transform="translate(-50%, 0)"
      wrap="wrap"
    >
      {props.sequence.map((seq) => {
        return (
          <HStack key={seq.memberId} w="140px">
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
              {seq.memberName}
            </HStack>
          </HStack>
        )
      })}
    </Flex>
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
