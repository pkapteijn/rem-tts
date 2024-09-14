import { Test, TestingModule } from '@nestjs/testing';
import { NewResourceService } from './new-resource.service';

describe('NewResourceService', () => {
  let service: NewResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewResourceService],
    }).compile();

    service = module.get<NewResourceService>(NewResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
