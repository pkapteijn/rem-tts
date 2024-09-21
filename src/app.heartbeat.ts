import { freemem, loadavg, hostname, platform, version } from 'os';

export class Heartbeat {
  timestamp: Date;
  freemem: number;
  loadavg: number[];
  hostname: string;
  platform: string;
  version: string;

  get(): Heartbeat {
    this.timestamp = new Date();
    this.freemem = freemem();
    this.loadavg = loadavg();
    this.hostname = hostname();
    this.platform = platform();
    this.version = version();

    return this;
  }
}
