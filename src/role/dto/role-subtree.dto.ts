import { IsString } from 'class-validator';

export class RoleSubtreeDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  parentId: string;
}
