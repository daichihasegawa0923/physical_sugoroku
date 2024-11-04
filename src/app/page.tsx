import { Box, Center, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";

export default function Home() {
  return (
    <Center h="100svh">
      <Box w="300px" h="200px" borderRadius="8px" bgColor="white">
        <Center w="100%" h="100%">
          <Text color="black">Hello!</Text>
        </Center>
      </Box>
    </Center>
  );
}
