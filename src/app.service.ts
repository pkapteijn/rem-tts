import { Injectable } from '@nestjs/common';
import { Heartbeat } from './app.heartbeat';

@Injectable()
export class AppService {
  getHeartbeat(): Heartbeat {
    const heartbeat = new Heartbeat();
    return heartbeat.get();
  }
}
