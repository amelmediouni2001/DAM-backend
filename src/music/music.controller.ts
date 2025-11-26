import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MusicService } from './music.service';
import { RecognizeResponseDto } from './dto/recognize-response.dto';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  /**
   * Recognize song from uploaded audio file
   * POST /music/recognize
   * @param file - Audio file (WAV/PCM/MP3) from multipart/form-data
   * @returns Song metadata with title, artist, album, and confidence
   */
  @Post('recognize')
  @UseInterceptors(
    FileInterceptor('audio', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
      },
      fileFilter: (req, file, cb) => {
        // Accept audio files only
        const allowedMimeTypes = [
          'audio/wav',
          'audio/wave',
          'audio/x-wav',
          'audio/mpeg',
          'audio/mp3',
          'audio/mp4',
          'audio/m4a',
          'audio/x-m4a',
          'audio/aac',
          'audio/pcm',
          'audio/l16',
          'audio/*',
          'application/octet-stream',
        ];

        if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(/\.(wav|mp3|pcm|m4a|aac)$/i)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only audio files are allowed'), false);
        }
      },
    }),
  )
  async recognizeSong(
    @UploadedFile() file: any,
  ): Promise<RecognizeResponseDto> {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    return this.musicService.recognizeSong(file.buffer);
  }
}
