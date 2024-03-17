import { TimeSheetSchema, TimesheetStatus } from "../src/db/schemas/Timesheet";
const moment = require("moment-timezone");

export const timesheetToUpload = (
  UUID: string,
  CompanyID: string,
  StartDate: number
) => {
  return TimeSheetSchema.parse({
    TimesheetID: Math.round(Math.random() * 1000000000),
    UserID: UUID,
    StartDate: StartDate,
    Status: TimesheetStatus.parse({
      HoursSubmitted: undefined,
      HoursReviewed: undefined,
      ScheduleSubmitted: undefined,
      Finalized: undefined,
    }),
    CompanyID: CompanyID,
    HoursData: [],
    ScheduleData: [],
    WeekNotes: [],
  });
};
