import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Policy } from '../../policies/entities/policy.entity';
import { ClaimStatus } from '../../common/enums/claim-status.enum';
import { ClaimDocument } from './claim-document.entity';
import { ClaimReview } from './claim-review.entity';
import { ClaimActivityLog } from './claim-activity-log.entity';


@Entity('claims')
export class Claim {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'claim_number', unique: true })
    claimNumber: string;

    @Column()
    title: string

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'enum', enum: ClaimStatus, default: ClaimStatus.SUBMITTED })
    status: ClaimStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, ( user) => user.submittedClaims, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'submitted_by' })
    submittedBy: User;

    @ManyToOne(() => Policy, (policy) => policy.claims, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'policy_id' })
    policy: Policy;

    @OneToMany(() => ClaimDocument, (document) => document.claim, { cascade: true })
    documents: ClaimDocument[];

    @OneToMany(() => ClaimReview, (review) => review.claim, { cascade: true })
    reviews: ClaimReview[];

    @OneToMany(() => ClaimActivityLog, (log) => log.claim, { cascade: true })
    activityLogs: ClaimActivityLog[];
}
