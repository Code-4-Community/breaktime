import { Module } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { CognitoService } from "./cognito/cognito.service";
import { CognitoWrapper } from "./cognito/cognito.wrapper";

@Module({
  imports: [],
  providers: [AuthService, CognitoService, CognitoWrapper],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
