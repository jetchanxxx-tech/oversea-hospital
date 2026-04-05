import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminGuard } from "./admin.guard";
import { LeadAdminService } from "./lead-admin.service";
import { ResourceService } from "./resource.service";

@Module({
  controllers: [AdminController],
  providers: [AdminGuard, LeadAdminService, ResourceService]
})
export class AdminModule {}

