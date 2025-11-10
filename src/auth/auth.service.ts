import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import axios from 'axios';

interface GoogleTokenInfo {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

interface FacebookUserInfo {
  id: string;
  email?: string;
  name?: string;
  picture?: {
    data: { url: string };
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async googleLogin(token: string) {
    try {
      console.log('Google login attempt with token:', token ? `${token.substring(0, 20)}...` : 'NULL');

      // Validate token presence
      if (!token) {
        throw new BadRequestException('Google token is required');
      }

      const { data } = await axios.get<GoogleTokenInfo>(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
      );

      console.log('Google token info:', data);

      if (!data.email) {
        throw new BadRequestException('Email not found in Google token');
      }

      const { email, name, picture, sub: googleId } = data;

      // Find or create user
      let user = await this.userModel.findOne({
        provider: 'google',
        providerId: googleId,
      });

      if (!user) {
        const existing = await this.userModel.findOne({ email });
        if (existing) {
          user = await this.userModel.findByIdAndUpdate(
            existing._id,
            {
              provider: 'google',
              providerId: googleId,
              photoUrl: picture,
              name: name ?? existing.name,
            },
            { new: true }
          );
          if (!user) {
            throw new UnauthorizedException('Failed to update user');
          }
        } else {
          user = await this.userModel.create({
            email,
            name,
            photoUrl: picture,
            provider: 'google',
            providerId: googleId,
          });
        }
      }

      console.log('User found/created:', user._id);
      return this.generateAuthResponse(user);
    } catch (error: any) {
      console.error('Google login error:', error.response?.data ?? error.message);
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Google token');
    }
  }

async facebookLogin(token: string) {
    try {
        console.log('Facebook login attempt with token:', token ? `${token.substring(0, 20)}...` : 'NULL');

        if (!token) {
            throw new BadRequestException('Facebook token is required');
        }

        // Test the token first
        const testUrl = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
        console.log('Testing Facebook token...');
        
        const debugResponse = await axios.get(testUrl);
        console.log('Facebook token debug:', debugResponse.data);

        // Get user info
        const { data } = await axios.get<FacebookUserInfo>(
            `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
        );

        console.log('Facebook user info:', data);

        if (!data.email) {
            throw new BadRequestException('Email not found in Facebook token');
        }

        const { id: facebookId, email, name, picture } = data;
        const photoUrl = picture?.data?.url;

        let user = await this.userModel.findOne({
            provider: 'facebook',
            providerId: facebookId,
        });

        if (!user) {
            const existing = await this.userModel.findOne({ email });
            if (existing) {
                user = await this.userModel.findByIdAndUpdate(
                    existing._id,
                    {
                        provider: 'facebook',
                        providerId: facebookId,
                        photoUrl,
                        name: name ?? existing.name,
                    },
                    { new: true }
                );
                if (!user) {
                    throw new UnauthorizedException('Failed to update user');
                }
            } else {
                user = await this.userModel.create({
                    email,
                    name,
                    photoUrl,
                    provider: 'facebook',
                    providerId: facebookId,
                });
            }
        }

        console.log('Facebook user found/created:', user._id);
        return this.generateAuthResponse(user);
    } catch (error: any) {
        console.error('Facebook login error:', error.response?.data ?? error.message);
        if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
            throw error;
        }
        throw new UnauthorizedException('Invalid Facebook token');
    }
}

  private generateAuthResponse(user: UserDocument) {
    try {
      console.log('Generating auth response for user:', user._id);
      
      const payload = {
        sub: String(user._id),
        email: user.email,
        provider: user.provider,
      };

      // Generate JWT token
      const accessToken = this.jwtService.sign(payload);
      
      console.log('JWT token generated:', accessToken ? `${accessToken.substring(0, 20)}...` : 'NULL');

      if (!accessToken) {
        throw new InternalServerErrorException('Failed to generate JWT token');
      }

      const safeUser = {
        id: String(user._id),
        email: user.email ?? '',
        name: user.name ?? '',
        photoUrl: user.photoUrl ?? '',
        provider: user.provider ?? '',
        score: user.score ?? 0,
        level: user.level ?? 1,
      };

      const response = {
        accessToken,
        user: safeUser,
      };

      console.log('Auth response generated successfully');
      return response;
    } catch (error) {
      console.error('Error generating auth response:', error);
      throw new InternalServerErrorException('Failed to generate authentication response');
    }
  }

  async validateUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.isActive === false) {
      throw new UnauthorizedException('User account is inactive');
    }
    return user;
  }
}