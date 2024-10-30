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
import { Tt } from './entities/tt.entity';

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
  ) { }

  async speak(sentence: string, language: LanguageType): Promise<StreamableFile> {
    const createTtDto: CreateSentencesDto = new CreateSentencesDto();
    createTtDto.sentence = sentence;
    createTtDto.language = language;

    let queryTime = Date.now()
    const foundSentence = await this.existsSentence(createTtDto);
    Logger.log("Received query after " + (Date.now() - queryTime) + "ms", this.constructor.name);

    let audioStream;

    let updated: boolean = false;
    if (!foundSentence || !foundSentence.audio) {

      const synthesizeSpeechCommand = new SynthesizeSpeechCommand({
        Text: sentence,
        VoiceId: voices[voiceType][language] as VoiceId,
        OutputFormat: pollyConfig.outputFormat,
        Engine: voiceType,
      });

      let pollyTime = Date.now();
      Logger.log("Sending request to Polly: " + sentence, this.constructor.name);
      audioStream = await polly.send(synthesizeSpeechCommand);
      Logger.log("Received audio stream after " + (Date.now() - pollyTime) + "ms", this.constructor.name);
      let readStream = audioStream.AudioStream as Readable; 
      let audioBuffer = await this.stream2buffer(readStream); 
      if (!foundSentence) {
        Logger.log("Inserting new sentence with audio", this.constructor.name);
        updated = await this.insertNewSentence(createTtDto, audioBuffer, pollyConfig.outputFormat);

      }
      else {
        Logger.log("Updating sentence with audio", this.constructor.name);
        updated = await this.updateAudio(createTtDto, audioBuffer, pollyConfig.outputFormat);

      }
      audioStream = Readable.from(audioBuffer);

    } else {
      Logger.log("Sentence already exists, update times_used and last_used", this.constructor.name);
      updated = await this.updateTimesUsed(createTtDto);

      audioStream = Readable.from(foundSentence.audio);
    }


    return new StreamableFile(audioStream as Readable);
  }

  async existsSentence(sentence: CreateSentencesDto): Promise<Sentences> {
    const queryResult = await this.SentencesRepository.createQueryBuilder(
      'sentences',
    )
      .where('sentences.sentence = :sen', { sen: sentence.sentence })
      .andWhere('sentences.language = :lan', { lan: sentence.language })
      .getOne();
    return queryResult;
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

  async updateAudio(sentence: CreateSentencesDto, audio: Buffer, format: string): Promise<boolean> {
    const queryResult = await this.SentencesRepository.createQueryBuilder(
      'sentences',
    )
      .update(Sentences)
      .set({
        audio: audio,
        audio_format: format,
      })
      .where('sentence = :sen', { sen: sentence.sentence })
      .andWhere('language = :lan', { lan: sentence.language })
      .execute();

    return queryResult ? true : false;
  }

  async insertNewSentence(sentence: CreateSentencesDto, audio: Buffer, format: string): Promise<boolean> {
    const data: Partial<Sentences> = new Sentences();

    data.sentence = sentence.sentence;
    data.language = (sentence.language as LanguageType) || 'it';
    data.times_used = 1;
    data.last_used = new Date();
    data.audio = audio;
    data.audio_format = format;

    const entity = await this.SentencesRepository.create(data);

    return (await this.SentencesRepository.save(entity)) ? true : false;
  }

  async stream2buffer(stream: Readable): Promise<Buffer> {

    return new Promise<Buffer>((resolve, reject) => {

      const _buf = Array<any>();

      stream.on("data", chunk => _buf.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(_buf)));
      stream.on("error", err => reject(`error converting stream - ${err}`));

    });
  }
}