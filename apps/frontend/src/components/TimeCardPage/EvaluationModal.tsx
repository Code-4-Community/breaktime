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
  const user = useContext(UserContext);
  const [isOpenCommentForm, setIsOpenCommentForm] = useState(isOpen);
  const [selectedOption, setSelectedOption] = useState("");
  // text inputed by user when option 5 is chosen
  const [customOptionText, setCustomOptionText] = useState("");
  // TO DO: replace comment list with a save of the timesheet
  const [commentList, setCommentList] = useState<CommentSchema[]>([]);
  const [selectedComment, setSelectedComment] = useState<CommentSchema | null>(
    null
  );
  const [editedComment, setEditedComment] = useState<string>(
    commentToEdit ? commentToEdit.Content : ""
  );

  interface WeeklyEvaluationModalProps {
    setWeeklyEvaluation: Function;
    weeklyEvaluation: CommentSchema[];
  }

  // set value for an existing comment
  useEffect(() => {
    if (commentToEdit) {
      setEditedComment(commentToEdit.Content);
    } else {
      setEditedComment("");
    }
  }, [commentToEdit]);

  // different evaluation options
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
    { value: "option5", content: customOptionText },
  ];

  // sets form as closed
  const closeCommentForm = () => {
    setIsOpenCommentForm(false);
    onClose();
  };

  // sets the selected option
  // sets the edited comment as the selected option
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

  // sets the inputed text as the selected option (if 'other' was chosen)
  const handleInputOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (commentToEdit) {
      setEditedComment(newValue);
    } else {
      setCustomOptionText(event.target.value);
    }
  };

  // creates a new comment for the selected option or edits the existing comment
  const handleSubmit = () => {
    if (commentToEdit) {
      const updatedComment = { ...commentToEdit, Content: editedComment };
      onCommentSubmit(updatedComment);
      closeCommentForm();
    } else {
      let newCommentContent = selectedOption;
      if (selectedOption === "option5") {
        newCommentContent = customOptionText;
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

  // removes the "current comment" from the comment list
  const handleDelete = () => {
    if (commentToEdit) {
      const updatedComments = commentList.filter(
        (comment) => comment !== commentToEdit
      );
      setCommentList(updatedComments);
      onCommentDelete(commentToEdit);
      setSelectedComment(null);
      closeCommentForm();
    }
  };

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
                {options.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    {option.content}
                  </Radio>
                ))}

                {selectedOption === "option5" && (
                  <Input
                    placeholder="Enter answer"
                    value={commentToEdit ? editedComment : customOptionText}
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
