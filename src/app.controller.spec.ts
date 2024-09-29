import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';


describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('AppController', () => {

    it('should return  a proper heartbeat object', () => {
      const hb = appController.getHeartbeat();
      expect(hb).toHaveProperty('timestamp');
      expect(hb).toHaveProperty('freemem');
      expect(hb).toHaveProperty('loadavg');
      expect(hb).toHaveProperty('hostname');
      expect(hb).toHaveProperty('platform');
      expect(hb).toHaveProperty('version');
    });
  });
});
