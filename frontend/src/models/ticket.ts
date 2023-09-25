export interface Ticket {
  id?: number
  name: string
  description: string
  created?: Date
  modified?: Date
  status: string
  customer_id: number
  assigned_id?: number
  assigned_uname?: string | null
  customer_uname?: string
}

export enum Status {
  OPEN = 'open',
  IN_PROGRESS = 'in progress',
  CLOSED = 'closed',
}
