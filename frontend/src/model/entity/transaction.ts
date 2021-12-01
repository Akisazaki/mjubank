export interface Transaction {
  serial_number: number
  account_id: number
  transaction_type: number
  transaction_date: Date
  note?: string
  amount: number
  balance_after: number
  counter_party_account: number
}