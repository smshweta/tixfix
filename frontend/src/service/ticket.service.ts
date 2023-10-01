import axios, { type AxiosResponse } from 'axios'
import { type Ticket } from '../models/ticket'

const baseUrl: string = process.env.BACKEND_URL ?? ''
const config: {
  headers: { 'x-access-token': string | null }
} = {
  headers: {
    'x-access-token': null
  }
}

// eslint-disable-next-line max-len
export const createTicket = async (name: string, description: string): Promise<AxiosResponse<Ticket>> => {
  config.headers['x-access-token'] = localStorage.getItem('token')
  const ticket: {
    name: string
    description: string
  } = {
    name,
    description
  }
  const saveTicket: AxiosResponse<Ticket> = await axios.post(
    baseUrl + '/tickets', ticket, config
  )
  return saveTicket
}

export const getAllTickets = async (): Promise<AxiosResponse<Ticket[]>> => {
  config.headers['x-access-token'] = localStorage.getItem('token')
  const tickets: AxiosResponse<Ticket[]> = await axios.get(
    baseUrl + '/tickets', config
  )
  return tickets
}

export const getTicket = async (id: number): Promise<AxiosResponse<Ticket>> => {
  config.headers['x-access-token'] = localStorage.getItem('token')
  const ticket: AxiosResponse<Ticket> = await axios.get(
    baseUrl + '/tickets/' + id, config
  )
  return ticket
}

// eslint-disable-next-line max-len
export const updateTicketStatus = async (id: number, status: string): Promise<AxiosResponse<Ticket>> => {
  config.headers['x-access-token'] = localStorage.getItem('token')
  const body: {
    status: string
  } = {
    status
  }
  const updatedticket: AxiosResponse<Ticket> = await axios.put(
    baseUrl + '/tickets/' + id + '/status', body, config
  )
  return updatedticket
}

export const updateTicketAssignedto = async (id: number, assignedto: string): Promise<AxiosResponse<Ticket>> => {
  config.headers['x-access-token'] = localStorage.getItem('token')
  const body: {
    assigned_uname: string
  } = {
    assigned_uname: assignedto
  }
  const updatedticket: AxiosResponse<Ticket> = await axios.put(
    baseUrl + '/tickets/' + id + '/assignedto', body, config
  )
  return updatedticket
}
