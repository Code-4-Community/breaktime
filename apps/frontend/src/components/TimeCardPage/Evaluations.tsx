import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { EvaluationModal } from "./EvaluationModal";
import { CommentSchema } from "src/schemas/RowSchema";

export function Evaluations({
  commentList,
  openEvaluationForm,
  updateCommentList,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
