import { PartialType } from '@nestjs/mapped-types';
import { CreateSentencesDto } from './create-sentences.dto';

export class UpdateSentencesDto extends PartialType(CreateSentencesDto) {}
