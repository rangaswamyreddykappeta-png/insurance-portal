import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateClaimDto {
  @IsUUID()
  policyId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}