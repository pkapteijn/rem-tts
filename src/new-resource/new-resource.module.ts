import { Module } from '@nestjs/common';
import { NewResourceService } from './new-resource.service';
import { NewResourceController } from './new-resource.controller';

@Module({
  controllers: [NewResourceController],
  providers: [NewResourceService],
})
export class NewResourceModule {}
