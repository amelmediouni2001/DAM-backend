import { Controller, Post, Body, UseGuards, Get, Request, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SocialLoginDto, AuthResponseDto } from './dto/social-login.dto';
import { DevLoginDto } from './dto/dev-login.dto';
import { HmacAuthGuard } from './hmac-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('social-login')
  async socialLogin(@Body() dto: SocialLoginDto): Promise<AuthResponseDto> {
    if (dto.provider === 'google') {
      return this.authService.googleLogin(dto.token);
    } else if (dto.provider === 'facebook') {
      return this.authService.facebookLogin(dto.token);
    }
    throw new Error('Invalid provider');
  }

  @Post('dev-login')
  async devLogin(@Body() dto: DevLoginDto): Promise<AuthResponseDto> {
    return this.authService.devLogin(dto.email, dto.name);
  }

  @UseGuards(HmacAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
@Get('google/callback')
async googleAuthRedirect(@Request() req) {
  return this.authService.googleLogin(req);
}

  @UseGuards(HmacAuthGuard)
  @Get('verify')
  verifyToken(@Request() req) {
    return {
      valid: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
      },
    };
  }

  @UseGuards(HmacAuthGuard)
  @Patch('update-name')
  async updateName(@Request() req, @Body() body: { name: string }) {
    const userId = req.user._id;
    return this.authService.updateUserName(userId, body.name);
  }
}