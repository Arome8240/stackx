import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Unique username (3-20 chars, alphanumeric + underscores)' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'username can only contain letters, numbers, and underscores' })
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password (min 8 chars)' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
