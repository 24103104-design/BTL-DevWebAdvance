import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  author: string;

  @Column({ length: 20, unique: true })
  isbn: string;

  @Column({ length: 100, nullable: true })
  publisher: string;

  @Column({ name: 'publish_year', nullable: true })
  publishYear: number;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ default: 1 })
  quantity: number;
}
