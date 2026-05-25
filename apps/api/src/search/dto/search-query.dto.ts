import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  q: string;

  @ApiPropertyOptional({ enum: ['recent', 'popular'] })
  @IsOptional()
  @IsEnum(['recent', 'popular'])
  sort?: 'recent' | 'popular';
}
