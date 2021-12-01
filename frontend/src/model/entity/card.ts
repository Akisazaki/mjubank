export interface Card {
  card_id: number
  application_date: Date
  limit?: number
  card_type: number
  account_id: number
  dropped_at?: number
  expired_at: number
}