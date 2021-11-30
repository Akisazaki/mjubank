import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Card } from './card'

@Entity({ name: "card_transaction" })
export class CardTransaction {
  @PrimaryGeneratedColumn("increment", { type: "bigint", unsigned: true })
  serial_number!: number

  @Column({ type: "bigint", unsigned: true })
  @OneToOne(_ => Card, card => card.card_id)
  card_id!: number

  @Column({ type: "datetime" })
  card_transaction_date!: Date

  @Column("decimal", { precision: 15, scale: 2 })
  amount!: number

  @Column({ type: "datetime", default: null })
  canceled_at?: Date
}