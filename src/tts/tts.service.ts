import { Injectable, StreamableFile, Logger } from '@nestjs/common';
import { CreateSentencesDto } from '../sentences/dto/create-sentences.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Engine,
  PollyClient,
  SynthesizeSpeechCommand,
  VoiceId,
} from '@aws-sdk/client-polly';
import { Sentences } from '../sentences/entities/sentences.entity';
import { LanguageType } from '../sentences/sentences.types';
import { Readable } from 'stream';
import { PollyConfig } from '../config/polly-config';

const pollyConfig = new PollyConfig(); 
Logger.log("Polly config: " + pollyConfig.log(), 'TTS')
const voiceType: Engine = pollyConfig.voiceType;
const voices = pollyConfig.voices; 

const polly = new PollyClient({});

@Injectable()
export class TtsService {
  constructor(
    @InjectRepository(Sentences)
    private SentencesRepository: Repository<Sentences>,
  ) {}

  async speak(sentence: string, language: LanguageType ): Promise<StreamableFile> {
    const createTtDto: CreateSentencesDto = new CreateSentencesDto();
    createTtDto.sentence = sentence;
    createTtDto.language = language;

    const found = await this.existsSentence(createTtDto);

    let updated: boolean = false;
    if (found) {
      Logger.log("Sentence already exists, update times_used and last_used", this.constructor.name); 
      updated = await this.updateTimesUsed(createTtDto);
    } else {
      Logger.log("Inserting new sentence", this.constructor.name); 
      updated = await this.insertNewSentence(createTtDto);
    }

    const synthesizeSpeechCommand = new SynthesizeSpeechCommand({
      Text: sentence,
      VoiceId: voices[voiceType][language] as VoiceId,
      OutputFormat: pollyConfig.outputFormat,
      Engine: voiceType,
    });

    Logger.log("Sending request to Polly: " + sentence, this.constructor.name); 
    const { AudioStream } = await polly.send(synthesizeSpeechCommand);
    Logger.log("Returning audio stream", this.constructor.name); 

    return new StreamableFile(AudioStream as Readable);
  }

  async existsSentence(sentence: CreateSentencesDto): Promise<boolean> {
    const queryResult = await this.SentencesRepository.createQueryBuilder(
      'sentences',
    )
      .where('sentences.sentence = :sen', { sen: sentence.sentence })
      .andWhere('sentences.language = :lan', { lan: sentence.language })
      .getOne();
    return queryResult ? true : false;
  }

  async updateTimesUsed(sentence: CreateSentencesDto): Promise<boolean> {
    const queryResult = await this.SentencesRepository.createQueryBuilder(
      'sentences',
    )
      .update(Sentences)
      .set({
        times_used: () => 'times_used + 1',
        last_used: new Date(),
      })
      .where('sentence = :sen', { sen: sentence.sentence })
      .andWhere('language = :lan', { lan: sentence.language })
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

    return (await this.SentencesRepository.save(entity)) ? true : false;
  }
}
