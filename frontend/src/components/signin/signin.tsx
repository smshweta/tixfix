import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './signin.css'
import { login } from '../../service/user.service'
import { type Auth } from '../../models/user'
import { type AxiosResponse } from 'axios'

const SignIn = (): JSX.Element => {
  const navigate = useNavigate()
  // React States
  const [errorMessages, setErrorMessages] = useState({ name: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const errors = {
    uname: 'invalid username',
    pass: 'invalid password',
    server: 'server error: '
  }

  const handleSubmit = (event: { preventDefault: () => void }): void => {
    // Prevent page reload
    event.preventDefault()

    const { uname, pass } = document.forms[0]

    if (uname === undefined || uname.value.length < 3) {
      setErrorMessages({ name: 'uname', message: errors.uname })
      return
    }

    if (pass === undefined || pass.value.length < 3) {
      setErrorMessages({ name: 'pass', message: errors.pass })
      return
    }

    login(uname.value, pass.value).then((res: AxiosResponse<Auth>) => {
      if (res.status === 200) {
        setIsSubmitted(true)
        localStorage.setItem('token', res.data.accessToken)
        localStorage.setItem('role', res.data.role)
        navigate('/dashboard')
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
        {renderErrorMessage('server')}
        <div className="newuser-instead" onClick={() => { navigate('/signup') }}>New User? Register</div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  )

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Sign In</div>
        {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
      </div>
    </div>
  )
}

export default SignIn
