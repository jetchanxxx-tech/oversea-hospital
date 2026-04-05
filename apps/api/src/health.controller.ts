import { Controller, Get } from "@nestjs/common";
import { pingDb } from "./db";

@Controller()
export class HealthController {
  @Get("/health")
  async health() {
    await pingDb();
    return { ok: true };
  }
}

