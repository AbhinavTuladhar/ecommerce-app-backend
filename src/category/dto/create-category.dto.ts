import { IsNotEmpty, IsString } from 'class-validator';

// Used in both creation and update of category.
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
