import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class DevLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
