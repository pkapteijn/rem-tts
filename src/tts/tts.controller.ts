import { Controller, Get, Query, StreamableFile, Header } from '@nestjs/common';
import { TtsService } from './tts.service';
import { LanguageType } from 'src/sentences/sentences.types';

@Controller('sentences/tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Get()
  @Header('Content-Type', 'audio/mpeg')
  @Header('Transfer-Encoding', 'chunked')
  @Header('Connection', 'close')
  async speak(
    @Query('sentence') sentence: string,
    @Query('language') language: LanguageType,
  ): Promise<StreamableFile> {
    return this.ttsService.speak(sentence, language);
  }
}
