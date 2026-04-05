import { Body, Controller, Get, Header, Post, Query, UseGuards } from "@nestjs/common";
import { AdminGuard } from "./admin.guard";
import { LeadAdminService } from "./lead-admin.service";
import { ResourceService, type ResourceCreateInput } from "./resource.service";

@UseGuards(AdminGuard)
@Controller("/admin")
export class AdminController {
  constructor(
    private readonly leadAdminService: LeadAdminService,
    private readonly resourceService: ResourceService
  ) {}

  @Get("/leads")
  async listLeads(@Query("limit") limit?: string) {
    const n = Math.min(Math.max(Number(limit ?? 50), 1), 500);
    const items = await this.leadAdminService.list(n);
    return { items };
  }

  @Get("/leads/export")
  @Header("content-type", "text/csv; charset=utf-8")
  async exportLeads(@Query("limit") limit?: string) {
    const n = Math.min(Math.max(Number(limit ?? 500), 1), 5000);
    const items = await this.leadAdminService.list(n);
    return this.leadAdminService.toCsv(items);
  }

  @Get("/resources/search")
  async searchResources(@Query("type") type?: string, @Query("q") q?: string, @Query("limit") limit?: string) {
    const n = Math.min(Math.max(Number(limit ?? 20), 1), 200);
    const items = await this.resourceService.search(type, q, n);
    return { items };
  }

  @Post("/resources")
  async createResource(@Body() body: ResourceCreateInput) {
    const result = await this.resourceService.create(body);
    return { ok: true, ...result };
  }
}

