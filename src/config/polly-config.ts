import { Engine, OutputFormat } from '@aws-sdk/client-polly';

export class PollyConfig {
  voiceType: Engine = 'neural';  
  voices = { 
    // Available voices can also be obtained dynamically via the Polly API/SDK
    standard: {
      it: 'Giorgio',
      en: 'Brian',
      nl: 'Ruben',
    },
    neural: {
      it: 'Adriano',
      en: 'Joey',
      nl: 'Laura',
    },
  }; 
  outputFormat: OutputFormat = 'mp3'; //  OutputFormat: "json" || "mp3" || "ogg_vorbis" || "pcm", // required

  log(): string{
    let cfgLog = structuredClone(this); 
    delete cfgLog["log"]; 
    return JSON.stringify(cfgLog); 
  }
}
