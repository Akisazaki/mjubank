import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './account';


@Entity({ name: "transaction" })
export class Transaction {
  @PrimaryGeneratedColumn('increment', { type: "bigint", unsigned: true })
  serial_number!: number;

  @Column({ type: "bigint", unsigned: true })
  @OneToOne(_ => Account, account => account.account_id)
  account_id!: number;

  @Column({ type: "tinyint" })
  transaction_type!: number

  @Column({ type: "datetime" })
  transaction_date!: Date

  @Column({ type: "varchar", length: 64 })
  note?: string

  @Column({ type: "decimal", precision: 15, scale: 2 })
  amount!: number

  @Column({ type: "decimal", precision: 15, scale: 2 })
  balance_after!: number

  @Column({ type: "bigint", unsigned: true })
  @OneToOne(_ => Account, account => account.account_id)
  counter_party_account!: number
}