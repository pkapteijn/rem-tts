import { Test, TestingModule } from '@nestjs/testing';
import { NewResourceController } from './new-resource.controller';
import { NewResourceService } from './new-resource.service';

describe('NewResourceController', () => {
  let controller: NewResourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewResourceController],
      providers: [NewResourceService],
    }).compile();

    controller = module.get<NewResourceController>(NewResourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
