import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * HMAC-based authentication strategy (no JWT)
 * 
 * Client sends:
 *   X-Provider-ID: <google_user_id>
 *   X-Auth-Token: <hmac_signature>
 * 
 * Backend validates HMAC and finds user by providerId
 */
@Injectable()
export class HmacAuthStrategy extends PassportStrategy(Strategy, 'hmac') {
  private readonly hmacSecret: string;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super();
    this.hmacSecret = configService.get<string>('HMAC_SECRET') || 
                      configService.get<string>('JWT_SECRET') || 
                      'default-secret-change-in-production';
  }

  /**
   * Validate HMAC signature for incoming request
   */
  async validate(req: Request): Promise<any> {
    const providerId = req.headers['x-provider-id'] as string;
    const authToken = req.headers['x-auth-token'] as string;

    if (!providerId || !authToken) {
      throw new UnauthorizedException('Missing providerId or authToken in headers');
    }

    // Recalculate HMAC
    const calculatedHmac = this.calculateHmac(providerId);

    // Constant-time comparison to prevent timing attacks
    if (!this.timingSafeCompare(authToken, calculatedHmac)) {
      throw new UnauthorizedException('Invalid authToken signature');
    }

    // Find user by providerId
    const user = await this.authService.validateUserByProviderId(providerId, 'google');

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Calculate HMAC signature for a providerId
   */
  calculateHmac(providerId: string): string {
    return crypto
      .createHmac('sha256', this.hmacSecret)
      .update(providerId)
      .digest('hex');
  }

  /**
   * Timing-safe comparison to prevent timing attacks
   */
  private timingSafeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
}
