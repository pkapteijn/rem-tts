import { Injectable } from '@nestjs/common';
import { freemem } from 'os';

type Heartbeat = {
  timestamp: Date, 
  freemem: number
}

@Injectable()
export class AppService {
  getHeartbeat(): Heartbeat {
    const heartbeat: Heartbeat = {
      timestamp:  new Date(), 
      freemem: freemem()
    }
    return heartbeat;
  }
}
