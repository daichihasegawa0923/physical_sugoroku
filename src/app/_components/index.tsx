"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useColorMode } from "@/components/ui/color-mode";
import { Field } from "@/components/ui/field";
import { StepperInput } from "@/components/ui/stepper-input";
import { Box, Center, Heading, Input, Tabs, VStack } from "@chakra-ui/react";
import { useEffect } from "react";

const Home = () => {
  const { setColorMode } = useColorMode();
  useEffect(() => {
    setColorMode("light");
  }, [setColorMode]);
  return (
    <Center h="100svh">
      <VStack w="100%" height="400px" gap={8} justify="start">
        <Heading>バカすごろく</Heading>
        <Box w={["100%", "50%"]} padding={8}>
          <Tabs.Root defaultValue="create_room" variant="outline">
            <Tabs.List>
              <Tabs.Trigger value="create_room">ルームを作成する</Tabs.Trigger>
              <Tabs.Trigger value="search_room">ルームを探す</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="create_room">
              <VStack gap={8} align={"start"}>
                <Field
                  label="ルーム名"
                  required
                  helperText="部屋名は他の人が部屋を探す際に使用します"
                >
                  <Input placeholder="例：ほげほげ部屋" />
                </Field>
                <Field label="参加人数" helperText="最大6人まで参加できます">
                  <StepperInput defaultValue="1" min={1} max={6} />
                </Field>
                <Checkbox>公開する</Checkbox>
                <Center w="100%">
                  <Button>作成する</Button>
                </Center>
              </VStack>
            </Tabs.Content>
          </Tabs.Root>
        </Box>
      </VStack>
    </Center>
  );
};

export default Home;
