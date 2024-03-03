import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { EvaluationModal } from "./EvaluationModal";
import { CommentSchema } from "src/schemas/RowSchema";

/** Displays the comments in a list
 * each comment is a button that directs back to the modal
 *
 * @param commentList - list of comments
 * @param openEvaluationForm - is the modal open?
 * @param updateCommentList - update the list of comments
 */
export function Evaluations({
  commentList,
  openEvaluationForm,
  updateCommentList,
}: // handleModalOpen,
// handleModalClose,
{
  commentList: CommentSchema[];
  openEvaluationForm: boolean;
  updateCommentList: (updatedList: CommentSchema[]) => void;
  // handleModalOpen;
  // handleModalClose;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // the comment to be edited
  const [commentToEdit, setCommentToEdit] = useState<CommentSchema | null>(
    null
  );

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCommentDelete = (commentToDelete: CommentSchema) => {
    const updatedComments = commentList.filter(
      (comment) => comment !== commentToDelete
    );
    updateCommentList(updatedComments);
  };

  // TO DO: saveTimesheet function?
  // updates the list view of the comments
  // also updates an existinf comment when submitted
  const handleCommentSubmit = (comment: CommentSchema) => {
    if (commentToEdit) {
      const index = commentList.findIndex((c) => c === commentToEdit);
      const updatedCommentList = [...commentList];
      updatedCommentList[index] = comment;
      updateCommentList(updatedCommentList);

      setIsModalOpen(false);
    } else {
      const updatedCommentList = [...commentList, comment];
      updateCommentList(updatedCommentList);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="mt-2 mx-5 mb-4">
      {commentList.length > 0 && (
        <div>
          <h4>Weekly Comments</h4>
          {commentList.map((comment, index) => (
            <Button
              key={index}
              rightIcon={<EditIcon />}
              className="btn mb-6 p-2 mx-3 mt-3"
              onClick={() => {
                setCommentToEdit(comment);
                handleModalOpen();
              }}
            >
              {comment.Content}
            </Button>
          ))}
        </div>
      )}
      {isModalOpen && (
        <EvaluationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onCommentSubmit={handleCommentSubmit}
          onCommentDelete={handleCommentDelete}
          commentToEdit={commentToEdit}
        />
      )}
    </div>
  );
}
