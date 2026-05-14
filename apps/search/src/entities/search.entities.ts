import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum Status {
  Active = "active",
  Draft = "draft"
}
@Entity()
export class Search {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  name: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  normalizedText: string;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.Active
  })
  status: Status;

  @Column({
    type:"number",
    nullable:false
  })

  price:number
}
