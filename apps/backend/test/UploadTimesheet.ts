
import { DynamoTimesheetSchema, DynamoStatusSchema, DynamoShiftSchema, DynamoCellType, DynamoTimeEntrySchema } from "../src/db/dynamoSchemas/DynamoTimesheet"
import { v4 as uuidv4 } from 'uuid';
import { WriteEntryToTable } from "../src/dynamodb";
//No idea why this require statement is needed but moment breaks otherwise :( 
const moment = require('moment-timezone'); 
/***********************************************
Utils file used in testing to upload entire timesheets 
*/



const TIMEZONE = "America/New_York"; 
const UUID = "4c8c5ad4-a8ab-4c92-b33f-b8f932b9e0b5"

function createTimeEntry(start, end) {
    return TimeEntrySchema.parse({
        StartDateTime: start, 
        EndDateTime: end, 
        AuthorUUID: UUID
    }); 
}

function createEntry(cellType, date, associate, note) {
    return TimesheetEntrySchema.parse({
        Type: cellType, 
        EntryID: uuidv4(), 
        Date: date, 
        AssociateTimes: associate, 
        SupervisorTimes: undefined, 
        AdminTimes: undefined, 
        Note: note
    }); 
}

const current = moment().tz(TIMEZONE); 

const daysOfWeek = moment().tz(TIMEZONE).startOf('week'); 

const timesheetToUpload = TimeSheetSchema.parse({
    TimesheetID: Math.round(Math.random() * 1000000000), 
    UserID: UUID, 
    StartDate: moment().tz(TIMEZONE).startOf('week').day(0).unix(), 
    Status: TimesheetStatus.parse({
        HoursSubmitted: undefined, 
        HoursReviewed: undefined, 
        ScheduleSubmitted: undefined, 
        Finalized: undefined 
    }), 
    CompanyID: "Example Company 401", 
    HoursData: [
        createEntry(DynamoCellType.REGULAR, daysOfWeek.day(1).unix(), undefined, undefined), 
        createEntry(DynamoCellType.PTO, daysOfWeek.day(2).unix(), undefined, undefined), 
        createEntry(DynamoCellType.REGULAR, daysOfWeek.day(5).unix(), createTimeEntry(100, 500), undefined)
    ],  
    ScheduleData: [], 
    WeekNotes: []
})

export function run() {
    console.log("Uploading timesheet!"); 
    WriteEntryToTable(timesheetToUpload); 
    console.log("Success :)"); 
}
