import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: "customer" })
export class Customer {
  @PrimaryColumn({ type: "bigint", unique: true, unsigned: true })
  ssn!: number

  @Column({ type: "varchar", length: 45 })
  name!: string

  @Column({ type: "varchar", length: 45 })
  address!: string

  @Column({ type: "date", default: null })
  birthday?: Date

  @Column({ type: "varchar", length: 45 })
  email!: string

  @Column({ type: "varchar", length: 15 })
  tel?: string

  @Column({ type: "varchar", length: 45 })
  job?: string

  @Column({ type: "binary", length: 20 })
  password!: string

  @Column({ type: "datetime", default: null })
  disabled_at?: Date

  @Column({ type: "tinyint", unsigned: true })
  customer_type!: number
}