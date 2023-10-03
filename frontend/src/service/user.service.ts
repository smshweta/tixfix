import axios, { type AxiosResponse } from 'axios'
import { type Auth, type User } from '../models/user'

const baseUrl: string = 'https://tixfix-app-87fae3062cce.herokuapp.com/api' ?? ''
const config: {
  headers: { 'x-access-token': string | null }
} = {
  headers: {
    'x-access-token': null
  }
}

export const createUser = async (username: string, firstname: string, lastname: string, email: string, password: string, role: string): Promise<AxiosResponse<User>> => {
  config.headers['x-access-token'] = localStorage.getItem('token')
  const user: {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    role: string
  } = {
    username,
    firstName: firstname,
    lastName: lastname,
    email,
    password,
    role

  }
  const saveUser: AxiosResponse<User> = await axios.post(
    baseUrl + '/users', user
  )
  return saveUser
}

export const login = async (username: string, password: string): Promise<AxiosResponse<Auth>> => {
  const user: {
    username: string
    password: string
  } = {
    username,
    password
  }
  const loginUser: AxiosResponse<Auth> = await axios.post(
    baseUrl + '/users/login', user
  )
  return loginUser
}

export const logout = async (): Promise<AxiosResponse<User>> => {
  const logoutUser: AxiosResponse<User> = await axios.get(
    baseUrl + '/users/logout', config
  )
  localStorage.setItem('token', '')
  localStorage.setItem('role', '')
  return logoutUser
}

export const getAllEmployees = async (): Promise<AxiosResponse<User[]>> => {
  config.headers['x-access-token'] = localStorage.getItem('token')
  const employees: AxiosResponse<User[]> = await axios.get(
    baseUrl + '/users/employees', config
  )
  return employees
}
