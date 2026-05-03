import { Role } from "@app/common/enum.types";
import { Product } from "apps/product/src/entity/product.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 256,
    unique: true,
    nullable: false
  })
  email: string;

  @Column({
    type: "varchar",
    length: 512,
    unique: true,
    nullable: true
  })
  refreshToken?: string;

  @Column({
    type: "varchar",
    length: 256,
    nullable: false
  })
  name: string;

  @Column({
    type: "varchar",
    length: 256,
    nullable: false
  })
  password: string;

  @Column({
    type: "boolean",
    default: false
  })
  isAdmin: boolean;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER
  })
  role: Role;

  @OneToMany(() => Product, (product) => product.user)
  products:Product[]


  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
