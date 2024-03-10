import { z } from "zod";

/**
 * Represents the database schema for a note. This can be one of the following types:
 * -- Comment: a general comment made for an entry or whole timesheet.
 * -- Report: a specific report to reflect an incident that happens and requires admin attention, e.g. no-show or late attendance
 */
export const NoteSchema = z.object({
  Type: z.enum(["Comment", "Report"]),
  EntryID: z.string(), 
  AuthorUUID: z.string(),
  DateTime: z.number(),
  Content: z.string(),
  State: z.enum(["Active", "Deleted"]),
})

/**
 * Represents the database schema for a clockin/clockout pair in epoch
 */
export const TimeEntrySchema = z.object({
  StartDateTime: z.number().optional(),
  EndDateTime: z.number().optional(),
  AuthorUUID: z.string(),
})

/* 
  Supported type of cells for each row in a timesheet 
    @REGULAR - a regular cell
    @PTO - Cell signifying paid time off (PTO) 
*/
export enum DynamoCellType {
  REGULAR_LEGACY = "Regular", // No longer using this format for data, but some older timesheet entries may have the 'legacy' type
  REGULAR = "Time Worked",
  PTO = "PTO"
}

/**
 * Represents the database schema for a single shift (visually, a row) in the weekly timesheet. 
 */
export const ShiftSchema = z.object({
  Type: z.enum([DynamoCellType.REGULAR, DynamoCellType.REGULAR_LEGACY, DynamoCellType.PTO]).transform((cellType) => cellType === DynamoCellType.REGULAR_LEGACY ? DynamoCellType.REGULAR : cellType),
  EntryID: z.string(), 
  Date: z.number(), 
  AssociateTimes: TimeEntrySchema.optional(),
  SupervisorTimes: TimeEntrySchema.optional(),
  AdminTimes: TimeEntrySchema.optional(),
  Note: z.array(NoteSchema).optional(),
})

// The status is either undefined, for not being at that stage yet, or 
// contains the date and author of approving this submission 
export const StatusEntryType = z.union(
  [z.object({
    Date: z.number(),  
    AuthorID: z.string()
  }), 
  z.undefined()]); 

// Status type contains the four stages of the pipeline we have defined 
export const TimesheetStatus = z.object({
  HoursSubmitted: StatusEntryType, 
  HoursReviewed: StatusEntryType,
  Finalized: StatusEntryType 
});

/**
 * Represents the database schema for a weekly timesheet
 */
export const TimesheetSchema = z.object({
  TimesheetID: z.number(), 
  UserID: z.string(), 
  StartDate: z.number(),
  Status: TimesheetStatus,
  CompanyID: z.string(), 
  HoursData: z.array(ShiftSchema).default([]), 
  WeekNotes: z.array(NoteSchema).default([]),
})

export type DynamoStatusSchema = z.infer<typeof TimesheetStatus>
export type DynamoTimeEntrySchema = z.infer<typeof TimeEntrySchema> 
export type DynamoNoteSchema = z.infer<typeof NoteSchema>
export type DynamoShiftSchema = z.infer<typeof ShiftSchema>
export type DynamoTimesheetSchema = z.infer<typeof TimesheetSchema>