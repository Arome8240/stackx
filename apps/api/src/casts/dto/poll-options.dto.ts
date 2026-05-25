import { IsArray, IsString, MinLength, MaxLength, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePollDto {
  @ApiProperty({ type: [String], minItems: 2, maxItems: 4 })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(100, { each: true })
  options: string[];

  @ApiProperty({ description: 'Poll duration in hours' })
  durationHours?: number;
}
