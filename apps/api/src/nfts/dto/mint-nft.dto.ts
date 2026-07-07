import { IsMongoId, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MintNftDto {
  @ApiProperty({ description: 'Mongo ObjectId of the cast to mint as an NFT' })
  @IsMongoId()
  castId: string;

  @ApiProperty()
  @IsString()
  tokenUri: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  maxEdition: number;
}
