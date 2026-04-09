import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { Claim } from './entities/claim.entity';
import { Policy } from '../policies/entities/policy.entity';
import { User } from '../users/entities/user.entity';
import { ClaimDocument } from './entities/claim-document.entity';
import { CreateClaimDto } from './dto/create-claim.dto';

import { ClaimReview } from './entities/claim-review.entity';
import { ClaimActivityLog } from './entities/claim-activity-log.entity';
import { ReviewAction } from 'src/common/enums/review-action.enum';
import { ActivityType } from 'src/common/enums/activity-type.enum';
import { ClaimStatus } from 'src/common/enums/claim-status.enum';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,

    @InjectRepository(Policy)
    private readonly policyRepository: Repository<Policy>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ClaimDocument)
    private readonly claimDocumentRepository: Repository<ClaimDocument>,

    @InjectRepository(ClaimReview)
    private readonly claimReviewRepository: Repository<ClaimReview>,

    @InjectRepository(ClaimActivityLog)
    private readonly claimActivityLogRepository: Repository<ClaimActivityLog>,
  ) {}

  private createS3Client(): S3Client {
    return new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async create(
    createClaimDto: CreateClaimDto,
    currentUserId: string,
  ): Promise<Claim> {
    const policy = await this.policyRepository.findOne({
      where: { id: createClaimDto.policyId },
    });

    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
    });

    if (!user) {
      throw new NotFoundException('Submitting user not found');
    }

    const claimNumber = `CLM-${Date.now()}`;

    const claim = this.claimRepository.create({
      claimNumber,
      title: createClaimDto.title,
      description: createClaimDto.description,
      policy,
      submittedBy: user,
    });

    return this.claimRepository.save(claim);
  }

async findAll(): Promise<any[]> {
  const claims = await this.claimRepository.find({
    relations: {
      policy: true,
      submittedBy: true,
      documents: true,
      reviews: {
        reviewedBy: true,
      },
      activityLogs: {
        performedBy: true,
      },
    },
    order: {
      createdAt: 'DESC',
    },
  });
  return claims.map((claim) => this.mapClaim(claim));
}

  async updateStatus(
    claimId: string,
    status: string,
  ): Promise<Claim> {
    const claim = await this.claimRepository.findOne({
      where: { id: claimId },
      relations: {
        policy: true,
        submittedBy: true,
        documents: true,
      },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    claim.status = status as any;
    return this.claimRepository.save(claim);
  }

  async uploadDocument(
    claimId: string,
    file: Express.Multer.File,
  ): Promise<ClaimDocument> {
    const claim = await this.claimRepository.findOne({
      where: { id: claimId },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    const bucketName = process.env.AWS_S3_BUCKET;
    if (!bucketName) {
      throw new Error('Missing AWS_S3_BUCKET in configuration');
    }

    const s3Key = `claims/${claimId}/${Date.now()}-${file.originalname}`;
    const s3Client = this.createS3Client();

    try {
      console.log('AWS ENV CHECK', {
        region: process.env.AWS_REGION,
        hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
        bucket: process.env.AWS_S3_BUCKET,
      });

      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (error) {
      console.error('S3 upload failed:', error);
      throw error;
    }

    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    const document = this.claimDocumentRepository.create({
      fileName: file.originalname,
      fileUrl,
      s3Key,
      claim,
    });

    return this.claimDocumentRepository.save(document);
  }

  async getClaimDocuments(claimId: string): Promise<ClaimDocument[]> {
    const claim = await this.claimRepository.findOne({
      where: { id: claimId },
      relations: {
        documents: true,
      },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    return claim.documents;
  }

  async generateDocumentDownloadUrl(
    documentId: string,
  ): Promise<{ downloadUrl: string }> {
    const document = await this.claimDocumentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const bucketName = process.env.AWS_S3_BUCKET;
    if (!bucketName) {
      throw new Error('Missing AWS_S3_BUCKET in configuration');
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: document.s3Key,
    });

    const s3Client = this.createS3Client();

    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });

    return { downloadUrl };
  }
  private async logActivity(
    claim: Claim,
    type: ActivityType,
    description: string,
    performedBy: User | null,
  ): Promise<void> {
    const log = this.claimActivityLogRepository.create({
      claim,
      type,
      description,
      performedBy,
    });

    await this.claimActivityLogRepository.save(log);
  }
async assignAdjuster(
  claimId: string,
  adjusterName: string,
  adminUserId: string,
): Promise<ClaimReview> {
  const claim = await this.claimRepository.findOne({
    where: { id: claimId },
  });

  if (!claim) {
    throw new NotFoundException('Claim not found');
  }

  const admin = await this.userRepository.findOne({
    where: { id: adminUserId },
  });

  if (!admin) {
    throw new NotFoundException('Admin user not found');
  }

  const review = this.claimReviewRepository.create({
    claim,
    reviewedBy: admin,
    action: ReviewAction.ASSIGN,
    assignedAdjuster: adjusterName,
    note: `Assigned adjuster: ${adjusterName}`,
  });

  const savedReview = await this.claimReviewRepository.save(review);

  await this.logActivity(
    claim,
    ActivityType.ADJUSTER_ASSIGNED,
    `Adjuster assigned: ${adjusterName}`,
    admin,
  );

  return savedReview;
}
async approveClaim(
  claimId: string,
  note: string,
  adminUserId: string,
): Promise<Claim> {
  console.log('approveClaim input', { claimId, note, adminUserId });

  const claim = await this.claimRepository.findOne({
    where: { id: claimId },
  });

  if (!claim) {
    throw new NotFoundException('Claim not found');
  }

  const admin = await this.userRepository.findOne({
    where: { id: adminUserId },
  });

  if (!admin) {
    throw new NotFoundException('Admin user not found');
  }

  console.log('claim before approve', claim);
  console.log('admin approving', admin);

  claim.status = ClaimStatus.APPROVED;
  const updatedClaim = await this.claimRepository.save(claim);

  console.log('claim after approve save', updatedClaim);

  const review = this.claimReviewRepository.create({
    claim,
    reviewedBy: admin,
    action: ReviewAction.APPROVE,
    note,
    assignedAdjuster: null,
  });

  console.log('approve review entity', review);

  await this.claimReviewRepository.save(review);

  await this.logActivity(
    claim,
    ActivityType.CLAIM_APPROVED,
    `Claim approved: ${note}`,
    admin,
  );

  return updatedClaim;

}
async rejectClaim(
  claimId: string,
  note: string,
  adminUserId: string,
): Promise<Claim> {
  const claim = await this.claimRepository.findOne({
    where: { id: claimId },
  });

  if (!claim) {
    throw new NotFoundException('Claim not found');
  }

  const admin = await this.userRepository.findOne({
    where: { id: adminUserId },
  });

  if (!admin) {
    throw new NotFoundException('Admin user not found');
  }

  claim.status = ClaimStatus.REJECTED;
  const updatedClaim = await this.claimRepository.save(claim);

  const review = this.claimReviewRepository.create({
    claim,
    reviewedBy: admin,
    action: ReviewAction.REJECT,
    note,
  });

  await this.claimReviewRepository.save(review);

  await this.logActivity(
    claim,
    ActivityType.CLAIM_REJECTED,
    `Claim rejected: ${note}`,
    admin,
  );

  return updatedClaim;
}
async getClaimActivityTimeline(claimId: string): Promise<ClaimActivityLog[]> {
  const claim = await this.claimRepository.findOne({
    where: { id: claimId },
  });

  if (!claim) {
    throw new NotFoundException('Claim not found');
  }

  return this.claimActivityLogRepository.find({
    where: {
      claim: { id: claimId },
    },
    relations: {
      performedBy: true,
    },
    order: {
      createdAt: 'ASC',
    },
  });
}
async addReviewNote(
  claimId: string,
  note: string,
  adminUserId: string,
): Promise<ClaimReview> {
  const claim = await this.claimRepository.findOne({
    where: { id: claimId },
  });

  if (!claim) {
    throw new NotFoundException('Claim not found');
  }

  const admin = await this.userRepository.findOne({
    where: { id: adminUserId },
  });

  if (!admin) {
    throw new NotFoundException('Admin user not found');
  }

  const review = this.claimReviewRepository.create({
    claim,
    reviewedBy: admin,
    action: ReviewAction.Note,
    note,
    assignedAdjuster: null,
  });

  const savedReview = await this.claimReviewRepository.save(review);

  await this.logActivity(
    claim,
    ActivityType.REVIEW_NOTE_ADDED,
    `Admin added review note: ${note}`,
    admin,
  );

  return savedReview;
}
async findOne(claimId: string): Promise<Claim> {
  const claim = await this.claimRepository.findOne({
    where: { id: claimId },
    relations: {
      policy: true,
      submittedBy: true,
      documents: true,
      reviews: {
        reviewedBy: true,
      },
      activityLogs: {
        performedBy: true,
      },
    },
  });

  if (!claim) {
    throw new NotFoundException('Claim not found');
  }

  return claim;
}
private mapUser(user: any) {
  if (!user) return null;
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role ?? null,
  };
}

private mapClaim(claim: any) {
  return {
    id: claim.id,
    claimNumber: claim.claimNumber,
    title: claim.title,
    description: claim.description,
    status: claim.status,
    createdAt: claim.createdAt,
    policy: claim.policy,
    submittedBy: this.mapUser(claim.submittedBy),
    documents: claim.documents || [],
    reviews: (claim.reviews || []).map((review: any) => ({
      id: review.id,
      action: review.action,
      note: review.note,
      assignedAdjuster: review.assignedAdjuster,
      createdAt: review.createdAt,
      reviewedBy: this.mapUser(review.reviewedBy),
    })),
    activityLogs: (claim.activityLogs || []).map((log: any) => ({
      id: log.id,
      type: log.type,
      description: log.description,
      createdAt: log.createdAt,
      performedBy: this.mapUser(log.performedBy),
    })),
  };
}
}
