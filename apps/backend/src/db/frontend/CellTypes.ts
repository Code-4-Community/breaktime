//////////////////////////////////////////////////////////////////////////
// DELETE THIS WHEN MERGED WITH MONOREPO TO DIRECTLY PULL FROM FRONTEND //
//////////////////////////////////////////////////////////////////////////

export enum CellType {
  Regular = "Time Worked",
  PTO = "PTO",
}

export enum CellStatus {
  Active = "Active",
  Deleted = "Deleted",
}

export enum ReportOptions {
  Late = "Late Arrival",
  LeftEarly = "Early Departure",
  Absent = "No Show",
}

export enum CommentType {
  Comment = "Comment",
  Report = "Report",
}

export const enum Review_Stages {
  UNSUBMITTED = "Not-Submitted",
  EMPLOYEE_SUBMITTED = "Employee Submitted",
  ADMIN_REVIEW = "Review (Breaktime)",
  APPROVED = "Approved",
}

export const TABLE_COLUMNS = [
  "Type",
  "Date",
  "Clock-in",
  "Clock-Out",
  "Hours",
  "Comment",
];
