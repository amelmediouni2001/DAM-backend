import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
      const crypto = require('crypto');
      const hmacSecret = process.env.HMAC_SECRET || process.env.JWT_SECRET || 'default-secret-change-in-production';

      console.log('Generating auth response for user:', user._id);
      
      // Generate HMAC signature using providerId
      const providerId = user.providerId || String(user._id);
      const authToken = crypto
        .createHmac('sha256', hmacSecret)
        .update(providerId)
        .digest('hex');
      
      console.log('HMAC authToken generated:', authToken ? `${authToken.substring(0, 20)}...` : 'NULL');

      if (!authToken) {
        throw new InternalServerErrorException('Failed to generate authentication token');
      }

      const safeUser = {
        id: String(user._id),
        email: user.email ?? '',
        name: user.name ?? '',
        photoUrl: user.photoUrl ?? '',
        provider: user.provider ?? '',
        score: user.score ?? 0,
        level: user.level ?? 1,
        providerId: providerId ?? '',
      };

      const response = {
        providerId,
        authToken,
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

  // New method: Validate user by providerId (Google OAuth sub)
  async validateUserByProviderId(providerId: string, provider: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      provider,
      providerId,
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.isActive === false) {
      throw new UnauthorizedException('User account is inactive');
    }
    return user;
  }

  // Dev/Test login - creates or finds local user without OAuth
  async devLogin(email: string, name: string) {
    try {
      console.log('Dev login attempt:', email, name);

      // First, try to find user by email (regardless of provider)
      let user = await this.userModel.findOne({ email });

      if (!user) {
        // User doesn't exist, create new one
        const devProviderId = `dev_${Date.now()}`;
        user = await this.userModel.create({
          email,
          name,
          provider: 'local',
          providerId: devProviderId,
          photoUrl: '',
        });
        console.log('Dev user created:', user._id);
      } else {
        // User exists - update provider to 'local' if not already set
        if (!user.provider) {
          user.provider = 'local';
        }
        if (!user.providerId) {
          user.providerId = `dev_${Date.now()}`;
        }
        // Update name if provided and different
        if (name && name !== user.name) {
          user.name = name;
        }
        await user.save();
        console.log('Dev user found and updated:', user._id);
      }

      return this.generateAuthResponse(user);
    } catch (error: any) {
      console.error('Dev login error:', error.message);
      throw new UnauthorizedException('Dev login failed');
    }
  }

  // Update user name
  async updateUserName(userId: string, newName: string) {
    try {
      console.log('Updating user name:', userId, newName);
      
      if (!newName || newName.trim().length === 0) {
        throw new BadRequestException('Name cannot be empty');
      }

      const user = await this.userModel.findByIdAndUpdate(
        userId,
        { name: newName.trim() },
        { new: true }
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      console.log('User name updated successfully:', user.name);
      return {
        success: true,
        name: user.name,
      };
    } catch (error: any) {
      console.error('Update name error:', error.message);
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user name');
    }
  }
}