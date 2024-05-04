import { z } from "zod";

/**
 * Represents the database schema for a note. This can be one of the following types:
 * -- Comment: a general comment made for an entry or whole timesheet.
 * -- Report: a specific report to reflect an incident that happens and requires admin attention, e.g. no-show or late attendance
 */
export const NoteSchema = z.object({
  Type: z.enum(["Comment", "Report"]),
  AuthorUUID: z.string().uuid(),
  DateTime: z.number(),
  Content: z.string(),
  State: z.enum(["Active", "Deleted"]),
});

/**
 * Represents the database schema for a schedule shift entry, made by a supervisor or admin
 */
export const ScheduleEntrySchema = z.object({
  StartDateTime: z.number(),
  EndDateTime: z.number(),
});

/**
 * Represents the database schema for a clockin/clockout pair in epoch
 */
export const TimeEntrySchema = z.object({
  StartDateTime: z.number(),
  EndDateTime: z.number(),
});

// // new enum
// enum AttendanceType {ABSENT = "Absent", ON_TIME = "On Time", LATE = "Late", EARLY = "Early"}

// // new temporary schema
// export const newTimeEntrySchema = z.object({
//   StartDateTime: z.number(),
//   EndDateTime: z.number(),
//   Attendance: z.array(z.enum([
//     AttendanceType.ABSENT,
//     AttendanceType.ON_TIME,
//     AttendanceType.LATE,
//     AttendanceType.EARLY])).optional()
// });

// "z"/zod checks types at runtime


// represents a singular timesheet's report 
// (default value of -1 for the monthAttendance and totalAttendance fields for now)
const AttendanceReport = z.object({
  totalShifts: z.number().default(-1),
  absentShifts: z.number().default(- 1),
  lateShifts: z.number().default(-1),
  earlyOutShifts: z.number().default(-1)
});

// schema for attendance object to be outputted by endpoint
const AttendanceSchema = z.object({
  timesheetId: z.string(),
  weekAttendance: AttendanceReport,
  monthAttendance: AttendanceReport,
  totalAttendance: AttendanceReport
});

// converts zod object to typescript type to use as a return schema for a function
export type AttendanceSchemaType = z.infer<typeof AttendanceSchema>;



/**
 * Represents the database schema for the status of a timesheet. This could be one of the following types:
 * -- HoursSubmitted (Associate has submitted their hours worked)
 * -- HoursReviewed (Supervisor has reviewed and approved the associate-submitted hours)
 * -- ScheduleSubmitted (Supervisor has submitted the scheduled hours)
 * -- Finalized (Admin has approved the submitted hours and schedule, and resolved any issue necessary)
 *
 * SubmittedDate reflects the time of last submission, whether from associate, supervisor, or admin.
 */
export const StatusSchema = z.object({
  StatusType: z.enum(["HoursSubmitted", "HoursReviewed", "Finalized"]),
  SubmittedDateTime: z.number(),
});

/**
 * Represents the database schema for a single shift or entry in the weekly timesheet.
 */
export const TimesheetEntrySchema = z.object({
  AssociateTimes: TimeEntrySchema.optional(),
  SupervisorTimes: TimeEntrySchema.optional(),
  AdminTimes: TimeEntrySchema.optional(),
  Note: NoteSchema.optional(),
});

/**
 * Represents the database schema for a weekly timesheet
 */
export const TimeSheetSchema = z.object({
  TimesheetID: z.number(),
  UserID: z.string().uuid(),
  StartDate: z.number(),
  StatusList: z.array(StatusSchema), // TODO: This is no longer correct schema for the database. This should be it's own object
  CompanyID: z.string(),
  HoursData: z.array(TimesheetEntrySchema).default([]),
  ScheduleData: z.array(ScheduleEntrySchema).default([]),
  WeekNotes: z.array(NoteSchema).default([]),
});

export type TimeSheetSchema = z.infer<typeof TimeSheetSchema>;

export enum TimesheetStatus {
  HOURS_SUBMITTED = "HoursSubmitted",
  HOURS_REVIEWED = "HoursReviewed",
  FINALIZED = "Finalized",
}
