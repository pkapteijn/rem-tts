import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TtsService } from './tts.service';
import { mockRepositoryFactory } from '../testing-helpers';
import { Sentences } from '../sentences/entities/sentences.entity';
import { CreateSentencesDto } from '../sentences/dto/create-sentences.dto';
import { LanguageType } from 'src/sentences/sentences.types';

const testSentence1: CreateSentencesDto = {
  sentence: "Test1",
  language: "en",
}



describe('TtsService', () => {
  let service: TtsService;
  let repo: Repository<Sentences>; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TtsService, {
        provide: getRepositoryToken(Sentences),
        useFactory: mockRepositoryFactory, 
      },],
    }).compile();

    service = module.get<TtsService>(TtsService);
    repo = module.get<Repository<Sentences>>(getRepositoryToken(Sentences));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update an existing sentence when sentence to speak does already exists', async ()=> {
    const existsSpy = jest.spyOn(service, 'existsSentence' ).mockResolvedValue(true);
    const updateSpy = jest.spyOn(service, 'updateTimesUsed' ).mockResolvedValue(true);

    const rcvReadableStream = await service.speak(testSentence1.sentence, testSentence1.language as LanguageType); 
    expect(updateSpy).toHaveBeenCalled(); 
  }); 

  
});
