import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewResourceModule } from './new-resource/new-resource.module';

@Module({
  imports: [NewResourceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
