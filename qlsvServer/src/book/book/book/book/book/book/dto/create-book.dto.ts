import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  author: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  isbn: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  publisher?: string;

  @IsInt()
  @IsOptional()
  publishYear?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  category?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  quantity?: number;
}
