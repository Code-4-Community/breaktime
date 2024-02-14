export enum CellType {
  Regular = "Time Worked",
  PTO = "PTO",
}

export enum CellStatus {
  Active = "Active",
  Deleted = "Deleted",
}

export enum CommentType {
  Comment = "Comment",
  Report = "Report",
}

export enum ReportOptions {
  Late = "Late Arrival",
  LeftEarly = "Early Departure",
  Absent = "No Show",
}

export enum Color {
  Red = "red",
  Blue = "blue",
  Green = "green",
  Gray = "gray",
}

export const TABLE_COLUMNS = [
  "Type",
  "Date",
  "Clock-in",
  "Clock-Out",
  "Hours",
  "Comment",
];

export enum UserTypes {
  Associate = "Associate",
  Supervisor = "Supervisor",
  Admin = "Admin",
}
