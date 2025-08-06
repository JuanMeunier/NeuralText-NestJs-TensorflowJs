import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    picture?: string;

    @IsString()
    @IsNotEmpty()
    googleId: string;
}