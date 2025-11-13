import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import * as crypto from 'crypto';

/**
 * HMAC-based authentication guard (replaces JWT)
 * 
 * Validates HMAC signature in request headers:
 *   X-Provider-ID: <google_user_id>
 *   X-Auth-Token: <hmac_signature>
 * 
 * Usage: @UseGuards(HmacAuthGuard)
 */
@Injectable()
export class HmacAuthGuard implements CanActivate {
  private readonly hmacSecret: string;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    this.hmacSecret = configService.get<string>('HMAC_SECRET') ||
      configService.get<string>('JWT_SECRET') ||
      'default-secret-change-in-production';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const providerId = request.headers['x-provider-id'] as string;
    const authToken = request.headers['x-auth-token'] as string;

    if (!providerId || !authToken) {
      throw new UnauthorizedException(
        'Missing authentication headers. Send X-Provider-ID and X-Auth-Token',
      );
    }

    // Validate HMAC signature
    if (!this.validateSignature(providerId, authToken)) {
      throw new UnauthorizedException('Invalid authentication signature');
    }

    // Find and validate user
    try {
      const user = await this.authService.validateUserByProviderId(
        providerId,
        'google',
      );
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        error.message || 'User validation failed',
      );
    }
  }

  /**
   * Validate HMAC signature using timing-safe comparison
   */
  private validateSignature(providerId: string, signature: string): boolean {
    const calculatedSignature = this.calculateSignature(providerId);
    return this.timingSafeCompare(signature, calculatedSignature);
  }

  /**
   * Calculate HMAC-SHA256 signature for providerId
   */
  private calculateSignature(providerId: string): string {
    return crypto
      .createHmac('sha256', this.hmacSecret)
      .update(providerId)
      .digest('hex');
  }

  /**
   * Timing-safe string comparison (prevents timing attacks)
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
