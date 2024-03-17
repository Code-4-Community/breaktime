import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  UseGuards,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import * as frontendTimesheetSchemas from 'src/db/schemas/Timesheet'
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { UploadTimesheet } from 'src/db/timesheets/UploadTimesheet';
import { Formatter } from 'src/db/timesheets/Formatter';
import { ValidatedUser } from "src/aws/auth.service";
import { User } from "src/utils/decorators/user.decorator";


@Controller("timesheet")
@UseGuards(RolesGuard)
export class TimesheetController {
  uploadApi = new UploadTimesheet(); 

  @Post('update')
  public async updateTimesheet(
    @Headers() headers: any,
    @User() user: ValidatedUser,
    @Body() body: any
  ): Promise<string> {
    if (!user.sub) {
      throw new HttpException(
        "No authorized user found",
        HttpStatus.UNAUTHORIZED
      );
    }

    console.log("Update Timesheet Request: Processing")
    console.log("Request received:")
    console.log(body)
    const result = this.uploadApi.updateTimesheet(body, user.sub);

    //TODO: Do something with this result? 
    return result; 
  }
  
  @Get("")
  public async grabTimesheets(@Headers() headers: any,
  @User() user: ValidatedUser,
  ): Promise<frontendTimesheetSchemas.TimeSheetSchema[]> {
    if (!user.sub) {
      throw new HttpException(
        "No authorized user found",
        HttpStatus.UNAUTHORIZED
      );
    }

    return Formatter.fetchUserTimesheets(user.sub); 
  }
}