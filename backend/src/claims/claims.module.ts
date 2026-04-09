import { Module } from '@nestjs/common';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Claim } from './entities/claim.entity';
import { ClaimDocument } from './entities/claim-document.entity';
import { Policy } from 'src/policies/entities/policy.entity';
import { User } from 'src/users/entities/user.entity';
import { ClaimReview } from './entities/claim-review.entity';
import { ClaimActivityLog } from './entities/claim-activity-log.entity';

@Module({
  controllers: [ClaimsController],
  providers: [ClaimsService],
  imports: [TypeOrmModule.forFeature([Claim, ClaimDocument, Policy, User, ClaimReview, ClaimActivityLog])]
})
export class ClaimsModule {}
