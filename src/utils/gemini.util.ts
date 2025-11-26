import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private apiKeyConfigured = false;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey || apiKey === 'your-gemini-api-key-from-google-ai-studio') {
      this.logger.warn('GEMINI_API_KEY is not configured. AI avatar generation will not be available.');
      this.logger.warn('Get your API key from: https://makersuite.google.com/app/apikey');
      this.apiKeyConfigured = false;
    } else {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-2.5-flash - stable version released June 2025
        // Supports generateContent method which we need for avatar generation
        this.model = this.genAI.getGenerativeModel({ 
          model: 'gemini-2.5-flash',
          generationConfig: {
            temperature: 0.9,
            topK: 64,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        });
        this.apiKeyConfigured = true;
        this.logger.log('Gemini AI initialized successfully with model: gemini-2.5-flash');
      } catch (error) {
        this.logger.error('Failed to initialize Gemini AI:', error);
        this.apiKeyConfigured = false;
      }
    }
  }

  private checkApiKey() {
    if (!this.apiKeyConfigured || !this.model) {
      throw new BadRequestException(
        'Gemini AI is not configured. Please add GEMINI_API_KEY to your .env file. ' +
        'Get your API key from: https://makersuite.google.com/app/apikey'
      );
    }
  }

  /**
   * Generate an avatar image based on user prompt
   * @param prompt User's description of the avatar (e.g., "Naruto from anime", "Mickey Mouse")
   * @param style Style preference (anime, cartoon, pixel, realistic)
   * @returns Base64 encoded image or image URL
   */
  async generateAvatarImage(prompt: string, style: string = 'cartoon'): Promise<string> {
    try {
      // Create a detailed prompt for kid-friendly avatar generation
      const enhancedPrompt = this.buildAvatarPrompt(prompt, style);

      this.logger.log(`Generating avatar with prompt: ${enhancedPrompt}`);

      // Note: Gemini API doesn't directly generate images, but can help create detailed descriptions
      // For actual image generation, you would typically use:
      // 1. Imagen API (Google's image generation API)
      // 2. DALL-E API
      // 3. Stable Diffusion API
      // 4. Ready Player Me with custom parameters

      // For now, we'll use Gemini to enhance the prompt and then use an image generation service
      const result = await this.model.generateContent(enhancedPrompt);
      const response = await result.response;
      const enhancedDescription = response.text();

      this.logger.log(`Enhanced description: ${enhancedDescription}`);

      // Return the enhanced description for now
      // In production, you would call an image generation API here
      return enhancedDescription;
    } catch (error) {
      this.logger.error('Error generating avatar with Gemini:', error);
      throw new BadRequestException('Failed to generate avatar image');
    }
  }

  /**
   * Generate detailed avatar description using Gemini
   * This can help create better prompts for image generation APIs
   */
  async generateAvatarDescription(userPrompt: string, style: string): Promise<{
    description: string;
    suggestedAttributes: {
      bodyType: string;
      skinTone: string;
      hairstyle: string;
      hairColor: string;
      eyeStyle: string;
      eyeColor: string;
      clothingType: string;
      clothingColor: string;
      accessories: string[];
    };
  }> {
    try {
      const prompt = `
You are a kid-friendly avatar designer. Based on this description: "${userPrompt}", create a detailed avatar design in ${style} style.

Provide your response in the following JSON format:
{
  "description": "A detailed, kid-friendly description of the avatar (2-3 sentences)",
  "suggestedAttributes": {
    "bodyType": "choose from: slim, round, athletic, medium",
    "skinTone": "choose from: light, medium, tan, dark, brown",
    "hairstyle": "choose from: short, long, curly, straight, spiky, braided, ponytail",
    "hairColor": "choose from: black, brown, blonde, red, blue, pink, purple, green",
    "eyeStyle": "choose from: round, almond, cat, big, small",
    "eyeColor": "choose from: blue, brown, green, hazel, amber, gray",
    "clothingType": "choose from: casual, formal, sporty, superhero, fantasy, school",
    "clothingColor": "a specific color name",
    "accessories": ["array of 1-3 accessories like: glasses, hat, cape, mask, headband, bow"]
  }
}

Important:
- Keep all content appropriate for children
- Make the avatar fun, friendly, and engaging
- If the prompt mentions a character (like "Naruto" or "Mickey Mouse"), create an original avatar inspired by that character's style, not an exact copy
- Respond ONLY with valid JSON, no additional text
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const avatarData = JSON.parse(cleanedText);

      return avatarData;
    } catch (error) {
      this.logger.error('Error generating avatar description:', error);
      throw new BadRequestException('Failed to generate avatar description');
    }
  }

  /**
   * Build an enhanced prompt for avatar generation
   */
  private buildAvatarPrompt(userPrompt: string, style: string): string {
    return `
Create a detailed description for a kid-friendly avatar image with these specifications:

User Request: "${userPrompt}"
Style: ${style}

Generate a comprehensive description for an avatar that:
1. Is appropriate for children (ages 5-12)
2. Is colorful, fun, and engaging
3. Follows the ${style} art style
4. If based on a character, is inspired by but not an exact copy of that character
5. Includes details about: body type, face features, hair, clothing, colors, and accessories
6. Has a friendly and welcoming appearance

Provide a single paragraph description (100-150 words) that could be used to generate or draw this avatar.
`;
  }

  /**
   * Validate if a prompt is appropriate for kids
   */
  async validatePromptSafety(prompt: string): Promise<{ isSafe: boolean; reason?: string }> {
    try {
      const safetyPrompt = `
Analyze this prompt for a children's avatar creation: "${prompt}"

Determine if this prompt is appropriate for children ages 5-12.
Consider the following:

ALLOW (these are safe):
- Character names from popular cartoons, anime, games (e.g., Naruto, Mickey Mouse, Pokemon)
- References to heroes, superheroes, princesses, animals
- Fantasy themes (wizards, knights, dragons in non-scary contexts)
- Sports, professions, hobbies

BLOCK ONLY if the prompt contains:
- Explicit violence, gore, weapons with violent intent
- Horror themes, scary monsters designed to frighten
- Sexual or romantic adult content
- Hate speech, discrimination, bullying themes
- Dangerous activities that could harm children

Note: Character references from kids' media are SAFE and ALLOWED, even if copyrighted, as we'll create inspired versions, not exact copies.

Respond in JSON format:
{
  "isSafe": true or false,
  "reason": "explanation if not safe, or 'safe' if it is safe"
}

Only respond with valid JSON.
`;

      const result = await this.model.generateContent(safetyPrompt);
      const response = await result.response;
      const text = response.text();

      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const safetyResult = JSON.parse(cleanedText);

      return safetyResult;
    } catch (error) {
      this.logger.error('Error validating prompt safety:', error);
      // Default to safe if validation fails
      return { isSafe: true };
    }
  }

  /**
   * Generate a Ready Player Me URL based on Gemini's suggestions
   * This creates a Ready Player Me avatar URL with customization parameters
   */
  generateReadyPlayerMeUrl(attributes: any): string {
    // Ready Player Me base URL
    const baseUrl = 'https://api.readyplayer.me/v1/avatars';
    
    // You can customize this based on Ready Player Me's API parameters
    // This is a simplified example - check Ready Player Me docs for full parameters
    return `${baseUrl}?style=${attributes.bodyType || 'normal'}`;
  }
}
