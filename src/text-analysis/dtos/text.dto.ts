import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class AnalyzeTextDto {
    @ApiProperty({
        description: 'Texto a analizar con múltiples modelos de IA',
        example: 'Estoy muy feliz con los resultados del proyecto. El equipo de Microsoft trabajó excelente y Juan lideró todo perfectamente.',
        minLength: 1,
        maxLength: 5000,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1, { message: 'El texto no puede estar vacío' })
    @MaxLength(5000, { message: 'El texto no puede superar 5000 caracteres' })
    text: string;
}