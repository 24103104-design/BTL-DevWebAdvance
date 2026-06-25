import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt?: Date;
}