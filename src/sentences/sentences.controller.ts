import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { SentencesService } from './sentences.service';
import { CreateSentencesDto } from './dto/create-sentences.dto';
import { UpdateSentencesDto } from './dto/update-sentences.dto';
import { Response } from 'express';

@Controller('sentences')
export class SentencesController {
  constructor(private readonly sentencesService: SentencesService) {}

  @Post()
  create(@Body() createSentencesDto: CreateSentencesDto) {
    return this.sentencesService.create(createSentencesDto);
  }

  @Get()
  findAll(@Res() response: Response) {
    return this.sentencesService.findAll(response);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sentencesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSentencesDto: UpdateSentencesDto) {
    return this.sentencesService.update(+id, updateSentencesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sentencesService.remove(+id);
  }
}
