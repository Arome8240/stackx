import { IsMongoId, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendTipDto {
  @ApiProperty({ description: 'Mongo ObjectId of the cast being tipped' })
  @IsMongoId()
  castId: string;

  @ApiProperty({ description: 'Amount in microSTX' })
  @IsNumber()
  @Min(1)
  amountMicroStx: number;
}
