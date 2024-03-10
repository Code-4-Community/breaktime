import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import TokenClient from './cognito/cognito.keyparser'
import * as frontendTimesheetSchemas from 'src/db/dynamoSchemas/DynamoTimesheet'
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { OperationRequestHandler } from 'src/db/timesheets/OperationRequestHandler';
import { Formatter } from 'src/db/timesheets/Formatter';


@Controller("auth")
@UseGuards(RolesGuard)
export class AuthController {

  operationRequestHandler = new OperationRequestHandler(); 

  constructor(private authService: AuthService) {}

  @Post('timesheet')
  public async upload_timesheet(
    @Headers() headers: any,
    @Body() body: any
  ): Promise<string> {
    const userId = await TokenClient.grabUserID(headers); 
    if (userId) {
      console.log("Update Timesheet Request: Processing")
      console.log("Request received:")
      console.log(body)
      const result = this.operationRequestHandler.updateTimesheet(body, userId); 
      //TODO: Do something with this result? 
      return result; 
    }
  }
  
  @Get("timesheet")
  //@Roles('breaktime-management-role')
  
  public async grab_timesheets(@Headers() headers: any): Promise<frontendTimesheetSchemas.DynamoTimesheetSchema[]> {
    const userId = await TokenClient.grabUserID(headers); 

    if (userId) {
      console.log("Fetching timesheets for user ", userId); 
      return Formatter.fetchUserTimesheets(userId); 
     
    } 
    return []; 
  }
}
