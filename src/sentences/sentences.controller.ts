import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SentencesService } from './sentences.service';
import { CreateSentencesDto } from './dto/create-sentences.dto';
import { UpdateSentencesDto } from './dto/update-sentences.dto';

@Controller('sentences')
export class SentencesController {
  constructor(private readonly sentencesService: SentencesService) {}

  @Post()
  create(@Body() createSentencesDto: CreateSentencesDto) {
    return this.sentencesService.create(createSentencesDto);
  }

  @Get()
  findAll() {
    return this.sentencesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: string) {
  //   return this.sentencesService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateSentencesDto: UpdateSentencesDto,
  ) {
    return this.sentencesService.update(+id, updateSentencesDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.sentencesService.remove(+id);
  }
}
