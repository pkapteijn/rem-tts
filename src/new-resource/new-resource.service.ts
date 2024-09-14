import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateNewResourceDto } from './dto/create-new-resource.dto';
import { UpdateNewResourceDto } from './dto/update-new-resource.dto';
import { Response } from 'express';

type ResponseType = {message: string, statusCode: number}

@Injectable()
export class NewResourceService {
  create(createNewResourceDto: CreateNewResourceDto) {
    return 'This action adds a new newResource';
  }

  findAll( response: Response) {
    const resp: ResponseType = {message: 'my response message', statusCode: HttpStatus.NOT_FOUND}; 
 
    return response.status(HttpStatus.NOT_FOUND).send(resp);
  }

  findOne(id: number) {
    return `This action returns a #${id} newResource`;
  }

  update(id: number, updateNewResourceDto: UpdateNewResourceDto) {
    return `This action updates a #${id} newResource`;
  }

  remove(id: number) {
    return `This action removes a #${id} newResource`;
  }
}
