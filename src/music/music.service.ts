import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ACRCloudUtil } from '../utils/acrcloud.util';
import { RecognizeResponseDto } from './dto/recognize-response.dto';
import { ValidateNoteDto, ValidateNoteResponseDto } from './dto/validate-note.dto';

@Injectable()
export class MusicService {
  private readonly acrHost: string;
  private readonly acrAccessKey: string;
  private readonly acrAccessSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.acrHost = this.configService.get<string>('ACR_HOST') || '';
    this.acrAccessKey = this.configService.get<string>('ACR_ACCESS_KEY') || '';
    this.acrAccessSecret = this.configService.get<string>('ACR_ACCESS_SECRET') || '';

    if (!this.acrHost || !this.acrAccessKey || !this.acrAccessSecret) {
      throw new Error('ACRCloud credentials are not configured. Please set ACR_HOST, ACR_ACCESS_KEY, and ACR_ACCESS_SECRET in environment variables.');
    }
  }

  /**
   * Recognize song from audio buffer using ACRCloud API
   * @param audioBuffer - Audio file buffer (WAV/PCM/MP3)
   * @returns Song metadata including title, artist, album, and confidence
   */
  async recognizeSong(audioBuffer: Buffer): Promise<RecognizeResponseDto> {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const httpMethod = 'POST';
      const httpUri = '/v1/identify';

      // Generate signature
      const signature = ACRCloudUtil.generateSignature(
        this.acrAccessKey,
        this.acrAccessSecret,
        httpMethod,
        httpUri,
        timestamp,
      );

      // Build form data
      const formData = ACRCloudUtil.buildFormData(
        audioBuffer,
        this.acrAccessKey,
        signature,
        timestamp,
      );

      // Send request to ACRCloud
      const url = `https://${this.acrHost}${httpUri}`;
      const response = await firstValueFrom(
        this.httpService.post(url, formData, {
          headers: formData.getHeaders(),
          timeout: 10000, // 10 seconds timeout
        }),
      );

      // Parse ACRCloud response
      return this.parseACRCloudResponse((response as any).data);
    } catch (error) {
      if (error.response) {
        throw new BadRequestException(
          `ACRCloud API error: ${error.response.data?.status?.msg || 'Unknown error'}`,
        );
      }
      throw new InternalServerErrorException(
        `Failed to recognize song: ${error.message}`,
      );
    }
  }

  /**
   * Parse ACRCloud API response into simplified DTO
   * @param data - Raw ACRCloud response
   * @returns Parsed song metadata
   */
  private parseACRCloudResponse(data: any): RecognizeResponseDto {
    const status = data.status;

    // Check if recognition was successful
    if (status.code !== 0) {
      throw new BadRequestException(
        `Song recognition failed: ${status.msg}`,
      );
    }

    const metadata = data.metadata;
    if (!metadata || !metadata.music || metadata.music.length === 0) {
      throw new BadRequestException('No music found in the audio sample');
    }

    // Get the first (best) match
    const music = metadata.music[0];

    return {
      title: music.title || 'Unknown',
      artist: music.artists?.map((a: any) => a.name).join(', ') || 'Unknown',
      album: music.album?.name || 'Unknown',
      confidence: music.score || 0,
    };
  }

  /**
   * Validate if detected frequency matches expected note
   * Uses ±5% tolerance (same as Android/iOS frontend)
   * @param dto - Frequency and expected note
   * @returns Validation result with detected note
   */
  validateNote(dto: ValidateNoteDto): ValidateNoteResponseDto {
    const { frequency, expectedNote } = dto;

    // Musical note frequencies (Middle C octave - C4 to B4)
    const noteFrequencies: Record<string, number> = {
      do: 261.63,   // C4
      re: 293.66,   // D4
      mi: 329.63,   // E4
      fa: 349.23,   // F4
      sol: 392.00,  // G4
      la: 440.00,   // A4
      si: 493.88,   // B4
    };

    // Normalize input
    const normalizedExpected = expectedNote.toLowerCase()
      .replace(/é|è|ê/g, 'e')
      .replace(/à/g, 'a')
      .trim();

    // Find closest note to detected frequency
    let closestNote: string | null = null;
    let minDistance = Infinity;

    for (const [note, targetFreq] of Object.entries(noteFrequencies)) {
      const distance = Math.abs(frequency - targetFreq);
      const tolerance = targetFreq * 0.05; // 5% tolerance

      if (distance < minDistance && distance < tolerance) {
        minDistance = distance;
        closestNote = note;
      }
    }

    if (!closestNote) {
      return {
        isCorrect: false,
        detectedNote: 'none',
        expectedNote: normalizedExpected,
        frequency,
        message: `Frequency ${frequency.toFixed(1)} Hz doesn't match any note (out of range or too far from target)`,
      };
    }

    // Calculate cents off (for tuning feedback)
    const targetFreq = noteFrequencies[closestNote];
    const centsOff = 1200 * Math.log2(frequency / targetFreq);

    const isCorrect = closestNote === normalizedExpected;

    return {
      isCorrect,
      detectedNote: closestNote,
      expectedNote: normalizedExpected,
      frequency,
      centsOff: Math.round(centsOff),
      message: isCorrect 
        ? `Correct! ${closestNote.toUpperCase()} detected (${centsOff >= 0 ? '+' : ''}${Math.round(centsOff)} cents)`
        : `Wrong note. Expected ${normalizedExpected.toUpperCase()}, but detected ${closestNote.toUpperCase()}`,
    };
  }
}
