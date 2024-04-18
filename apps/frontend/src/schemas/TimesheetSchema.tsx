import { z } from "zod";
import { RowSchema, ScheduledRowSchema, CommentSchema } from "./RowSchema";
import { StatusType } from "./StatusSchema";

export const TimeSheetSchema = z.object({
  TimesheetID: z.number(),
  UserID: z.string(),
  StartDate: z.number(),
  Status: StatusType,
  CompanyID: z.string(),
  TableData: z.array(RowSchema),
  ScheduleTableData: z.union([z.undefined(), z.array(ScheduledRowSchema)]),
  WeekNotes: z.union([z.undefined(), z.array(CommentSchema)]),
  DueDateAssociate: z.number().default(1713104734),
  DueDateSupervisor: z.number().default(1713709534),
});

export type TimeSheetSchema = z.infer<typeof TimeSheetSchema>;

export enum TimesheetStatus {
  UNSUBMITTED = "Unsubmitted",
  HOURS_SUBMITTED = "HoursSubmitted",
  HOURS_REVIEWED = "HoursReviewed",
  FINALIZED = "Finalized",
}
