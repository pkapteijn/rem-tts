import { Injectable } from '@nestjs/common';
import { CreateSentencesDto } from '../sentences/dto/create-sentences.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sentences } from '../sentences/entities/sentences.entity';
import { LanguageType } from 'src/sentences/sentences.types';

@Injectable()
export class TtsService {
  constructor(
    @InjectRepository(Sentences)
    private SentencesRepository: Repository<Sentences>,
  ) {}

  async create(createTtDto: CreateSentencesDto): Promise<CreateSentencesDto> {
    console.log("Start TTS");
    await this.speakSentence(createTtDto);  
    const found = await this.existsSentence(createTtDto); 
    console.log("Foundsentence: " + found); 
    let updated: boolean = false; 
    if (found) {
      updated = await this.updateTimesUsed(createTtDto); 
    }
    else {
      updated = await this.insertNewSentence(createTtDto); 
    }
    console.log("Updated: " + updated); 
    return createTtDto;
  }

  async speakSentence(sentence: CreateSentencesDto): Promise<any> {
    console.log("Placeholder TTS action: " + sentence.sentence); 
    return; 
  }

  async existsSentence(sentence: CreateSentencesDto): Promise<boolean> {
    const queryResult = await this.SentencesRepository
      .createQueryBuilder('sentences')
      .where('sentences.sentence = :sen', { sen: sentence.sentence })
      .andWhere('sentences.language = :lan', { lan: sentence.language })
      .getOne();
    return queryResult ? true : false; 
    }  

  async updateTimesUsed(sentence: CreateSentencesDto): Promise<boolean> {
    const queryResult = await this.SentencesRepository
      .createQueryBuilder('sentences')
      .update(Sentences)
      .set({
        times_used: () => "times_used + 1",
        last_used: new Date()
      })
      .where("sentence = :sen", { sen: sentence.sentence })
      .andWhere("language = :lan", { lan: sentence.language})
      .execute(); 
      
    return queryResult ? true : false; 
  }

async insertNewSentence(sentence: CreateSentencesDto): Promise<boolean> {
    const data: Partial<Sentences> = new Sentences();

    data.sentence = sentence.sentence;
    data.language = (sentence.language as LanguageType) || 'it';
    data.times_used = 1;
    data.last_used = new Date();

    const entity = await this.SentencesRepository.create(data);

    return await this.SentencesRepository.save(entity) ?  true : false;
  }

}
