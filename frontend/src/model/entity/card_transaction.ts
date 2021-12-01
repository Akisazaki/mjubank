export interface CardTransaction {
  serial_number: Number
  card_id: number
  card_transaction_date: Date
  amount: number
  canceled_at?: Date
}