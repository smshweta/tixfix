import React, { useEffect, useState } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import './dashboard.css'
import { AgGridReact } from 'ag-grid-react'
import { type ColDef } from 'ag-grid-community'
import { createTicket, getAllTickets, updateTicketAssignedto, updateTicketStatus } from '../../service/ticket.service'
import { type Ticket } from '../../models/ticket'
import { type AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'

const Dashboard = (): JSX.Element => {
  const navigate = useNavigate()
  const [rowData, setRowData] = useState<Ticket[]>([])

  useEffect(() => {
    getAllTickets().then((res: AxiosResponse<Ticket[]>) => {
      setRowData(res.data)
    }).catch((err: Error) => {
      setErrorMessages({ name: 'server', message: 'error from backend' + err.message })
      navigate('/signin')
    })
  }, [])

  const [errorMessages, setErrorMessages] = useState({ name: '', message: '' })
  const [newTicketFormStyleDisplay, setNewTicketFormStyleDisplay] = useState(false)

  const role = localStorage.getItem('role')

  const isEmployee = role === 'employee'
  const isAdmin = role === 'admin'
  const isCustomer = role === 'customer'

  const statusHeaderName = isEmployee ? 'Status (editable): ' : 'Status'

  const assignedUsernameHeader = isAdmin ? 'Assigned To (editable): ' : 'Assigned To'

  const updateRowDataStatus = (event: { data: { id: number, status: string } }): void => {
    const { status } = event.data
    const { id } = event.data
    updateTicketStatus(id, status).then((res: AxiosResponse<Ticket>) => {
      if (res.status === 200) {
        window.location.reload()
      } else if (res.status === 401) {
        navigate('/signin')
      } else {
        setErrorMessages({ name: 'server', message: 'server error: ' + res.status })
      }
    }).catch((err: Error) => {
      setErrorMessages({ name: 'server', message: 'error from backend' + err.message })
      navigate('/signin')
    })
  }

  const updateRowDataAssignedto = (event: { data: { id: number, assigned_uname: string } }): void => {
    const assignedUname = event.data.assigned_uname
    const { id } = event.data
    updateTicketAssignedto(id, assignedUname).then((res: AxiosResponse<Ticket>) => {
      if (res.status === 200) {
        window.location.reload()
      } else if (res.status === 401) {
        navigate('/signin')
      } else {
        setErrorMessages({ name: 'server', message: 'server error: ' + res.status })
      }
    }).catch((err: Error) => {
      setErrorMessages({ name: 'server', message: 'error from backend' + err.message })
      navigate('/signin')
    }).catch((err: Error) => {
      setErrorMessages({ name: 'server', message: 'error from backend' + err.message })
      navigate('/signin')
    })
  }

  const fields: ColDef[] = [
    { field: 'name', sortable: true, resizable: true, filter: true },
    { field: 'description', sortable: true, resizable: true },
    { field: 'status', sortable: true, resizable: true, filter: true, editable: isEmployee, headerName: statusHeaderName, onCellValueChanged: updateRowDataStatus },
    { field: 'assigned_uname', sortable: true, resizable: true, headerName: assignedUsernameHeader, filter: true, editable: isAdmin, onCellValueChanged: updateRowDataAssignedto },
    { field: 'created', sortable: true, resizable: true },
    { field: 'modified', sortable: true, resizable: true },
    { field: 'customer_uname', sortable: true, resizable: true, headerName: 'Customer Username', filter: true }
  ]
  const [columnDefs] = useState(fields)

  const handleSubmit = (event: { preventDefault: () => void }): void => {
    // Prevent page reload
    event.preventDefault()

    const { ticketname, description } = document.forms[0]
    const errors = {
      input: 'Input missing',
      server: 'server error: '
    }

    createTicket(ticketname.value, description.value).then((res: AxiosResponse<Ticket>) => {
      if (res.status === 200) {
        window.location.reload()
      } else if (res.status === 401) {
        navigate('/signin')
      } else {
        setErrorMessages({ name: 'server', message: errors.server + res.status })
      }
    }).catch((err: Error) => {
      setErrorMessages({ name: 'server', message: 'error from backend' + err.message })
      navigate('/signin')
    })
  }

  // Generate JSX code for error message
  const renderErrorMessage = (name: string): boolean | JSX.Element =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    )

  const newTicketForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Name </label>
          <input type="text" name="ticketname" required />
        </div>
        <div className="input-container">
          <label>Description</label>
          <textarea name="description"></textarea>
        </div>
        {renderErrorMessage('server')}
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  )

  return (
    <div className='dashboard-container'>
      <div className="dialog-overlay" style={{ display: newTicketFormStyleDisplay ? 'block' : 'none' }}>
        <div className="dialog">
          <div className="dialog-header">
            <h3>New Ticket</h3>
            <button className="close-button"
              onClick={() => { setNewTicketFormStyleDisplay(!newTicketFormStyleDisplay) }}>X</button>
          </div>
          {newTicketForm}
        </div>
      </div>
      <div className="header">
        <button className="header-button" disabled={!isCustomer} id="new" onClick={() => { setNewTicketFormStyleDisplay(!newTicketFormStyleDisplay) }}>
          New
        </button>
        <div className='header-title'>
          <h1>Ticketing System - {role}</h1>
        </div>
        <button className="header-button" id="logout" onClick={() => { navigate('/signin') }}>
          Logout
        </button>
      </div>
      <div className="dashboard-content ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
        ></AgGridReact>
      </div>
    </div >
  )
}

export default Dashboard
