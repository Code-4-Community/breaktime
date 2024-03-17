import { Module } from "@nestjs/common";
import { TimesheetController } from "./timesheet.controller";
import { TimesheetService } from "./timesheet.service";


@Module({
  imports: [],
  providers: [TimesheetService],
  controllers: [TimesheetController],
  exports: [],
})
export class TimesheetModule { }
