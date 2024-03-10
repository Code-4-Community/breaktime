export enum CellType {
    REGULAR = "Time Worked", 
    PTO = "PTO"
}; 

export enum CellStatus {
    Active="Active",
    Deleted="Deleted"
}

export enum CommentType { 
    Comment = "Comment", 
    Report = "Report", 
};

export enum ReportOptions {
    Late = "Late Arrival",
    LeftEarly = "Early Departure",
    Absent = "No Show"
}

export const enum ReviewStages {
    UNSUBMITTED = "Not-Submitted",
    EMPLOYEE_SUBMITTED = "Employee Submitted", 
    ADMIN_REVIEW = "Review (Breaktime)", 
    APPROVED = "Approved" 
};

// TODO : Does this need to be different than the enum above? Not sure it does... see if we can replace or combine them
export enum TimesheetStatus {
    UNSUBMITTED = "Unsubmitted",
    HOURS_SUBMITTED = "HoursSubmitted",
    HOURS_REVIEWED = "HoursReviewed",
    FINALIZED = "Finalized",
  }

export const TABLE_COLUMNS = ['Type', 'Date','Clock-in','Clock-Out','Hours','Comment']; 