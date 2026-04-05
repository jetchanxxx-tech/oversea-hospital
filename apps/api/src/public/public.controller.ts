import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { HospitalService } from "./hospital.service";
import { LeadService } from "./lead.service";
import type { City, LeadCreateInput } from "./dto";

@Controller("/public")
export class PublicController {
  constructor(
    private readonly hospitalService: HospitalService,
    private readonly leadService: LeadService
  ) {}

  @Get("/hospitals")
  async listHospitals(@Query("q") q?: string, @Query("city") city?: string) {
    const cityVal: City | undefined =
      city === "Guangzhou" || city === "Shenzhen" ? (city as City) : undefined;
    const items = await this.hospitalService.list(q, cityVal);
    return { items };
  }

  @Get("/hospitals/:id")
  async getHospital(@Param("id") id: string) {
    const item = await this.hospitalService.getById(id);
    return { item };
  }

  @Post("/leads")
  async createLead(@Body() body: LeadCreateInput) {
    const result = await this.leadService.create(body);
    return { ok: true, ...result };
  }
}

