import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm'
import { Customer } from './customer'

@Entity({ name: "account" })
export class Account {
  @PrimaryColumn({ type: "bigint", unique: true, unsigned: true })
  account_id!: number

  @Column({ type: "tinyint", unsigned: true })
  account_type!: number

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  balance!: number

  @Column({ type: "datetime" })
  created_at!: Date

  @Column({ type: "bigint", unsigned: true })
  @OneToOne(_ => Customer, customer => customer.ssn)
  ssn!: number

  @Column({ type: "datetime" })
  disabled_at?: Date
}