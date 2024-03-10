import * as DynamoSchemas from '../dynamoSchemas/DynamoTimesheet'
import {TimesheetSchemas, Types} from '@org/schemas';


// TODO : As we are shifting towards a shared schema system, we will move forward with an 'external' schema that handles dynamo data, and an 'internal' schema that works as the shared model of our data between the frontend and backend.
// Therefore, this file should be deprecated once the shift is complete.
/*
    Code for converting from the frontend to our backend equivalents. Useful for actually processing this to be stored in our database / align with what our 
    backend expects to see in this data. 
*/


// Class to represent the mappings from a frontend key to a backend key alongside a conversion fn for the data
class KeyPairMappings  {
    originalKey:string; 
    conversionFn: Function; 
    finalKey: string; 

    constructor(originalKey:string, finalKey: string, conversionFn:Function) {
        this.originalKey = originalKey; 
        this.conversionFn = conversionFn; 
        this.finalKey = finalKey; 
    }
}

export class frontendEntryConversions {
    /*
        Converts a shift in our timesheet to our database equivalent from frontend. 
    */
    private static toDBShift(row: TimesheetSchemas.ShiftSchema): DynamoSchemas.DynamoShiftSchema { 
        return DynamoSchemas.ShiftSchema.parse({
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
    private static toDBRowEntry(row: TimesheetSchemas.TimeEntrySchema | undefined): DynamoSchemas.DynamoTimeEntrySchema | undefined{
        if (row !== undefined) {
            return DynamoSchemas.TimeEntrySchema.parse({
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
    private static toDBNote(comment: TimesheetSchemas.CommentSchema | undefined): DynamoSchemas.DynamoNoteSchema | undefined {
        if (comment !== undefined) {
            return DynamoSchemas.NoteSchema.parse({
                Type: comment.Type, 
                EntryID: comment.UUID, 
                AuthorUUID: comment.AuthorID, 
                DateTime: comment.Timestamp, 
                Content: comment.Content, 
                State: comment.State 
            }); 
        }
        return undefined; 
    }
}