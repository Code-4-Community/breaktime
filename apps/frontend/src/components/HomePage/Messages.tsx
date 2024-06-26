import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Alert,
  Button,
  CloseButton,
  Icon,
  Flex,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { DEFAULT_COLORS } from "src/constants";
import { BiMessageDetail } from "react-icons/bi";

enum MessageTypes {
  Reminder = "Reminder",
  Approved = "Approved",
}

const SAMPLE_MESSAGES_LIST = [
  { type: MessageTypes.Reminder, body: "Submit timesheet for 11/6-11/12" },
  {
    type: MessageTypes.Approved,
    body: "Timesheet for 10/30-11/5 by SUPERVISOR",
  },
];

export default function Messages() {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES_LIST);

  // const addMessage = (message) => {
  //   setMessages(messages.push(message));
  // };

  const deleteMessage = (index) => {
    const delMessage = [...messages];
    delMessage.splice(index, 1);
    setMessages(delMessage);
  };

  return (
    <Flex gridArea={"Messages"}>
      <Card width={"100%"} rounded={"lg"}>
        <CardHeader
          as="h5"
          backgroundColor={DEFAULT_COLORS.BREAKTIME_BLUE}
          color={DEFAULT_COLORS.WHITE}
          rounded="lg"
        >
          <Flex gap={"1%"}>
            <Icon as={BiMessageDetail} />
            Messages
          </Flex>
        </CardHeader>
        <CardBody>
          {messages[0] ? (
            <VStack>
              {messages.map((message, index) => (
                <Alert
                  key={index}
                  display={"flex"}
                  gap={"1%"}
                  alignItems={"center"}
                  rounded={"lg"}
                >
                  <CloseButton onClick={() => deleteMessage(index)} />
                  {message.type + ": " + message.body}
                  <Spacer />
                  <Button as="a" target="_blank">
                    View
                  </Button>
                </Alert>
              ))}
            </VStack>
          ) : (
            "No messages"
          )}
        </CardBody>
      </Card>
    </Flex>
  );
}
