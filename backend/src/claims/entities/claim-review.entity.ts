import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Claim } from './claim.entity';
import { User } from '../../users/entities/user.entity';
import { ReviewAction } from '../../common/enums/review-action.enum';

@Entity('claim_reviews')
export class ClaimReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ReviewAction,
  })
  action: ReviewAction;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @Column({ name: 'assigned_adjuster', type: 'varchar', nullable: true })
  assignedAdjuster: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Claim, (claim) => claim.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reviewed_by' })
  reviewedBy: User;
}