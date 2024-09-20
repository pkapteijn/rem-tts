import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TtsService } from './tts.service';
import { TtsController } from './tts.controller';
import { Sentences } from '../sentences/entities/sentences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sentences])
  ],  
  controllers: [TtsController],
  providers: [TtsService],
})
export class TtsModule {}
