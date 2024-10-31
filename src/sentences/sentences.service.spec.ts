import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { Sentences } from './entities/sentences.entity';
import { SentencesService } from './sentences.service';
import { mockRepositoryFactory} from '../testing-helpers';
import { UpdateSentencesDto } from './dto/update-sentences.dto';

const testSentence1: Sentences = {
  id: 1,
  sentence: "Test1",
  language: "en",
  last_used:  new Date(1727456405505),
  times_used: 1, 
  audio:  null, 
  audio_format: null
}

const updateSentence2: UpdateSentencesDto = {
  language: "nl"
}

const testSentence2: Sentences = {
  id: 2,
  sentence: "Test2",
  language: "nl",
  last_used: new Date(1727456406505),
  times_used: 1, 
  audio:  null, 
  audio_format: null
}

const sentencesArray = [
  testSentence1,
  testSentence2
]

describe('SentencesService', () => {
  let repo: Repository<Sentences>;
  let service: SentencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentencesService, {
        provide: getRepositoryToken(Sentences),
        useFactory: mockRepositoryFactory, 
      },
      ],
    }).compile();

    repo = module.get<Repository<Sentences>>(getRepositoryToken(Sentences));
    service = module.get<SentencesService>(SentencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('findAll', () => {
    it('should return an array of sentences', async () => {
      const repoSpy = jest.spyOn(repo.createQueryBuilder(), 'getMany' ).mockResolvedValue(sentencesArray);
      const selectSpy = jest.spyOn(repo.createQueryBuilder(), 'select' ).mockReturnThis();
      const orderSpy = jest.spyOn(repo.createQueryBuilder(), 'orderBy' ).mockReturnThis();

      const sents = await service.findAll();
      expect(sents).toEqual(sentencesArray);
      expect(orderSpy).toHaveBeenCalledWith('sentences.times_used', 'DESC');
      expect(selectSpy).toHaveBeenCalledTimes(1); 
      expect(repoSpy).toHaveBeenCalledTimes(1); 
    });
  });

  describe('findOne', () => {
    it('should get a single sentence', async () => {
      const whereSpy = jest.spyOn(repo.createQueryBuilder(), 'where' ).mockReturnThis();
      const selectSpy = jest.spyOn(repo.createQueryBuilder(), 'select' ).mockReturnThis();
      const getOneSpy = jest.spyOn(repo.createQueryBuilder(), 'getOneOrFail' ).mockResolvedValue(testSentence1);
      
      const sent = await service.findOne(1);
      expect(sent).toEqual(testSentence1);
      expect(whereSpy).toHaveBeenCalledWith("sentences.id = :id",  { id: 1 } );
      expect(selectSpy).toHaveBeenCalledTimes(1); 
      expect(getOneSpy).toHaveBeenCalledTimes(1); 
    });

    it('should throw a NOT_FOUND exception', async () => {
      const whereSpy = jest.spyOn(repo.createQueryBuilder(), 'where' ).mockReturnThis();
      const selectSpy = jest.spyOn(repo.createQueryBuilder(), 'select' ).mockReturnThis();
      const getOneSpy = jest.spyOn(repo.createQueryBuilder(), 'getOneOrFail' )
        .mockRejectedValue(new EntityNotFoundError(Sentences, { id: 666 }));
      
      await expect(service.findOne(666)).rejects.toThrow(EntityNotFoundError);
      expect(whereSpy).toHaveBeenCalledWith("sentences.id = :id",  { id: 666 } );
      expect(selectSpy).toHaveBeenCalledTimes(1); 
      expect(getOneSpy).toHaveBeenCalledTimes(1); 
    });
  });

  describe('create', () => {
    it('should create a new sentence', async () => {
      const createSpy = jest.spyOn(repo, 'create' ).mockReturnThis();
      const saveSpy = jest.spyOn(repo, 'save' ).mockResolvedValue(testSentence1);
      
      const sent = await service.create(testSentence1);
      expect(sent).toEqual(testSentence1);
      expect(createSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalledTimes(1); 
    });
  });

  describe('update', () => {
    it('should update a  sentence', async () => {
      const updateSpy = jest.spyOn(repo.createQueryBuilder(), 'update' ).mockReturnThis();

      const setSpy = jest.spyOn(repo.createQueryBuilder(), 'set' as never ).mockReturnThis();
      const whereSpy = jest.spyOn(repo.createQueryBuilder(), 'where' ).mockReturnThis();
      const executeSpy = jest.spyOn(repo.createQueryBuilder(), 'execute' ).mockReturnThis();
      const getOneSpy = jest.spyOn(repo.createQueryBuilder(), 'getOneOrFail' ).mockResolvedValue(testSentence2);
      
      const sent = await service.update(2, updateSentence2);
      expect(sent).toEqual(testSentence2);
      expect(updateSpy).toHaveBeenCalled();
      expect(setSpy).toHaveBeenCalledWith(updateSentence2);
      expect(whereSpy).toHaveBeenCalledWith('sentences.id = :id', { id: 2 });
      expect(executeSpy).toHaveBeenCalled();
    });
  });

  describe('remove', () => {

    it('should return a NO_CONTENT', async () => {
      const deleteSpy = jest.spyOn(repo.createQueryBuilder(), 'delete' ).mockReturnThis();
      const fromSpy = jest.spyOn(repo.createQueryBuilder(), 'from' ).mockReturnThis();
      const whereSpy = jest.spyOn(repo.createQueryBuilder(), 'where' ).mockReturnThis(); 
      const executeSpy = jest.spyOn(repo.createQueryBuilder(), 'execute' )
        .mockRejectedValue(new HttpException('No Content', HttpStatus.NO_CONTENT));
      
      await expect(service.remove(666)).rejects.toThrow(HttpException);
      expect(whereSpy).toHaveBeenCalledWith("sentences.id = :id",  { id: 666 } );
      expect(executeSpy).toHaveBeenCalledTimes(1); 
    });
  });

}); 