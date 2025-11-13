import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class SocialLoginDto {
  @IsString()
  @IsNotEmpty()
  token: string; // Token OAuth reçu de Google/Facebook

  @IsEnum(['google', 'facebook'])
  provider: 'google' | 'facebook';
}

export class AuthResponseDto {
  providerId: string;
  authToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    photoUrl?: string;
    provider: string;
    providerId: string;
    score: number;
    level: number;
  };
}