import { IsString, MinLength, MaxLength } from 'class-validator';

export class AnalyzeTextDto {
    @IsString()
    @MinLength(1)
    @MaxLength(5000)
    text: string;
}