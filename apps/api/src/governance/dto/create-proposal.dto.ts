import { IsString, IsEnum, IsInt, Min, Max, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProposalDto {
  @ApiProperty({ minLength: 10, maxLength: 120 })
  @IsString()
  @MinLength(10)
  @MaxLength(120)
  title: string;

  @ApiProperty({ minLength: 50, maxLength: 2000 })
  @IsString()
  @MinLength(50)
  @MaxLength(2000)
  description: string;

  @ApiProperty({ enum: ['protocol', 'treasury', 'community', 'technical'] })
  @IsEnum(['protocol', 'treasury', 'community', 'technical'])
  category: string;

  @ApiProperty({ minimum: 1, maximum: 30 })
  @IsInt()
  @Min(1)
  @Max(30)
  durationDays: number;

  @ApiProperty({ minimum: 10 })
  @IsInt()
  @Min(10)
  quorum: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  onChainId?: string;
}
