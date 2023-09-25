import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './signup.css'

import { createUser } from '../../service/user.service'
import { type AxiosResponse } from 'axios'
import { type User } from '../../models/user'

const SignUp = (): JSX.Element => {
  const navigate = useNavigate()

  if (localStorage.getItem('token') !== null) {
    navigate('/dashboard')
  }

  // React States
  const [errorMessages, setErrorMessages] = useState({ name: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const errors = {
    server: 'server error: '
  }

  const handleSubmit = (event: { preventDefault: () => void }): void => {
    // Prevent page reload
    event.preventDefault()

    const { uname, firstname, lastname, email, pass, userRole } = document.forms[0]

    createUser(uname.value, firstname.value, lastname.value, email.value, pass.value, userRole.value).then((res: AxiosResponse<User>) => {
      if (res.status === 200) {
        setIsSubmitted(true)
        navigate('/signin')
      } else {
        setErrorMessages({ name: 'server', message: errors.server + res.status })
      }
    }).catch((err: Error) => {
      setErrorMessages({ name: 'server', message: 'error while authenticationg from backend' + err.message })
    })
  }

  // Generate JSX code for error message
  const renderErrorMessage = (name: string): boolean | JSX.Element =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    )

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage('uname')}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage('pass')}
        </div>
        <div className="input-container">
          <label>Email </label>
          <input type="email" name="email" required />
          {renderErrorMessage('email')}
        </div>
        <div className="input-container">
          <label>First Name </label>
          <input type="firstname" name="firstname" required />
          {renderErrorMessage('firstname')}
        </div>
        <div className="input-container">
          <label>Last Name </label>
          <input type="lastname" name="lastname" required />
          {renderErrorMessage('lastname')}
        </div>
        <div className="input-container">
          <label>Role </label>
          <select name="userRole" id="userRole" required>
            <option value="employee" selected>Employee</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {renderErrorMessage('server')}

        <div className="signin-instead" onClick={() => { navigate('/signin') }}>Sign in instead</div>

        <div className="button-container">
          <input type="submit" />
        </div>
      </form >
    </div >
  )

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Sign Up</div>
        {isSubmitted ? <div>User is successfully registered</div> : renderForm}
      </div>
    </div>
  )
}

export default SignUp
