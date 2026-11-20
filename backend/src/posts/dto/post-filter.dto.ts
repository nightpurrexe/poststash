import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class PostFiltersDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  uncategorized?: boolean;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;
}
