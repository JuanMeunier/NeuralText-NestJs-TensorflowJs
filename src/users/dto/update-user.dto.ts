import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateProfileDto {
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan Carlos Pérez',
        required: false,
    })
    @IsString()
    @IsOptional()
    @MinLength(2)
    name?: string;

    @ApiProperty({
        description: 'URL de foto de perfil',
        example: 'https://example.com/avatar.jpg',
        required: false,
    })
    @IsString()
    @IsOptional()
    picture?: string;
}