import { Module } from "@nestjs/common";
import { PublicController } from "./public.controller";
import { HospitalService } from "./hospital.service";
import { LeadService } from "./lead.service";

@Module({
  controllers: [PublicController],
  providers: [HospitalService, LeadService],
  exports: [HospitalService, LeadService]
})
export class PublicModule {}

