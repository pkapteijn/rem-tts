import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSentencesDto } from './dto/create-sentences.dto';
import { UpdateSentencesDto } from './dto/update-sentences.dto';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sentences } from './entities/sentences.entity';

type ResponseType = {message: string, statusCode: number}

@Injectable()
export class SentencesService {
  constructor(
    @InjectRepository(Sentences)
    private SentencesRepository: Repository<Sentences>,
  ) {}

  async create(createSentencesDto: CreateSentencesDto): Promise<Sentences> {
    let data: Partial<Sentences> = new Sentences();
    console.log(createSentencesDto); 
    data.sentence = createSentencesDto.sentence; 
    data.language = createSentencesDto.language || "it";  
    data.times_used = 1; 
    data.last_used = new Date();
    console.log(data);  
    const entity = this.SentencesRepository.create(data);
    return this.SentencesRepository.save(entity);
  } 


  findAll( response: Response) {
    const resp: ResponseType = {message: 'my response message', statusCode: HttpStatus.NOT_FOUND}; 
 
    return response.status(HttpStatus.NOT_FOUND).send(resp);
  }

  findOne(id: number) {
    return `This action returns a #${id} Sentences`;
  }

  update(id: number, updateSentencesDto: UpdateSentencesDto) {
    return `This action updates a #${id} Sentences`;
  }

  remove(id: number) {
    return `This action removes a #${id} Sentences`;
  }
}
