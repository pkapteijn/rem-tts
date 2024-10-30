import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import type { LanguageType } from '../sentences.types';

@Entity()
export class Sentences {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sentence: string;

  @Column()
  language: LanguageType;

  @Column()
  times_used: number;

  @Column()
  last_used: Date;
 
  @Column({type: "bytea", nullable: true})
  audio: Buffer; 
  
  @Column({type: 'text', nullable: true})
  audio_format: string;
}
