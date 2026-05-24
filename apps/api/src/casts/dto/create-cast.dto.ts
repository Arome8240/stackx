import { IsArray, IsMongoId, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCastDto {
  @ApiProperty({ description: 'Cast content', maxLength: 560 })
  @IsString()
  @MinLength(1)
  @MaxLength(560)
  content: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  replyTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  channel?: string;
}
