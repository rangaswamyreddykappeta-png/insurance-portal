export class ClaimResponseDto {
  id: string;
  claimNumber: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  policy: any;
  submittedBy: any;
  documents: any[];
  reviews: any[];
  activityLogs: any[];
}