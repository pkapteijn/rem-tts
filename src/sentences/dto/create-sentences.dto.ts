import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class CreateSentencesDto {
    @ApiProperty()
    @IsNotEmpty()
    sentence: string;
    
    @ApiProperty()
    @IsIn(["it", "en", "nl"])
    language: string; 
}
