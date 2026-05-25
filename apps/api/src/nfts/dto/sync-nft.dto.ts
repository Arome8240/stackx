import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SyncNftDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  tokenId: number;

  @ApiProperty()
  @IsString()
  owner: string;

  @ApiProperty()
  @IsString()
  creator: string;

  @ApiProperty()
  @IsString()
  tokenUri: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cast?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  edition?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxEdition?: number;
}
