import React, { useState, useEffect, useContext } from "react";
import { Stack } from "@chakra-ui/react";

import { UserContext } from "../UserContext";
import { CommentSchema, ReportSchema, RowSchema } from "../../../schemas/RowSchema";
import { CommentType } from "../types";
import { getAllActiveCommentsOfType } from "../utils";

import ShowCommentModal from "./CommentModals/ShowCommentModal";
import ShowReportModal from "./CommentModals/ShowReportModal";

interface CommentProps {
  updateFields: Function
  updateFields: Function
  comments: CommentSchema[] | undefined;
  date: number;
  timesheetID: number;
  row: RowSchema;
  row: RowSchema;
}

export function CommentCell(props: CommentProps) {
  const [currentComments, setCurrentComments] = useState(
    getAllActiveCommentsOfType(CommentType.Comment, props.comments)
    getAllActiveCommentsOfType(CommentType.Comment, props.comments)
  );
  const [reports, setReports] = useState(
    getAllActiveCommentsOfType(CommentType.Report, props.comments) as ReportSchema[]
    getAllActiveCommentsOfType(CommentType.Report, props.comments) as ReportSchema[]
  );
  const [isEditable, setisEditable] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    //Supervisor/Admins have the right to edit comments/reports
    if (user?.Type === "Supervisor" || user?.Type === "Admin") {
      setisEditable(true);
    }
  }, [user?.Type]);

  return (
    <Stack direction="row">
      <ShowCommentModal
        setComments={setCurrentComments}
        comments={currentComments}
        isEditable={isEditable}
        timesheetID={props.timesheetID}
        row={props.row}
        updateFields={props.updateFields}
        timesheetID={props.timesheetID}
        row={props.row}
        updateFields={props.updateFields}
      />
      <ShowReportModal
        date={props.date}
        date={props.date}
        setReports={setReports}
        reports={reports}
        isEditable={isEditable}
        timesheetID={props.timesheetID}
        timesheetID={props.timesheetID}
      />
    </Stack>
  );
}
