import { Controller, Post, Body } from '@nestjs/common';
import { TtsService } from './tts.service';
import { CreateSentencesDto } from '../sentences/dto/create-sentences.dto';

@Controller('sentences/tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post()
  create(@Body() createTtDto: CreateSentencesDto) {
    return this.ttsService.create(createTtDto);
  }

}

