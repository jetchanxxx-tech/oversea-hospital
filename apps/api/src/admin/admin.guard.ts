import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { loadEnv } from "../env";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { headers: any }>();
    const key = String((req.headers as any)["x-admin-key"] ?? "");
    const env = loadEnv();
    if (!env.adminApiKey || env.adminApiKey === "change-me") {
      throw new UnauthorizedException("ADMIN_API_KEY not configured");
    }
    if (key !== env.adminApiKey) {
      throw new UnauthorizedException("Unauthorized");
    }
    return true;
  }
}

