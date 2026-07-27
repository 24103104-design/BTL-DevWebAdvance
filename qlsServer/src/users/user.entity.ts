import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'USERS' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 100 })
  username!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ unique: true, length: 100 })
  email!: string;

  @Column({ length: 20, default: 'user' })
  role!: string;

  @Column({ name: 'avatarUrl', type: 'varchar', length: 255, nullable: true })
  avatarUrl?: string | null;

  @CreateDateColumn()
  createdAt?: Date;
}
