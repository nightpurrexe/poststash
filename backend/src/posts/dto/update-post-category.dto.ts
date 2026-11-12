import { IsUUID } from "class-validator";

export class UpdatePostCategoryDto {
  @IsUUID()
  categoryId: string;
}