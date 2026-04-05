import { Module } from "@nestjs/common";
import { PublicModule } from "./public/public.module";
import { AdminModule } from "./admin/admin.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [PublicModule, AdminModule],
  controllers: [HealthController]
})
export class AppModule {}

