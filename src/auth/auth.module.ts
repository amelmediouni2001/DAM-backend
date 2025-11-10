import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiration = configService.get<string>('JWT_EXPIRATION');
        
        console.log('JWT Config:', { 
          secret: secret ? 'SET' : 'MISSING', 
          expiration 
        });
        
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }

        // Convert string expiration to number of seconds
        let expiresIn: number;
        if (expiration && expiration.endsWith('d')) {
          // Convert days to seconds (e.g., '7d' -> 7 * 24 * 60 * 60)
          expiresIn = parseInt(expiration) * 24 * 60 * 60;
        } else if (expiration && expiration.endsWith('h')) {
          // Convert hours to seconds (e.g., '24h' -> 24 * 60 * 60)
          expiresIn = parseInt(expiration) * 60 * 60;
        } else {
          // Default to 7 days if not specified or invalid
          expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
        }

        console.log('JWT expiresIn (seconds):', expiresIn);

        return {
          secret: secret,
          signOptions: { 
            expiresIn: expiresIn // Now it's a number
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}