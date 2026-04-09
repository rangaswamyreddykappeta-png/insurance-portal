import{
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Claim } from '../../claims/entities/claim.entity';

@Entity('policies')
export class Policy {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'policy_number', unique: true })
    policyNumber: string;

    @Column({ name: 'policy_name' })
    policyName: string;

    @Column({ name: 'coverage_type'})
    coverageType: string;

    @Column({ name: 'start_date', type: 'date' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'date' })
    endDate: Date;

    @ManyToOne(() => User, (user) => user.policies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
    
    @OneToMany(() => Claim, (claim) => claim.policy)
    claims: Claim[];
}