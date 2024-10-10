import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateSentencesDto } from './dto/create-sentences.dto';
import { UpdateSentencesDto } from './dto/update-sentences.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Sentences } from './entities/sentences.entity';

import type { LanguageType } from './sentences.types';

@Injectable()
export class SentencesService {
  constructor(
    @InjectRepository(Sentences)
    private SentencesRepository: Repository<Sentences>,
  ) { }

  async create(createSentencesDto: CreateSentencesDto): Promise<Sentences> {
    const data: Partial<Sentences> = new Sentences();

    data.sentence = createSentencesDto.sentence;
    data.language = (createSentencesDto.language as LanguageType) || 'it';
    data.times_used = 1;
    data.last_used = new Date();

    Logger.log('Creating: ' + JSON.stringify(data), this.constructor.name);

    const entity = this.SentencesRepository.create(data);

    return await this.SentencesRepository.save(entity);
  }

  async findAll(): Promise<Sentences[]> {
    Logger.log('Querying all', this.constructor.name);

    const queryResult = await this.SentencesRepository.createQueryBuilder(
      'sentences',
    )
      .orderBy('sentences.times_used', 'DESC')
      .getMany();

    return queryResult;
  }

  async findOne(id: number): Promise<Sentences> {
    Logger.log('Querying one: ' + id, 'Sentences');

    const queryResult = await this.SentencesRepository.createQueryBuilder(
      'sentences',
    )
      .where('sentences.id = :id', { id: id })
      .getOneOrFail();

    return queryResult;
  }

  async update(
    id: number,
    updateSentencesDto: UpdateSentencesDto,
  ): Promise<Sentences> {
    const data: Partial<Sentences> = new Sentences();
    for (const key in updateSentencesDto) {
      data[key] = updateSentencesDto[key];
    }
    Logger.log('Updating: ' + JSON.stringify(data), this.constructor.name);

    const result: UpdateResult =
      await this.SentencesRepository.createQueryBuilder('sentences')
        .update('Sentences')
        .set(data)
        .where('sentences.id = :id', { id: id })
        .execute();

    //get the updated object to return
    const queryResult = await this.SentencesRepository.createQueryBuilder(
      'sentences',
    )
      .where('sentences.id = :id', { id: id })
      .getOneOrFail();

    return queryResult;
  }

  async remove(id: number): Promise<HttpException> {
    Logger.log('Deleting: ' + id, this.constructor.name);

    const queryResult = await this.SentencesRepository.createQueryBuilder(
      'sentences',
    )
      .delete()
      .from(Sentences)
      .where('sentences.id = :id', { id: id })
      .execute();

    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }
}
