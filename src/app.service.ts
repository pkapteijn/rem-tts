import { Injectable } from '@nestjs/common';
import { freemem, loadavg, hostname, platform, version } from 'os';

type Heartbeat = {
  timestamp: Date, 
  freemem: number,
  loadavg: number[],  
  hostname: string, 
  platform: string, 
  version: string
}

@Injectable()
export class AppService {
  getHeartbeat(): Heartbeat {
    const heartbeat: Heartbeat = {
      timestamp:  new Date(), 
      freemem: freemem(), 
      loadavg: loadavg(), 
      hostname: hostname(), 
      platform: platform(), 
      version: version()
    }
    return heartbeat;
  }
}
