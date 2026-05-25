import { IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ enum: ['cast', 'user', 'channel'] })
  @IsEnum(['cast', 'user', 'channel'])
  targetType: 'cast' | 'user' | 'channel';

  @ApiProperty()
  @IsMongoId()
  targetId: string;

  @ApiProperty({ enum: ['spam', 'harassment', 'misinformation', 'explicit', 'scam', 'other'] })
  @IsEnum(['spam', 'harassment', 'misinformation', 'explicit', 'scam', 'other'])
  reason: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  details?: string;
}
