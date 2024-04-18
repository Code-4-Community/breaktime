import { Module } from "@nestjs/common";
import { CognitoService } from "src/aws/cognito/cognito.service";
import { CognitoWrapper } from "src/aws/cognito/cognito.wrapper";
import { CompanyService } from "./company.service";
import { CompanyController } from "./company.controller";

@Module({
  imports: [],
  providers: [CompanyService, CognitoService, CognitoWrapper],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
