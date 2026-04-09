export type User = {
  id: string;
  fullName: string;
  email: string;
  role: "customer" | "admin";
};

export type Policy = {
  id: string;
  policyNumber: string;
  policyName: string;
  coverageType: string;
  startDate: string;
  endDate: string;
};

export type ClaimDocument = {
  id: string;
  fileName: string;
  fileUrl?: string;
  createdAt?: string;
};

export type ClaimReview = {
  id: string;
  action: string;
  note: string | null;
  assignedAdjuster: string | null;
  createdAt: string;
  reviewedBy?: User;
};

export type ClaimActivityLog = {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  performedBy?: User | null;
};

export type Claim = {
  id: string;
  claimNumber: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  policy?: Policy;
  submittedBy?: User;
  documents?: ClaimDocument[];
  reviews?: ClaimReview[];
  activityLogs?: ClaimActivityLog[];
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};