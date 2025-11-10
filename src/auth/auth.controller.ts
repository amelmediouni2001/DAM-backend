import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SocialLoginDto, AuthResponseDto } from './dto/social-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
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
}