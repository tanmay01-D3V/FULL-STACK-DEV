import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader || typeof authHeader !== "string") {
      throw new UnauthorizedException("Authorization header missing");
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid auth');
    }
  }
}