import { IsString } from "class-validator";

export class PostOwnerDto {
  @IsString()
  username: string;

  @IsString()
  fullName?: string | null;
}