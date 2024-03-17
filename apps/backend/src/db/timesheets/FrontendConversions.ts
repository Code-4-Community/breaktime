import * as DynamoSchemas from '../dynamoSchemas/DynamoTimesheet'
import {CommentSchema, ReportSchema, ShiftSchema, StatusEntry, TimeEntrySchema, TimeSheetSchema} from '@org/schemas';

/*
    Mapper from converting from DynamoDB Timesheet schema to the internal backend/frontend model.
*/ 
export class DynamoSchemaConverter {

    // Converts a list of backend timesheets to frontend ones 
    public static convertDbTimesheets(timesheets: DynamoSchemas.DynamoTimesheetSchema[]) : TimeSheetSchema[] {
        return timesheets.map((timesheet) => this.toFrontendTimesheet(timesheet)); 
    }

    // Converts a singular backend timesheet to a frontend one 
    public static toFrontendTimesheet(timesheet: DynamoSchemas.DynamoTimesheetSchema): TimeSheetSchema {
        return TimeSheetSchema.parse({
            TimesheetID: timesheet.TimesheetID, 
            UserID: timesheet.UserID, 
            StartDate: timesheet.StartDate, 
            Status: this.toFrontendStatus(timesheet.Status), 
            CompanyID: timesheet.CompanyID, 
            TableData: this.toFrontendRows(timesheet.HoursData),
            WeekNotes: this.toFrontendComments(timesheet.WeekNotes) 
        }); 
    }

    // Converts a backend status to a frontend one 
    private static toFrontendStatus(status: DynamoSchemas.DynamoStatusSchema): StatusEntry {
        return StatusEntry.parse({
            HoursSubmitted: status.HoursSubmitted, 
            HoursReviewed: status.HoursReviewed, 
            Finalized: status.Finalized
        })
    } 

    //Converts a backend row to a frontend one 
    private static toFrontendRows(rows: DynamoSchemas.DynamoShiftSchema[]): ShiftSchema[] {
        if (rows === undefined) {
            return []; 
        }
        return rows.map((row) => {
            return ShiftSchema.parse({ 
                UUID: row.EntryID, 
                Type: row.Type, 
                Date: row.Date, 
                Associate: this.toFrontendRowEntry(row.AssociateTimes), 
                Supervisor: this.toFrontendRowEntry(row.SupervisorTimes), 
                Admin: this.toFrontendRowEntry(row.AdminTimes), 
                Comment: this.toFrontendComments(row.Note)
            }); 
        })
    }

    //Converts a backend row entry to a frontend one
    private static toFrontendRowEntry(row: DynamoSchemas.DynamoTimeEntrySchema): TimeEntrySchema {
        if (row === undefined) {
            return undefined; 
        } 
        return TimeEntrySchema.parse({
            Start: row.StartDateTime, 
            End: row.EndDateTime, 
            AuthorID: row.AuthorUUID
        })
    }

    //Converts a list of backend comments to frontend equivalents. 
    private static toFrontendComments(comments: DynamoSchemas.DynamoNoteSchema[]): CommentSchema[] {
        if (comments === undefined) {
            return []; 
        }
        return comments.map((comment) => {
            return CommentSchema.parse({
                UUID: comment.EntryID, 
                AuthorID: comment.AuthorUUID, 
                Type: comment.Type, 
                Timestamp: comment.DateTime, 
                Content: comment.Content, 
                State: comment.State
            }); 
        })
    }

    /*
        Converts a shift in our timesheet to our database equivalent from frontend. 
    */
        private static toDBShift(row: ShiftSchema): DynamoSchemas.DynamoShiftSchema { 
            return DynamoSchemas.DynamoShiftSchema.parse({
                Type: this.toDBType(row.Type), 
                EntryID: row.EntryId, 
                Date: row.Date, 
                AssociateTimes: this.toDBRowEntry(row.AssociateTimeEntry), 
                SupervisorTimes: this.toDBRowEntry(row.SupervisorTimeEntry), 
                AdminTimes: this.toDBRowEntry(row.AdminTimeEntry), 
                Note: row.Notes?.map((comment) => this.toDBNote(comment))
            }); 
        }
    
        // Converts a timesheet entry to our database equivalent from frontend. 
        private static toDBRowEntry(row: TimeEntrySchema | undefined): DynamoSchemas.DynamoTimeEntrySchema | undefined{
            if (row !== undefined) {
                return DynamoSchemas.DynamoTimeEntrySchema.parse({
                    StartDateTime: row.StartDateTime, 
                    EndDateTime: row.EndDateTime, 
                    AuthorUUID: row.AuthorID
                }); 
            }
            return undefined; 
        }
    
        // Converts a frontend cell type to our database equivalent. 
        private static toDBType(entryType: Types.CellType): DynamoSchemas.DynamoCellType {
            switch (entryType) {
                case Types.CellType.REGULAR:
                    return DynamoSchemas.DynamoCellType.REGULAR; 
                case Types.CellType.PTO:
                    return DynamoSchemas.DynamoCellType.PTO; 
                default:
                    return undefined 
            }
        }
    
        // Converts a singular weekly comment / note from our frontend to database. 
        private static toDBNote(comment: CommentSchema | ReportSchema | undefined): DynamoSchemas.DynamoNoteSchema | undefined {
            if (comment !== undefined) {
                return DynamoSchemas.DynamoNoteSchema.parse({
                    Type: comment.Type, 
                    EntryID: "", // TODO: EntryId will need to be updated
                    AuthorUUID: comment.AuthorID, 
                    DateTime: comment.Timestamp, 
                    Content: comment.Content, 
                    State: comment.State 
                }); 
            }
            return undefined; 
        }
}