import {
    Controller,
    Get,
    Headers,
    UseGuards,
    Query,
    HttpStatus,
    Res,
    HttpException,
    Req,
} from "@nestjs/common";
import { ValidatedUser } from "src/aws/auth.service";
import { User } from "src/utils/decorators/user.decorator";

import { CompanyService } from "./company.service";
import { CompanyModel } from "./Company.model";
import { RolesGuard } from "src/utils/guards/roles.guard";

@Controller("company")
@UseGuards(RolesGuard)
export class CompanyController {
    constructor(private companyService: CompanyService) {}

    @Get("companyInfo")
    public async getCompany(
        @Headers() headers: any,
        @User() user: ValidatedUser,
        @Query("companyId") companyId?: string
    ): Promise<CompanyModel> {
        if (!user.sub) {
            throw new HttpException(
                "No authorized user found",
                HttpStatus.UNAUTHORIZED
            );
        }

        return this.companyService.getCompany(companyId);
    }  


}