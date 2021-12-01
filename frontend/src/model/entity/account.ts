export interface Account {
  account_id: number
  account_type: number
  balance: number
  created_at: Date
  ssn: number
  disabled_at?: Date
}