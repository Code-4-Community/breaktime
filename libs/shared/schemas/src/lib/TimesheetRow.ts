import { z } from "zod";
import { CellStatus, CellType, CommentType, ReportOptions } from "./CellTypes";

/**
 * A collection of various schemas used in creating a shift entry in the timesheet. These schemas are internal models,
 * used for logic in the backend and frontend.
 */

const optionalNumber = z.union([z.undefined(), z.number()]);
const optionalString = z.union([z.undefined(), z.string()]);

/**
 * Represents the schema for an epoch clockin/clockout pair
 */
export const TimeEntrySchema = z.union([z.undefined(), z.object({
    StartDateTime: optionalNumber, 
    EndDateTime: optionalNumber, 
    AuthorID: optionalString
})]); 
export type TimeEntrySchema = z.infer<typeof TimeEntrySchema>

export const CommentSchema = z.object({
  EntryId: z.string(), 
  AuthorID:z.string(), 
  Type: z.nativeEnum(CellType),
  Timestamp: z.number(), 
  Content: z.string(), 
  State: z.nativeEnum(CellStatus),
}); 

export type CommentSchema = z.infer<typeof CommentSchema>

export const ReportSchema = z.object({
  AuthorID:z.string(),
  EntryId: z.string(), 
  Timestamp: z.number(),
  Type: z.nativeEnum(CommentType), 
  CorrectTime: z.number(),
  Content: z.nativeEnum(ReportOptions), 
  Notified: z.string(),
  Explanation: z.string(),
  State: z.nativeEnum(CellStatus), 
}); 

export type ReportSchema = z.infer<typeof ReportSchema>

// The status is either undefined, for not being at that stage yet, or
// contains the date and author of approving this submission
export const StatusEntryType = z.union([
  z.object({
    Date: z.number(),
    AuthorID: z.string(),
  }),
  z.undefined(),
]);

// Status type contains the three stages of the pipeline we have defined
export const StatusEntry = z.object({
  HoursSubmitted: StatusEntryType,
  HoursReviewed: StatusEntryType,
  Finalized: StatusEntryType,
});

export type StatusEntryType = z.infer<typeof StatusEntryType>;
export type StatusEntry = z.infer<typeof StatusEntry>;

/**
 * The schema for a shift entry (visually, a row in the timesheet).
 *  @Type: What type of entry the shift is (PTO, Regular, etc.)
 *  @EntryId: The unique ID for this shift
 *  @Date: The epoch value for the date of this shift. Note that this is different than the timestamp of the clock in and clock out.
 *  @AssociateTimeEntry: The clock-in/clock-out times recorded by the associate
 *  @SupervisorTimeEntry: The clock-in/clock-out times recorded by the supervisor
 *  @AdminTimeEntry: The clock-in/clock-out times recorded by the admin
 *  @Notes: The list of comments and reports saved for this shift.
 */
export const ShiftSchema = z.object({
  Type: z.nativeEnum(CellType), 
  EntryId: z.string(), 
  Date: z.number(), 
  AssociateTimeEntry: TimeEntrySchema, 
  SupervisorTimeEntry: TimeEntrySchema, 
  AdminTimeEntry: TimeEntrySchema, 
  Notes: z.array(CommentSchema || ReportSchema).default([]), // TODO : This will likely need to be two separate lists.
}); 
export type ShiftSchema = z.infer<typeof ShiftSchema>

export const TimeSheetSchema = z.object({
  TimesheetID: z.number(),
  UserID: z.string(),
  StartDate: z.number(),
  Status: StatusEntry,
  CompanyID: z.string(),
  TableData: z.array(ShiftSchema),
  WeekNotes: z.union([z.undefined(), z.array(CommentSchema)]),
});

export type TimeSheetSchema = z.infer<typeof TimeSheetSchema>;