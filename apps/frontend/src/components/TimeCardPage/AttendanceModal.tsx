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
      content: "This associate was a total rock star this week!",
    },
    { value: "option2", content: "This associate did just okay this week" },
    {
      value: "option3",
      content: "Lack of professionalism and/or poor behavior",
    },
    { value: "option4", content: "N/A" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader> Weekly Performance Evaluation</ModalHeader>
        <ModalBody>
          {/* <form onSubmit={handleSubmit}> */}
          <FormLabel>
            How would you describe this associate's overall work performance
            this week?
          </FormLabel>
          <RadioGroup value={selectedOption}>
            <Stack spacing={2}>
              {options.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.content}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
          {/* </form> */}
          <ModalCloseButton />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
