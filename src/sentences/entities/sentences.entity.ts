import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

type LanguageType = "it"|"en"|"nl";

@Entity()
export class Sentences {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sentence: string;

  @Column()
  language: string;  //LanguageType;

  @Column() 
  times_used: number; 

  @Column()
  last_used: Date; 
}
