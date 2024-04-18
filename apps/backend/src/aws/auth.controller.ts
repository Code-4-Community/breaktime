import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { WriteEntryToTable, UserTimesheets } from "../dynamodb";
import TokenClient from "./cognito/cognito.keyparser";
import { TimeSheetSchema } from "src/db/schemas/Timesheet";
import * as frontendTimesheetSchemas from "src/db/schemas/Timesheet";
import { RolesGuard } from "src/utils/guards/roles.guard";
import { UploadTimesheet } from "src/db/timesheets/UploadTimesheet";
import { TimesheetUpdateRequest } from "src/db/schemas/UpdateTimesheet";
import { Formatter } from "src/db/timesheets/Formatter";
import { NotificationService } from "./notifications";

@Controller("auth")
@UseGuards(RolesGuard)
export class AuthController {
  uploadApi = new UploadTimesheet();

  constructor(
    private authService: AuthService,
    private notService: NotificationService
  ) {}

  @Post("sendEmail")
  public async sendEmail(@Headers() headers: any) {
    // subscribe with email
    await this.notService.addSubscription("conner.i@northeastern.edu", "2", [
      "1",
      "3",
    ]);
    await this.notService.sendEmail(
      "2",
      "2",
      "Submission Complete!",
      "Your timesheet for this week was successfully submitted. Yay!"
    );
  }

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
}
