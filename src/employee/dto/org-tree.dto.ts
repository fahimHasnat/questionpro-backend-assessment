import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Employee DTO
export class OrgEmployeeDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsDateString()
  joined_at: string;
}

// Recursive Role Tree DTO
export class OrgTreeDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  parentId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrgEmployeeDto)
  @IsOptional()
  employees?: OrgEmployeeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrgTreeDto)
  @IsOptional()
  children?: OrgTreeDto[];
}
