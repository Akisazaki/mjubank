export interface Customer {
  ssn: number
  name: string
  address: string
  birthday?: Date
  email: string
  tel?: string
  job?: String
  disabled_at?: Date
  customer_type: number
  accessToken: string
}