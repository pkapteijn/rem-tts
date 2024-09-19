import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SentencesModule } from './sentences/sentences.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..',  'frontend'),
      serveRoot: '/frontend/'
    }),
    SentencesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
