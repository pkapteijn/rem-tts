import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TtsModule } from 'src/tts/tts.module';
import { SentencesService } from './sentences.service';
import { SentencesController } from './sentences.controller';
import { Sentences } from './entities/sentences.entity';
import { DbConfig } from '../../config/db-config';

const dbconfig = new DbConfig();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbconfig.host,
      port: dbconfig.port,
      username: dbconfig.user,
      password: dbconfig.pwd,
      database: dbconfig.database,
      entities: [Sentences],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Sentences]),
    TtsModule
  ],
  controllers: [SentencesController],
  providers: [SentencesService],
})
export class SentencesModule {}
