import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ListFilesDTO {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: true, description: 'page', example: 1 })
  pageNo: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: true, description: 'limit', example: 10 })
  limit: number;

  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'filter', example: {} })
  filter: Record<string, unknown>;

  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: { _id: -1 },
  })
  sort: Record<string, unknown>;
}
