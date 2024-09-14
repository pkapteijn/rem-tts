import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { NewResourceService } from './new-resource.service';
import { CreateNewResourceDto } from './dto/create-new-resource.dto';
import { UpdateNewResourceDto } from './dto/update-new-resource.dto';
import { Response } from 'express';

@Controller('new-resource')
export class NewResourceController {
  constructor(private readonly newResourceService: NewResourceService) {}

  @Post()
  create(@Body() createNewResourceDto: CreateNewResourceDto) {
    return this.newResourceService.create(createNewResourceDto);
  }

  @Get()
  findAll(@Res() response: Response) {
    return this.newResourceService.findAll(response);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newResourceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewResourceDto: UpdateNewResourceDto) {
    return this.newResourceService.update(+id, updateNewResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newResourceService.remove(+id);
  }
}
