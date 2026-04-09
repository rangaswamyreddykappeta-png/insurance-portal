import { IsNotEmpty, IsString } from 'class-validator';

export class ClaimDecisionDto {
  @IsString()
  @IsNotEmpty()
  note: string;
}