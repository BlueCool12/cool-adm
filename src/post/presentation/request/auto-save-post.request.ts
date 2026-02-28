import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AutoSavePostRequest {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  contentJson?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
