import { IsEnum } from "class-validator";

export enum ClaimStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export class UpdateClaimStatusDto {
  @IsEnum(ClaimStatus)
  status: ClaimStatus;
}