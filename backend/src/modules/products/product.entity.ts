import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  productId: string;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  shoeType: string;

  @Column()
  scenario: string;

  @Column({ nullable: true })
  lastWidth: string;

  @Column({ nullable: true })
  runningStage: string;

  @Column({ nullable: true })
  positioning: string;

  @Column({ nullable: true })
  cushioning: string;

  @Column({ nullable: true })
  stability: string;

  @Column({ nullable: true })
  sensitivity: string;

  @Column({ nullable: true })
  weightHint: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
