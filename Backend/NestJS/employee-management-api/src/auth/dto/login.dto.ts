import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginDto {
    
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}