import { User } from "apps/auth/src/entities/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ProductStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE"
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({
    type: "varchar",
    length: 256,
    nullable: false
  })
  name: string;
  @Column({
    nullable: false
  })
  price: number;

  @Column({
    type: "text",
    nullable: true
  })
  description: string;

  @Column({
    type: "varchar",
    length: 1024,
    nullable: true
  })
  imageUrl?: string;
  @Column({
    type: "enum",
    enum: ProductStatus,
    default: ProductStatus.DRAFT
  })
  status: ProductStatus;

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;
@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;
}
