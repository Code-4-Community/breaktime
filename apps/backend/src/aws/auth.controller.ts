import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  Query,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  getTimesheetsForUsersInGivenTimeFrame,
  doUUIDSExistInCompanies,
  GetCompaniesForUser,
  areUUIDsValid,
} from "../dynamodb";
import { WriteEntryToTable, UserTimesheets } from "../dynamodb";
import TokenClient from "./cognito/cognito.keyparser";
import { TimeSheetSchema } from "src/db/schemas/Timesheet";
import * as frontendTimesheetSchemas from "src/db/schemas/Timesheet";
import { RolesGuard } from "src/utils/guards/roles.guard";
import { UploadTimesheet } from "src/db/timesheets/UploadTimesheet";
import { TimesheetUpdateRequest } from "src/db/schemas/UpdateTimesheet";
import { Formatter } from "src/db/timesheets/Formatter";

@Controller("auth")
@UseGuards(RolesGuard)
export class AuthController {
  uploadApi = new UploadTimesheet();

  constructor(private authService: AuthService) {}

  @Post("timesheet")
  public async upload_timesheet(
    @Headers() headers: any,
    @Body() body: any
  ): Promise<string> {
    const userId = await TokenClient.grabUserID(headers);
    if (userId) {
      console.log("Update Timesheet Request: Processing");
      console.log("Request received:");
      console.log(body);
      const result = this.uploadApi.updateTimesheet(body, userId);
      //TODO: Do something with this result?
      return result;
    }
  }

  @Get("timesheet")
  //@Roles('breaktime-management-role')
  public async grab_timesheets(
    @Headers() headers: any
  ): Promise<frontendTimesheetSchemas.TimeSheetSchema[]> {
    const userId = await TokenClient.grabUserID(headers);

    if (userId) {
      console.log("Fetching timesheets for user ", userId);
      return Formatter.fetchUserTimesheets(userId);
    }
    return [];
  }

  @Get("getTimesheet")
  //@Roles('breaktime-management-role')
  //@Roles("breaktime-admin", "breaktime-supervisor")
  public async get_timesheets(
    @Headers() headers: any,
    @Query("Ids") userIDs?: string[]
  ): Promise<uuidToTimesheetMapping[]> {
    // if supervisors dont have access to a uuid throw an error
    // if supervisor or admin request non existent uuid throw an error

    // if supervisor ensure all uuids are in company
    // if admin just make sure theyre all valid

    // if associate only return their timesheet

    const userID = await TokenClient.grabUserID(headers);
    console.log("Getting timesheets for :", userIDs);
    let areAllUUIDsValid;
    if (!userIDs) {
      const userID = await TokenClient.grabUserID(headers);
      if (1 == 1) {
        // associate
        userIDs = [userID];
      } else if (2 === 2) {
        // supervisor
        userIDs = []; // get all users in their companies
      } else if (3 === 3) {
        // admin
        userIDs = []; // get all users they own
      } else {
        // no role no access
        // throw error
        throw new NotFoundException("UserID is required");
      }
    }

    if (1 === 1) {
      // associate
      //areAllUUIDsValid = (userIDs.length === 1 &&  userID === userIDs[0])
      areAllUUIDsValid = userIDs;
    } else if (2 === 2) {
      // supervisor
      const supervisorCompanies = (await GetCompaniesForUser(userID))
        .SupervisorCompanyIDs;
      areAllUUIDsValid = await doUUIDSExistInCompanies(
        userIDs,
        supervisorCompanies
      );
    } else if (3 === 3) {
      //admin
      areAllUUIDsValid = await areUUIDsValid(userIDs);
    } else {
      throw new NotFoundException("UserID is required");
      // no role no access
      // throw error
    }

    if (areAllUUIDsValid) {
      //return await getTimesheetsForUsersInGivenTimeFrame(userIDs, 	1707799467, 1708231467 );
      return await getTimesheetsForUsersInGivenTimeFrame(userIDs);
    } else {
      throw new NotFoundException("invalid uuids");
      // throw error
    }

    //await getTimesheetsForUsersInGivenTimeFrame(['77566d69-3b61-452a-afe8-73dcda96f876']);
  }
}
export type uuidToTimesheetMapping = {
  uuid: string;
  timesheet: TimeSheetSchema;
};
