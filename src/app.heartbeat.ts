import { freemem, loadavg, hostname, platform, version } from 'os';

export class Heartbeat {
  timestamp: string;
  freemem: number;
  loadavg: number[];
  hostname: string;
  platform: string;
  version: string;

  constructor()  {
    this.timestamp = new Date().toString();
    this.freemem = freemem();
    this.loadavg = loadavg();
    this.hostname = hostname();
    this.platform = platform();
    this.version = version();
  }
}
