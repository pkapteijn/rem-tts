import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSentencesDto } from './dto/create-sentences.dto';
import { UpdateSentencesDto } from './dto/update-sentences.dto';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Sentences } from './entities/sentences.entity';

import type {ResponseType, LanguageType} from './sentences.types'; 


@Injectable()
export class SentencesService {
  constructor(
    @InjectRepository(Sentences)
    private SentencesRepository: Repository<Sentences>,
  ) {}

  async create(createSentencesDto: CreateSentencesDto): Promise<Sentences> {
    let data: Partial<Sentences> = new Sentences();
     
    data.sentence = createSentencesDto.sentence; 
    data.language = createSentencesDto.language as LanguageType || "it";  
    data.times_used = 1; 
    data.last_used = new Date();
    console.log(data);  
     
    const entity = this.SentencesRepository.create(data);
    
    return await this.SentencesRepository.save(entity); 
  }


  async findAll(): Promise<Sentences[]> {
    const queryResult = await this.SentencesRepository
      .createQueryBuilder("sentences")
      .getMany(); 
    console.log(queryResult); 
    return queryResult; 
  }

  async findOne(id: number): Promise<Sentences> {
    const queryResult = await this.SentencesRepository
      .createQueryBuilder("sentences")
      .where("sentences.id = :id", { id: id })
      .getOneOrFail(); 
    console.log(queryResult); 
    return queryResult; 
  }

  async update(id: number, updateSentencesDto: UpdateSentencesDto): Promise<Sentences> {
    let data: Partial<Sentences> = new Sentences();
    for (let key in updateSentencesDto) {
      data[key] = updateSentencesDto[key]; 
    } 
    console.log(new Date().toISOString() + ": " + JSON.stringify(data));  
     
    const result: UpdateResult = await this.SentencesRepository 
      .createQueryBuilder("sentences") 
      .update("Sentences")
      .set(data)
      .where("sentences.id = :id", {id: id}) 
      .execute(); 
    
    // get the updated object to return
    const queryResult = await this.SentencesRepository
    .createQueryBuilder("sentences")
    .where("sentences.id = :id", { id: id })
    .getOneOrFail(); 
  console.log(queryResult); 
  return queryResult;
  }

  async remove(id: number): Promise<HttpException> {
 
    const queryResult = await this.SentencesRepository
      .createQueryBuilder("sentences")
      .delete()
      .from(Sentences)
      .where("sentences.id = :id", { id: id })
      .execute(); 
    console.log(queryResult);
    throw new HttpException('No Content',  HttpStatus.NO_CONTENT); 
    //return response.status(HttpStatus.NO_CONTENT).send();  
  }
}
