import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm'
import { Account } from './account'

@Entity({ name: "card" })
export class Card {
  @PrimaryColumn({ type: "bigint", unsigned: true })
  card_id!: number

  @Column({ type: "datetime" })
  application_date!: Date

  @Column({ type: "decimal", precision: 15, scale: 2, unsigned: true })
  limit?: number

  @Column({ type: "tinyint", unsigned: true })
  card_type!: number

  @Column({ type: "bigint", unsigned: true })
  @OneToOne(_ => Account, account => account.account_id)
  account_id!: number

  @Column({ type: "datetime" })
  dropped_at?: number

  @Column({ type: "datetime" })
  expired_at?: Date
}