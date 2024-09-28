import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TtsModule } from '../tts/tts.module';
import { SentencesService } from './sentences.service';
import { SentencesController } from './sentences.controller';
import { Sentences } from './entities/sentences.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sentences]), TtsModule],
  controllers: [SentencesController],
  providers: [SentencesService],
})
export class SentencesModule {}
