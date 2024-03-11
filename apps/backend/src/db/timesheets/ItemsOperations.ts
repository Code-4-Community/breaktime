import {OperationRequests, TimesheetSchemas} from '@org/schemas'
import { CommentSchema } from '../../../../../libs/shared/schemas/src/lib/TimesheetRow';
//Not sure why but only works if imported like this :| 
const moment = require('moment-timezone'); 

/* Interface holding all operations available for a field in the timesheet that should support 
    updates, inserts, and deletions. 
*/
interface ItemsOperations {
    // Insert into the list of items 
    Insert(timesheet: TimesheetSchemas.TimeSheetSchema, body:OperationRequests.InsertRequest): TimesheetSchemas.TimeSheetSchema 
    // Delete a specific item from the list of items 
    Delete(timesheet: TimesheetSchemas.TimeSheetSchema, body:OperationRequests.DeleteRequest): TimesheetSchemas.TimeSheetSchema 
    // Update a specific item in the list of items 
    Update(timesheet: TimesheetSchemas.TimeSheetSchema, body:OperationRequests.UpdateRequest) : TimesheetSchemas.TimeSheetSchema 
    // Update the status of a timesheet
    StatusChange(timesheet: TimesheetSchemas.TimeSheetSchema, body:OperationRequests.StatusChangeRequest): TimesheetSchemas.TimeSheetSchema
}

/*
    Delegator for delegating to the correct Type (Field) on the timesheet for processing for. 
    I.e. when we want to update a piece of the table data, go to the implementation of this interface above for table data. 
*/
export class ItemsDelegator {
    // Class to determine what field of the timesheet we are performing item operations on 
    tableData = new HoursDataOperations() 
    notesData = new NotesOperations()
    

    public AttributeToModify(body: OperationRequests.InsertRequest | OperationRequests.DeleteRequest | OperationRequests.UpdateRequest) {
        switch (body.Type) {
            case OperationRequests.TimesheetListItems.TABLEDATA:
                return this.tableData;
            case OperationRequests.TimesheetListItems.WEEKNOTES:
                return this.notesData;
            default:
                throw new Error ("Invalid operation provided"); 
        }
    }
}


/*
    Implementation for processing operations on the TableData (HoursData) of our timesheet 
    i.e. the user entered rows of the time they worked. 
*/
export class HoursDataOperations implements ItemsOperations {

    public Insert(timesheet: TimesheetSchemas.TimeSheetSchema, body: OperationRequests.InsertRequest)  {
        const data = timesheet.TableData; 

        const item = TimesheetSchemas.ShiftSchema.parse(body.Item); 
        // Sorting is currently only day by day based - need some way of minute by minute 
        var idx = 0; 
        for (idx; idx < data.length; idx += 1) {
            const row = data[idx]; 
            if (moment.unix(row.Date).isAfter(moment.unix(item.Date), 'day')) {
                break; 
            }
        }

        //Insert into front of list 
        if (idx === 0) {
            return {
                ...timesheet, 
                TableData: [
                    item,
                    ...data 
                ]
            }; 
        } else if (idx === data.length) {
            //End of list 
            return {
                ...timesheet, 
                TableData: [
                    ...data,
                    item
                ]
            }; 
        } else {
            return {
                ...timesheet, 
                TableData: [
                    ...data.slice(0, idx), 
                    item, 
                    ...data.slice(idx + 1 )
                ]
            }
        }
    }
    public Delete(timesheet: TimesheetSchemas.TimeSheetSchema, body:OperationRequests.DeleteRequest)  {
        return {
            ...timesheet, 
            TableData: timesheet.TableData.filter((row) => row.EntryId !== body.Id)
        }; 
         
    }

    public  Update(timesheet: TimesheetSchemas.TimeSheetSchema, body:OperationRequests.UpdateRequest)  {
        if (timesheet.TableData?.filter((row) => row.EntryId === body.Id).length === 0) {
            throw new Error("Could not find a row with that ID"); 
        }
        return {
            ...timesheet, 
            TableData: timesheet.TableData.map((row) => {
                // Only update the one specific id 
                if (row.EntryId === body.Id) {
                    return {
                        ...row, 
                        [body.Attribute] : body.Data
                    }; 
                }
                return row; 
            })
        }
    }

    public StatusChange(timesheet: TimesheetSchemas.TimeSheetSchema, body:OperationRequests.StatusChangeRequest)  {
        if (timesheet.TimesheetID !== body.TimesheetId) {
            throw new Error("Requested timesheet does not match timesheet ID of timesheet being updated");
        }

        /*
        As an example...
        original Status : {HoursSubmitted=undefined, HoursReviewed=undefined, Finalized=undefined}

        OperationRequests.StatusChangeRequest: {TimesheetId=abc, AssociateId=123456, authorId:123456, dateSubmited=0638457, StatusType='HoursSubmitted'}

        new Status: {HoursSubmitted={Date: 0638457, AuthorID: 123456}, HoursReviewed=undefined, Finalized=undefined}
        */

        const newStatusEntry = {Date: body.dateSubmitted, AuthorID: body.authorId}
        const updatedStatus = {
            ...timesheet.Status,
            [body.statusType.valueOf()]: newStatusEntry
        }

        console.log("Handling Status Change Request for timesheet %s", body.TimesheetId.valueOf())
        console.log("New Status Object:\n %s", updatedStatus)
        return {
            ...timesheet, 
            Status: updatedStatus
        }
    }
}

// Operations on the weekly notes on the timesheet - i.e. comments relating to the entire timesheet / specific day worked. 
export class NotesOperations implements ItemsOperations {
    public  Insert(timesheet: TimesheetSchemas.TimeSheetSchema, body:OperationRequests.InsertRequest)  {
        return {
            ...timesheet, 
            WeekNotes: [
                ...timesheet.WeekNotes, 
                CommentSchema.parse(body.Item) // TODO : Need to add report parsing as well
            ]
        }; 
    }
    public Delete(timesheet: TimesheetSchemas.TimeSheetSchema, body:OperationRequests.DeleteRequest)  {
        return {
            ...timesheet, 
            WeekNotes: timesheet.WeekNotes.filter((note) => note.EntryId !== body.Id)
        }
    }

    public  Update(timesheet: TimesheetSchemas.TimeSheetSchema, body:OperationRequests.UpdateRequest)   {
        //TODO - Add in functionality to trigger insert instead of update if ID does not yet exist

        return {
            ...timesheet,
            WeekNotes: timesheet.WeekNotes.map((note) => {
                if (note.EntryId === body.Id) {
                    return {
                        ...note, 
                        [body.Attribute] : body.Data
                    }
                }
                return note ;
            })
        }
    }

    public StatusChange(timesheet: TimesheetSchemas.TimeSheetSchema, body:OperationRequests.StatusChangeRequest)  {
        return undefined;
    }
}

 