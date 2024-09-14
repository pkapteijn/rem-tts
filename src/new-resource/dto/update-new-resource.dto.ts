import { PartialType } from '@nestjs/mapped-types';
import { CreateNewResourceDto } from './create-new-resource.dto';

export class UpdateNewResourceDto extends PartialType(CreateNewResourceDto) {}
