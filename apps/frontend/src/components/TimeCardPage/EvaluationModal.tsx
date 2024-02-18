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

import { useState, useEffect } from "react";
import { CommentSchema } from "src/schemas/RowSchema";
import { createNewComment } from "./utils";
import { UserSchema } from "../../schemas/UserSchema";
import { CommentType } from "./types";

export function EvaluationModal({
  isOpen,
  onClose,
  onCommentSubmit,
  onCommentDelete,
  commentToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCommentSubmit: (comment: CommentSchema) => void;
  onCommentDelete: (comment: CommentSchema) => void;
  commentToEdit: CommentSchema | null;
}) {
  const [editedComment, setEditedComment] = useState<string>(
    commentToEdit ? commentToEdit.Content : ""
  );
  const [isOpenCommentForm, setIsOpenCommentForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");
  const [commentList, setCommentList] = useState<CommentSchema[]>([]);
  const [selectedComment, setSelectedComment] = useState<CommentSchema | null>(
    null
  );

  interface WeeklyEvaluationModalProps {
    setWeeklyEvaluation: Function;
    weeklyEvaluation: CommentSchema[];
  }

  // set value for existing comment
  useEffect(() => {
    if (commentToEdit) {
      setEditedComment(commentToEdit.Content);
    } else {
      setEditedComment("");
    }
  }, [commentToEdit]);

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
    { value: "option5", content: otherText },
  ];

  const [user, setUser] = useState<UserSchema>();

  const closeCommentForm = () => {
    setIsOpenCommentForm(false);
    onClose();
  };

  const handleOptionChange = (value: string) => {
    if (commentToEdit) {
      const selectedOptionContent = options.find(
        (opt) => opt.value === value
      )?.content;
      setEditedComment(selectedOptionContent);
      setSelectedOption(value);
    } else {
      setSelectedOption(value);
    }
  };

  const handleInputOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    console.log("typing  ", newValue);
    if (commentToEdit) {
      setEditedComment(newValue);
    } else {
      setOtherText(event.target.value);
    }
  };

  const handleSubmit = () => {
    console.log(commentToEdit);
    if (commentToEdit) {
      const updatedComment = { ...commentToEdit, Content: editedComment };
      onCommentSubmit(updatedComment);
      closeCommentForm();
      console.log("hit submit in edit ");
    } else {
      let newCommentContent = selectedOption;
      if (selectedOption === "option5") {
        newCommentContent = otherText;
      } else {
        newCommentContent = options.find(
          (opt) => opt.value === selectedOption
        )?.content;
      }

      const newComment = createNewComment(
        user,
        CommentType.Comment,
        newCommentContent
      );
      onCommentSubmit(newComment);
    }
  };

  const handleDelete = () => {
    if (commentToEdit) {
      const updatedComments = commentList.filter(
        (comment) => comment !== commentToEdit
      );
      setCommentList(updatedComments);
      onCommentDelete(commentToEdit);
      console.log("testing delete", commentList);
      setSelectedComment(null); // Clear the selected comment after deletion
      closeCommentForm();
    }
  };

  console.log("is open? ", isOpenCommentForm);
  return (
    <Modal isOpen={isOpen} onClose={closeCommentForm}>
      <ModalContent>
        <ModalHeader> Weekly Performance Evaluation</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormLabel>
              How would you describe this associate's overall work performance
              this week?
            </FormLabel>
            <RadioGroup onChange={handleOptionChange} value={selectedOption}>
              <Stack spacing={2}>
                <Radio value="option1">
                  This associate was a total rock star this week!
                </Radio>
                <Radio value="option2">
                  This associate did just okay this week{" "}
                </Radio>
                <Radio value="option3">
                  Lack of professionalism and/or poor behavior{" "}
                </Radio>
                <Radio value="option4">N/A</Radio>
                <Radio value="option5">Other</Radio>
                {selectedOption === "option5" && (
                  <Input
                    placeholder="Enter answer"
                    value={commentToEdit ? editedComment : otherText}
                    onChange={handleInputOption}
                  />
                )}
              </Stack>
            </RadioGroup>
          </form>
          <Button onClick={handleDelete} type="submit" mr={3} ml={110}>
            Delete
          </Button>
          <Button onClick={handleSubmit} type="submit">
            Submit
          </Button>
          <ModalCloseButton />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
