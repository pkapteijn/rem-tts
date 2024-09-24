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
import { LanguageType } from 'src/sentences/sentences.types';
import { Readable } from 'stream';

const voiceType: Engine = 'neural';
const voices = {
  standard: {
    it: 'Giorgio',
    en: 'Brian',
    nl: 'Ruben',
  },
  neural: {
    it: 'Adriano',
    en: 'Joey',
    nl: 'Laura',
  },
};
const polly = new PollyClient({});

@Injectable()
export class TtsService {
  constructor(
    @InjectRepository(Sentences)
    private SentencesRepository: Repository<Sentences>,
  ) {}

  async speak(
    sentence: string,
    language: LanguageType,
  ): Promise<StreamableFile> {
    const createTtDto: CreateSentencesDto = new CreateSentencesDto();
    createTtDto.sentence = sentence;
    createTtDto.language = language;

    const found = await this.existsSentence(createTtDto);

    let updated: boolean = false;
    if (found) {
      updated = await this.updateTimesUsed(createTtDto);
    } else {
      updated = await this.insertNewSentence(createTtDto);
    }
    const synthesizeSpeechCommand = new SynthesizeSpeechCommand({
      Text: sentence,
      VoiceId: voices[voiceType][language] as VoiceId,
      OutputFormat: 'mp3',
      Engine: voiceType,
    });
    Logger.log("Sending request to Polly: " + sentence, 'TTS'); 
    Logger.log("Aws keys: " + process.env.AWS_ACCESS_KEY_ID, 'TTS')
    const { AudioStream } = await polly.send(synthesizeSpeechCommand);
    Logger.log("Returning audio stream", 'TTS'); 
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
