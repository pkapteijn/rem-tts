import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { SentencesController } from './sentences.controller';
import { SentencesService } from './sentences.service';
import { CreateSentencesDto } from './dto/create-sentences.dto';
import { Sentences } from './entities/sentences.entity';
import { UpdateSentencesDto } from './dto/update-sentences.dto';

const testSentence1: CreateSentencesDto = {
  sentence: "Test1", 
  language: "en"
}

const testSentence2: Sentences = {
  id: 1, 
  sentence: "Test1", 
  language: "en", 
  last_used: new Date(), 
  times_used: 1, 
  audio:  null, 
  audio_format: null
}

const testSentence3: UpdateSentencesDto = {
  language: "nl"
}


describe('SentencesController', () => {
  let controller: SentencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SentencesController],
      providers: [
        {
          provide: SentencesService,
          useValue: {
            findAll: jest.fn(() => ([testSentence2])),
            create: jest.fn(() => (testSentence2)),
            update: jest.fn(() => (testSentence2)),
            remove: jest.fn(() => ({})),
          }
    }],
    }).compile();

    controller = module.get<SentencesController>(SentencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should findAll to be equal to testSentence2', () => {
    expect(controller.findAll()).toEqual([testSentence2]);
  });

  it('should create new Sentence', () => {
    expect(controller.create(testSentence1)).toEqual(testSentence2);
  });

  it('should updateate new Sentence', () => {
    expect(controller.update("1", testSentence3)).toEqual(testSentence2);
  });

  it('should be defined', () => {
    expect(controller.remove("1")).toEqual({});
  });

});
