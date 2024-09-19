import { Injectable } from '@nestjs/common';
import { CreateSentencesDto } from '../sentences/dto/create-sentences.dto';

@Injectable()
export class TtsService {
  create(createTtDto: CreateSentencesDto) {
    // get polly stream
    // pronounce the stream
    // select * from Sentences where sentence===sentence
    // if result!==empty then update times_used++
    // else insert setence
    console.log(createTtDto)
    return createTtDto;
  }

}
