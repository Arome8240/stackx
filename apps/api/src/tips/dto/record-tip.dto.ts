import { IsString, IsNumber, IsMongoId, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RecordTipDto {
  @ApiProperty()
  @IsMongoId()
  recipient: string;

  @ApiProperty()
  @IsMongoId()
  cast: string;

  @ApiProperty({ description: 'Amount in microSTX' })
  @IsNumber()
  @Min(1)
  amountMicroStx: number;

  @ApiProperty()
  @IsString()
  txId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  blockHeight?: number;
}
