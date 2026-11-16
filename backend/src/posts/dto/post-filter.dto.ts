import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class PostFiltersDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;
};