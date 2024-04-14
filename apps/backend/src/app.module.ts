import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./aws/auth.module";

import { AuthenticationMiddleware } from "./aws/middleware/authentication.middleware";
import { UserModule } from "./users/users.module";
import { CompanyModule } from "./company/company.module";

@Module({
  imports: [AuthModule, UserModule, CompanyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes("*");
  }
}
