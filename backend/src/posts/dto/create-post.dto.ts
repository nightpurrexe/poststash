import { IsNumber, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { PostOwnerDto } from "./post-owner.dto.js";

export class CreatePostDto {
  @IsString()
  url: string;

  @IsString()
  type: string;

  @IsString()
  shortcode: string;

  @IsString()
  productType: string;

  @IsString()
  @Transform(({ value }) => value ?? "-")
  caption: string;

  @IsNumber()
  @Transform(({ value }) => value ?? 0)
  slideCount: number = 0;

  @ValidateNested()
  @Type(() => PostOwnerDto)
  owner: PostOwnerDto;
}
