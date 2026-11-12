import { IsNumber, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { PostOwnerDto } from './post-owner.dto.js';

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
  caption: string = '-';

  @IsNumber()
  slideCount: number = 0;

  @ValidateNested()
  @Type(() => PostOwnerDto)
  owner: PostOwnerDto;
}