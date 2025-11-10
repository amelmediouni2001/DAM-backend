import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-token';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-token') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
    });
  }

  // passport-google-token calls validate with (accessToken, refreshToken, profile, done)
  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    // Simply pass the profile through; controller/service will handle user creation
    done(null, profile);
  }
}
