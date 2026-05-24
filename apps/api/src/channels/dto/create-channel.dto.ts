import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ description: 'Unique channel slug (lowercase, no spaces)', pattern: '^[a-z0-9-]+$' })
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @Matches(/^[a-z0-9-]+$/, { message: 'name must be lowercase alphanumeric with hyphens only' })
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  displayName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(280)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @ApiPropertyOptional({ default: 0, description: 'Entry fee in STX (whole units)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  entryFeeStx?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isNsfw?: boolean;
}
