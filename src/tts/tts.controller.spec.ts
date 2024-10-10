import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';
import { StreamableFile } from '@nestjs/common';
import { Sentences } from '../sentences/entities/sentences.entity';
import { DbConfig } from '../config/db-config';
import { Readable } from 'stream';

const dbconfig = new DbConfig(); 

async function getBufferFromStream(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
      chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}


describe('TtsController', () => {
  let controller: TtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({
        type: dbconfig.dbtype,
        host: dbconfig.host,
        port: dbconfig.port,
        username: dbconfig.user,
        password: dbconfig.pwd,
        database: dbconfig.database,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      TypeOrmModule.forFeature([Sentences])], 
      controllers: [TtsController],
      providers: [TtsService ],
    }).compile();

    controller = module.get<TtsController>(TtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should  return a streamable file', async () => {
    const buffer = new Uint8Array([1, 2, 3]); 
    const speakSpy = jest.spyOn(controller,  'speak').mockResolvedValue(new StreamableFile(buffer)); 
    const rcvReadableStream = (await controller.speak("Ciao", "it")).getStream(); 
    const rcvBuffer = new  Uint8Array (await getBufferFromStream(rcvReadableStream)); 
    expect(rcvBuffer).toEqual(buffer);
  });
});
