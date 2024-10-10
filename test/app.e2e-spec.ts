import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';
import { Heartbeat } from './../src/app.heartbeat';

const hb = new Heartbeat(); 

describe('AppController (e2e)', () => {
  let app: INestApplication;
  console.log(hb); 
  let appService: AppService; 

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AppService]
    })
    .compile(); 

    appService = moduleFixture.get<AppService>(AppService); 
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
  jest.spyOn(appService, 'getHeartbeat' as never).mockImplementation(() => hb as never)

    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(hb)
        expect(body).toHaveProperty('timestamp');
        expect(body).toHaveProperty('freemem');
        expect(body).toHaveProperty('loadavg');
        expect(body).toHaveProperty('hostname');
        expect(body).toHaveProperty('platform');
        expect(body).toHaveProperty('version');
      });
  });
});
