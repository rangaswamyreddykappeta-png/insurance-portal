import { IsNotEmpty, IsString } from 'class-validator';

export class AssignAdjusterDto {
  @IsString()
  @IsNotEmpty()
  adjusterName: string;
}