import * as DynamoSchemas from '../schemas/DynamoTimesheet'
import * as frontendRowTypes from '../frontend/RowSchema'
import * as frontendTimesheetTypes from '@org/schemas/'

/*
    Mapper from converting from DynamoDB Timesheet schema to the internal backend/frontend model.
*/ 
export class DBToModel {

    // Converts a list of backend timesheets to frontend ones 
    public static convertTimesheets(timesheets: DynamoSchemas.DynamoTimesheetSchema[]) : frontendTimesheetTypes.FrontendTimeSheetSchema[] {
        return timesheets.map((timesheet) => this.toFrontendTimesheet(timesheet)); 
    }

    // Converts a singular backend timesheet to a frontend one 
    public static toFrontendTimesheet(timesheet: DynamoSchemas.DynamoTimesheetSchema): frontendTimesheetTypes.FrontendTimeSheetSchema {
        return frontendTimesheetTypes.FrontendTimeSheetSchema.parse({
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
    private static toFrontendStatus(status: DynamoSchemas.DynamoStatusSchema): frontendTimesheetTypes.StatusType {
        return frontendTimesheetTypes.StatusType.parse({
            HoursSubmitted: status.HoursSubmitted, 
            HoursReviewed: status.HoursReviewed, 
            Finalized: status.Finalized
        })
    } 

    //Converts a backend row to a frontend one 
    private static toFrontendRows(rows: DynamoSchemas.DynamoShiftSchema[]): frontendRowTypes.RowSchema[] {
        if (rows === undefined) {
            return []; 
        }
        return rows.map((row) => {
            return frontendRowTypes.RowSchema.parse({ 
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
    private static toFrontendRowEntry(row: DynamoSchemas.DynamoTimeEntrySchema): frontendRowTypes.TimeRowEntry {
        if (row === undefined) {
            return undefined; 
        } 
        return frontendRowTypes.TimeRowEntry.parse({
            Start: row.StartDateTime, 
            End: row.EndDateTime, 
            AuthorID: row.AuthorUUID
        })
    }

    //Converts a list of backend comments to frontend equivalents. 
    private static toFrontendComments(comments: DynamoSchemas.DynamoNoteSchema[]): frontendRowTypes.CommentSchema[] {
        if (comments === undefined) {
            return []; 
        }
        return comments.map((comment) => {
            return frontendRowTypes.CommentSchema.parse({
                UUID: comment.EntryID, 
                AuthorID: comment.AuthorUUID, 
                Type: comment.Type, 
                Timestamp: comment.DateTime, 
                Content: comment.Content, 
                State: comment.State
            }); 
        })
    }
}