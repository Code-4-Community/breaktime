import {
  Stack,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormLabel,
  RadioGroup,
  Radio,
  Input,
  Select,
  HStack,
} from "@chakra-ui/react";
import React from "react";

import { useState, useEffect, useContext } from "react";
import { CommentSchema } from "src/schemas/RowSchema";
import { createNewComment } from "./utils";
import { UserSchema } from "../../schemas/UserSchema";
import { CommentType } from "./types";
import { UserContext } from "./UserContext";

/** Displays a modal with options for weekly evaluations
 * The modal has 5 options, including the ablity to write text
 *
 * @param {boolean} isOpen - is the modal open
 * @param onClose  A callback function invoked when the modal is closed.
 * @param onCommentSubmit -  A callback function invoked when the submit is pressed.
 * @param onCommentDelete -  A callback function invoked when the delete is pressed.
 * @param {string} commentToEdit  -  The comment that needs to be edited
 */
export function AttendanceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedOption, setSelectedOption] = useState("option 1");
  const options = [
    {
      value: "option1",
      content: "Default",
    },
    { value: "option2", content: "Absent" },
    {
      value: "option3",
      content: "Tardy",
    },
    { value: "option4", content: "Left Early" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader> Weekly Performance Evaluation</ModalHeader>
        <ModalBody>
          {/* <form onSubmit={handleSubmit}> */}
          <FormLabel>Shifts for week of 04/15/2024</FormLabel>
          <Stack spacing={2}>
            {[
              "04/15/2024",
              "04/16/2024",
              "04/17/2024",
              "04/18/2024",
              "04/19/2024",
            ].map((item) => (
              <>
                <FormLabel>{item}</FormLabel>
                <Select>
                  {options.map((option) => (
                    <option>{option.content}</option>
                  ))}
                </Select>
              </>
            ))}
            <FormLabel>Weekly Attendance Rate: 93%</FormLabel>
            <FormLabel>Overrall Attendance Rate 95%</FormLabel>
          </Stack>
          <HStack>
            <Button>cancel</Button>
            <Button colorScheme="blue">submit</Button>
          </HStack>
          {/* </form> */}
          <ModalCloseButton />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
