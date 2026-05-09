import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Media {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    nullable: false
  })
  url: string;

  @Column({
    type: "varchar",
    unique: true,
    nullable: false
  })
  publicId: string;

  @Column({
    type: "varchar",
    unique: true,
    nullable: true
  })
  mimetype?: string;

  @Column({
    type: "varchar",
    nullable: false
  })
  userId: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  productId?: string;
}
