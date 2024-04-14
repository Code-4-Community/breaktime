import React, { useState, useEffect, useContext } from "react";
import { Stack } from "@chakra-ui/react";

import { UserContext } from "../UserContext";
import { CommentSchema, ReportSchema } from "../../../schemas/RowSchema";
import { CommentType } from "../types";
import { getAllActiveCommentsOfType } from "../utils";

import ShowCommentModal from "./CommentModals/ShowCommentModal";
import ShowReportModal from "./CommentModals/ShowReportModal";

interface CommentProps {
  comments: CommentSchema[] | undefined;
  date: number;
  updateComments: Function;
  timesheetID: number;
}

export function CommentCell({
  comments,
  date,
  updateComments,
  timesheetID,
}: CommentProps) {
  const [currentComments, setCurrentComments] = useState(
    getAllActiveCommentsOfType(CommentType.Comment, comments)
  );
  const [reports, setReports] = useState(
    getAllActiveCommentsOfType(CommentType.Report, comments).map((comment) => ({
      AuthorID: comment.AuthorID,
      Type: comment.Type,
      Content: comment.Content.split(",")[0],
      Notified: comment.Content.split(",")[1],
      Explanation: comment.Content.split(",")[2],
      State: comment.State,
      Timestamp: comment.Timestamp,
    })) as ReportSchema[]
  );
  const [isEditable, setisEditable] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    //Supervisor/Admins have the right to edit comments/reports
    if (user?.Type === "Supervisor" || user?.Type === "Admin") {
      setisEditable(true);
    }
  }, [user?.Type]);

  const updateReports = (updatedReports: ReportSchema[]) => {
    setReports(updatedReports);

    const reportsToComments = updatedReports.map((report) => ({
      UUID: report.AuthorID,
      AuthorID: report.AuthorID,
      Type: report.Type,
      Timestamp: report.Timestamp,
      Content: `${report.Content},${report.Notified},${report.Explanation}`,
      State: report.State,
    })) as CommentSchema[];

    updateComments("Comment", currentComments.concat(reportsToComments));
  };

  return (
    <Stack direction="row">
      <ShowCommentModal
        setComments={setCurrentComments}
        comments={currentComments}
        isEditable={isEditable}
        timesheetID={timesheetID}
      />
      <ShowReportModal
        date={date}
        setReports={updateReports}
        reports={reports}
        isEditable={isEditable}
        timesheetID={timesheetID}
      />
    </Stack>
  );
}
